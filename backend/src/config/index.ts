import {config} from 'dotenv';
import logger from '../logger/index';
import {ConnectOptions} from 'mongoose';

interface GHClientConfig {
  clientID: string;
  clientSecret: string;
}

interface DBConfig {
  user: string;
  password: string;
  host: string;
  dev_name: string;
  prod_name: string;
  options: ConnectOptions;
}

interface BackEndConfig {
  ghClientConfig: GHClientConfig;
  dbConfig: DBConfig;
  url: string;
  session_secret: string;
  environment: string;
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
  },
  dbConfig: {
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    host: process.env.DB_HOST!,
    dev_name: process.env.DEV_DB_NAME!,
    prod_name: process.env.PROD_DB_NAME!,
    options: JSON.parse(process.env.DB_OPTIONS!),
  },
  url: process.env.URL!,
  session_secret: process.env.SESSION_SECRET!,
  environment: process.env.NODE_ENV!,
};

export default backEndConfig;
