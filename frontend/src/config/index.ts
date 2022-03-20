import config from '../config.json';

interface FrontEndConfig {
  url: string;
  api_url: string;
  gql_url: string;
}

const frontEndConfig: FrontEndConfig = config;

export default frontEndConfig;
