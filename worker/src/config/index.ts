import {config} from 'dotenv';
import logger from '../logger';

interface AWSConfig {
  accessKey: string;
  secretAccessKey: string;
  region: string;

  /**
   * Bucket to upload rendered video files
   */
  s3Bucket: string;
}

interface QueueConfig {
  AMQPUrl: string;
  queueName: string;
}

interface WorkerConfig {
  awsConfig: AWSConfig;
  queueConfig: QueueConfig;
  cdnConfig: CDNConfig;
}

interface CDNConfig {
  /**
   * Root of CDN upload URL.
   *
   * E.g. https://nonsense.cloudfront.net/
   */
  cdnRoot: string;
}

const env = config();
if (env.error) {
  logger.error('Failed to read .env file');
  throw env.error;
}

const workerConfig: WorkerConfig = {
  awsConfig: {
    accessKey: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
    s3Bucket: process.env.AWS_S3_BUCKET!,
  },
  queueConfig: {
    AMQPUrl: process.env.QUEUE_AMQP_URL!,
    queueName: process.env.QUEUE_NAME!,
  },
  cdnConfig: {
    cdnRoot: process.env.CDN_ROOT!,
  },
};

export default workerConfig;
