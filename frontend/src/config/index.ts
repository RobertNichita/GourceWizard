// import {config} from 'dotenv';

interface FrontEndConfig {
  url: string;
  api_url: string;
}

// const env = config();
// if (env.error) {
//   console.log('Failed to read .env file');
//   throw env.error;
// }

const frontEndConfig: FrontEndConfig = {
  url: 'http://localhost:3000',
  api_url: 'http://localhost:5000/api',
};

export default frontEndConfig;
