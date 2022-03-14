import {connected} from 'process';
import frontEndConfig from '../config';
import send from './axiosconf';

class authService {
  signup = async () => {
    return console.log(await send.get('/'));
  };
  signin = async () => {
    console.log(await send.post('/signup/', {}));
  };
  signout = async () => {};
}

export default authService;
