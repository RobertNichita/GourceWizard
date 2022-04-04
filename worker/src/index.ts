import * as amqp from 'amqplib';
import logger from './logger';
import config from './config';
import {GourceVideoRenderer, RenderStatus, VideoRenderer} from './render';
import {APIClient, GraphQLAPIClient} from './client';
import {validateGourceSchema} from './schema/gource-schema';

async function consume(): Promise<void> {
  const apiClient: APIClient = new GraphQLAPIClient(config.backendURL);

  const url = config.queueConfig.AMQPUrl;
  const queue = config.queueConfig.queueName;
  const s3Bucket = config.awsConfig.s3Bucket;
  const prefetchLimit = config.queueConfig.prefetchLimit;

  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();

  channel.assertQueue(queue, {
    durable: true,
  });

  channel.prefetch(prefetchLimit);

  logger.info(`Waiting for messages in queue ${queue}`);

  channel.consume(
    queue,
    msg => {
      if (!msg) {
        logger.error('Incoming message is null.');
        return;
      }

      let jsonMessage: any;
      try {
        jsonMessage = JSON.parse(msg.content.toString());
        logger.info('Incoming message', jsonMessage);

        if (!validateGourceSchema(jsonMessage)) {
          throw validateGourceSchema.errors;
        }
      } catch (e) {
        // TODO: Malformed message, we should reject it. Need to look up how to reject.
        logger.error('Rejecting malformed message', e);
        channel.reject(msg, false);
        return;
      }

      let videoRenderer: VideoRenderer;
      // TODO: sanitize inputs?
      const renderType = jsonMessage.renderType;
      const repoURL = jsonMessage.repoURL;
      const videoId = jsonMessage.videoId;

      // TODO: generate the string from the arguments.
      const gourceArgs = '-r 25 -c 4 -s 0.1 -1280x720 --key -o -';

      // Create HLS stream using ultrafast present to save time
      // and yuv420p pixel format (See "Encoding for dumb players" https://trac.ffmpeg.org/wiki/Encode/H.264)
      // The average segment is 2 seconds long.
      // See gource.sh for details.
      const ffmpegArgs = `-i - -preset ultrafast -pix_fmt yuv420p -start_number 0 -hls_time 2 -hls_list_size 0 -hls_segment_filename ${videoId}-%06d.ts -f hls ${videoId}.m3u8`;

      const timeout = (10 * 60).toString(); // 10 minutes

      if (renderType === 'GOURCE') {
        videoRenderer = new GourceVideoRenderer(
          repoURL,
          videoId,
          gourceArgs,
          ffmpegArgs,
          s3Bucket,
          timeout,
          config.cdnConfig.cdnRoot
        );
      } else {
        logger.error(
          'Unsupported video render type for message, rejecting it.',
          jsonMessage
        );
        channel.reject(msg, false);
        return;
      }

      videoRenderer!.render(async (status, uploadedURL, thumbnail) => {
        if (status === RenderStatus.success) {
          if (!uploadedURL || !thumbnail) {
            throw 'uploadedURL or thumbnail is null. This should not happen if the status is success!';
          }
          logger.info(`Successfully rendered video ${repoURL}`);
          await apiClient.setStatus(videoId, status, uploadedURL, thumbnail);
          channel.ack(msg);
        } else {
          logger.info(
            `Failed to rendered video ${repoURL} with status ${status}.`
          );
          if (status === RenderStatus.failure) {
            await apiClient.setStatus(
              videoId,
              status,
              undefined,
              'https://http.cat/204'
            );
          } else if (status === RenderStatus.timeout) {
            await apiClient.setStatus(
              videoId,
              status,
              undefined,
              'https://http.cat/408'
            );
          }

          channel.reject(msg, false);
        }
      });
    },
    {noAck: false}
  );
}

consume();
