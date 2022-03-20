import axios from 'axios';
import frontEndConfig from '../config';

const send = axios.create({
  baseURL: frontEndConfig.api_url,
  timeout: 1000,
});

export default send;
