import {config} from 'dotenv';
import logger from '../logger';

interface AWSConfig {
  /**
   * AWS Access Key
   */
  accessKey: string;

  /**
   * AWS Secret Access Key
   */
  secretAccessKey: string;

  /**
   * AWS Region
   */
  region: string;

  /**
   * Bucket to upload rendered video files
   */
  s3Bucket: string;
}

interface QueueConfig {
  /**
   * AMQP url to access message queue.
   */
  AMQPUrl: string;

  /**
   * Queue to consume messages.
   */
  queueName: string;

  /**
   * Prefetch Limit, basically how many concurrent render jobs this instance of a worker
   * can handle.
   *
   * Setting this value too high and hitting the worker with a burst (e.g. a few thousand) jobs at once
   * will spawn the gource worker that many times. This value should be set where
   * the worker can handle cloning and render all those jobs at once
   * while, avoiding thundering herd style issues.
   *
   * Setting this value to 1 means that the worker can only do one job at a time.
   * School VMs and EC2 t2.mediums are comparable in throughput.
   */
  prefetchLimit: number;
}

interface WorkerConfig {
  awsConfig: AWSConfig;
  queueConfig: QueueConfig;
  cdnConfig: CDNConfig;

  /**
   * URL to Gource-Wizard GraphQL API
   *
   * E.g. https://gource.wizard/graphql
   */
  backendURL: string;

  /**
   * Shared Secret between worker and backend to authenticate worker->backend
   * requests.
   */
  workerAuthSecret: string;
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
    prefetchLimit: parseInt(process.env.QUEUE_PREFETCH_LIMIT!),
  },
  cdnConfig: {
    cdnRoot: process.env.CDN_ROOT!,
  },
  backendURL: process.env.BACKEND_URL!,
  workerAuthSecret: process.env.WORKER_AUTH_SECRET!,
};

export default workerConfig;
