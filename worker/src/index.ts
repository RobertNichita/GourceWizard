import * as amqp from 'amqplib';
import logger from './logger';
import config from './config';
import {v4 as uuid} from 'uuid';
import {GourceVideoRenderer, RenderStatus, VideoRenderer} from './render';
import {APIClient, MockAPIClient} from './client';

async function consume(): Promise<void> {
  const apiClient: APIClient = new MockAPIClient();

  const url = config.queueConfig.AMQPUrl;
  const queue = config.queueConfig.queueName;
  const s3Bucket = config.awsConfig.s3Bucket;

  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();

  channel.assertQueue(queue, {
    durable: true,
  });

  // See Fair Dispatch: https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
  // TODO: How many gource renders can be done at once from a consumer? Cap this per worker?
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

      logger.info(`Received message: ${msg.content.toString()}`);

      // TODO: validate message (json-schema) https://ajv.js.org/guide/typescript.html
      // TODO: turn message into arguments for gource.sh
      const mockMessage = {
          type: 'gource',
          repoURL: 'https://github.com/Raieen/Raieen.git',
          videoId: uuid(),
          gource: {
              specific_args: 'here',
              1: 'here',
              2: 'here',
              3: 'here',
              for_gource_and_ffmpeg: 'here',
              timeout: 600
          }
      }
      const type = 'gource';
      let videoRenderer: VideoRenderer;

      // Hard-coded arguments for gource.sh
      const repoURL = 'https://github.com/Raieen/Raieen.git';
      const videoId = uuid();
      const gourceArgs = '-r 25 -c 4 -s 0.1 --key -o -';
      const ffmpegArgs = `-y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 ${videoId}.mp4`;
      const timeout = (10 * 60).toString(); // 10 minutes

      if (type === 'gource') {
        videoRenderer = new GourceVideoRenderer(
          repoURL,
          videoId,
          gourceArgs,
          ffmpegArgs,
          s3Bucket,
          timeout,
          config.cdnConfig.cdnRoot
        );
      }

      videoRenderer!.render((status, uploadedURL) => {
        if (status === RenderStatus.success) {
          if (!uploadedURL) {
            throw 'uploadedURL is null.';
          }
          logger.info(`Successfully rendered video ${repoURL}`);
          channel.ack(msg);
          apiClient.setStatus(videoId, status, uploadedURL);
        } else {
          logger.info(`Failed to rendered video ${repoURL}.`);
          channel.nack(msg);
          apiClient.setStatus(videoId, status);
        }
      });
    },
    {noAck: false}
  );
}

// TODO: Figure out inputs/outputs
consume();
