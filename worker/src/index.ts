import amqp = require('amqplib');
import logger from './logger';
import config from './config';
import {v4 as uuid} from 'uuid';
import {execFile} from 'child_process';

async function consume(): Promise<void> {
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

      // TODO: validate message (json-schema)
      // TODO: turn message into arguments for gource.sh

      // Arguments for gource.sh
      const repoURL = 'https://github.com/Raieen/Raieen.git';
      const videoId = uuid();
      const gourceArguments = '-r 25 -c 4 -s 0.1 --key -o -';
      const ffmpegArguments = `-y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 ${videoId}.mp4`;
      const timeout = (10 * 60).toString(); // 10 minutes

      const args = [
        repoURL,
        videoId,
        gourceArguments,
        ffmpegArguments,
        s3Bucket,
        timeout,
      ];
      const childProcess = execFile('/worker/src/render/gource.sh', args);
      logger.info(`Running gource.sh with arguments ${args}`);

      childProcess.stdout?.on('data', data => {
        logger.info(data);
      });

      childProcess.stderr?.on('data', data => {
        logger.warn(data);
      });

      childProcess.on('close', (code, signal) => {
        logger.info(`Exit Code ${code}`);
        logger.info(`Signal ${signal}`);

        // Success
        if (code === 0) {
          logger.info(`Successfully rendered video ${repoURL}`);
          channel.ack(msg);
          // TODO: add something to db?
          // Should expect URL to be s3-bucket/videoId.mp4
        } else {
          // TODO: How many times to retry? What is the retry strategy?
          // TODO: Do we do something special with timeout vs a generic error?
          logger.info(
            `Failed to rendered video ${repoURL} with exit code ${code}`
          );
          channel.nack(msg);
        }
      });
    },
    {noAck: false}
  );
}

// TODO: Figure out inputs/outputs
consume();
