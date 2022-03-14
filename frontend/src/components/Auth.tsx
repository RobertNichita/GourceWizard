import {useState} from 'react';
import authService from '../services/authService';
import './Auth.css';

const Auth = () => {
  const auth = new authService();
  return (
    // <div className="horiz">
    //   <div className="horiz">
    //     <button id="signup" onClick={auth.signup}>
    //       {' '}
    //       Sign
    //       <br /> Up{' '}
    //     </button>
    //     <button id="signin" onClick={auth.signin}>
    //       {' '}
    //       Sign
    //       <br /> In{' '}
    //     </button>
    //   </div>
    //   <div className="horiz">
    //     <button id="signout">
    //       {' '}
    //       Sign
    //       <br /> Out
    //     </button>
    //   </div>
    //   <div className="error"></div>
    // </div>
    auth.signup()
  );
};

export default Auth;
