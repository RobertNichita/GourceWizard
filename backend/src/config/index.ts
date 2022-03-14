import {config} from 'dotenv';
import logger from '../logger';

interface Config {
  mongoURL: string;
  queueConfig: QueueConfig;
}

/**
 * Configuration for queueing render jobs.
 */
interface QueueConfig {
  /**
   * AMQP URI String
   * E.g. amqp://rabbitmq:5672
   */
  url: string;

  /**
   * Name of queue
   */
  queue: string;
}

const env = config();
if (env.error) {
  logger.error('Failed to read .env file');
  throw env.error;
}

const appConfig: Config = {
  mongoURL: process.env.MONGO_URL!,
  queueConfig: {
    url: process.env.QUEUE_URL!,
    queue: process.env.QUEUE_NAME!,
  }
};

export default appConfig;
