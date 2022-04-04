import {config} from 'dotenv';
import logger from '../logger';
import {ConnectOptions} from 'mongoose';

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

interface GHClientConfig {
  clientID: string;
  clientSecret: string;
  hookSecret: string;
  appID: string;
  appKeyFile: string;
}

interface DBConfig {
  user: string;
  password: string;
  host: string;
  db_name: string;
  options: ConnectOptions;
}

interface BackEndConfig {
  ghClientConfig: GHClientConfig;
  dbConfig: DBConfig;
  url: string;
  frontend_url: string;
  session_secret: string;
  environment: string;
  port: number;
  graphiql: boolean;
  queueConfig: QueueConfig;

  /**
   * Add 'https://studio.apollographql.com' to CORS policy.
   *
   * This allows querying of the GraphQL server from Apollo Studio.
   * This should not be enabled in production.
   */
  apolloCORS: boolean;

  /**
   * Use the backend in mock mode, where all GraphQL responses are mocks.
   */
  returnMocks: boolean;
}

const env = config();
if (env.error) {
  logger.error('Failed to read .env file');
  throw env.error;
}

const backEndConfig: BackEndConfig = {
  ghClientConfig: {
    clientID: process.env.GH_CLIENT_ID!,
    clientSecret: process.env.GH_CLIENT_SECRET!,
    hookSecret: process.env.GH_WEBHOOK_SECRET!,
    appID: process.env.GH_APP_ID!,
    appKeyFile: process.env.GH_APP_KEY!,
  },
  dbConfig: {
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    host: process.env.DB_HOST!,
    db_name: process.env.DB_NAME!,
    options: JSON.parse(process.env.DB_OPTIONS!),
  },
  url: process.env.URL!,
  frontend_url: process.env.FRONTEND_URL!,
  session_secret: process.env.SESSION_SECRET!,
  environment: process.env.NODE_ENV!,
  port: parseInt(process.env.PORT!),
  graphiql: process.env.GRAPHIQL! === 'true',
  queueConfig: {
    url: process.env.QUEUE_URL!,
    queue: process.env.QUEUE_NAME!,
  },
  apolloCORS: process.env.APOLLO_CORS! === 'true',
  returnMocks: process.env.RETURN_MOCKS! === 'true',
};

export default backEndConfig;
