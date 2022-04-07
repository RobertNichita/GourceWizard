import * as amqp from 'amqplib';
import logger from './logger';
import config from './config';
import {GourceVideoRenderer, RenderStatus, VideoRenderer} from './render';
import {APIClient, GraphQLAPIClient} from './client';
import {RenderOptions, validateGourceSchema} from './schema/gource-schema';

async function consume(): Promise<void> {
  const apiClient: APIClient = new GraphQLAPIClient(
    config.backendURL,
    config.workerAuthSecret
  );

  const url = config.queueConfig.AMQPUrl;
  const queue = config.queueConfig.queueName;
  const s3Bucket = config.awsConfig.s3Bucket;
  const prefetchLimit = config.queueConfig.prefetchLimit;

  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();

  channel.assertQueue(queue, {
    durable: true,
  });

  function sanitizeRenderOptions(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/, '');
  }

  function insertRenderOptions(base: string, opts: RenderOptions): string {
    if (opts.key) {
      base = '--key '.concat(base);
    }
    if (opts.start) {
      base = `--start-position ${opts.start} `.concat(base);
    }
    if (opts.stop) {
      base = `--stop-position ${opts.stop} `.concat(base);
    }
    if (opts.title) {
      base = `--title ${opts.title} `.concat(base);
    }
    if (opts.elasticity) {
      base = `--elasticity ${opts.elasticity} `.concat(base);
    }
    if (opts.bloomIntensity) {
      base = `--bloom-multiplier ${opts.bloomIntensity} `.concat(base);
    }
    if (opts.bloomMultiplier) {
      base = `--bloom-intensity ${opts.bloomMultiplier} `.concat(base);
    }
    return base;
  }

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
        logger.error('Rejecting malformed message', e);
        channel.reject(msg, false);
        return;
      }

      let videoRenderer: VideoRenderer;
      const renderType = jsonMessage.renderType;
      const repoURL = jsonMessage.repoURL;
      const videoId = jsonMessage.videoId;
      const token = jsonMessage.token;
      const renderOptions = jsonMessage.renderOptions;

      renderOptions.title = renderOptions.title
        ? sanitizeRenderOptions(renderOptions.title.toString())
        : undefined;

      const gourceArgs = insertRenderOptions(
        '-r 25 -c 4 -s 0.1 -1280x720 -o -',
        renderOptions
      );

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
          config.cdnConfig.cdnRoot,
          token
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
