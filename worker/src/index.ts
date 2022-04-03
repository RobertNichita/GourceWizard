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

  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();

  channel.assertQueue(queue, {
    durable: true,
  });

  // See Fair Dispatch: https://www.rabbitmq.com/tutorials/tutorial-two-javascript.htmla
  // TODO: How many gource renders can be done at once from a consumer? Cap this per worker?a
  channel.prefetch(1);

  logger.info(`Waiting for messages in queue ${queue}`);

  channel.consume(
    queue,
    msg => {
      if (!msg) {
        // TODO: when does this happen?
        logger.error('msg is null');
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
          if (!uploadedURL) {
            throw 'uploadedURL is null.';
          }
          logger.info(`Successfully rendered video ${repoURL}`);
          apiClient.setStatus(videoId, status, uploadedURL, thumbnail); // this should always be success.
          channel.ack(msg);
        } else {
          logger.info(`Failed to rendered video ${repoURL}.`);
          channel.nack(msg);
          apiClient.setStatus(videoId, status); // TODO: this should be timeout or failire
        }
      });
    },
    {noAck: false}
  );
}

// TODO: Figure out inputs/outputs
consume();
