import express, {Response, Request, Router, NextFunction} from 'express';
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
import backEndConfig from '../config';
import authModel, {createAuth, getAuth} from '../models/auth';
import userModel, {createUser, getUser} from '../models/user';
import {log} from '../logger';
import {isAuthenticated} from '../middleware/authentication';

const router: Router = express.Router();

router.post('/signup/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).end('kek');
});

router.get(
  '/signout/',
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.session);
    return res
      .status(200)
      .end(`${req.session ? JSON.stringify(req.session) : 'undefined'}`);
  }
);

router.get(
  '/github/',
  passport.authenticate('github', {scope: ['user:email']})
);

router.get(
  '/github/callback/',
  passport.authenticate('github', {
    failureRedirect: `${backEndConfig.url}`,
    successRedirect: `${backEndConfig.url}/app`,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    // res.redirect();
  }
);

passport.serializeUser(
  (data: any, done: (err: Error | undefined, session: any) => void) => {
    console.log(`ser data${JSON.stringify(data)}`);
    done(undefined, data);
  }
);

passport.deserializeUser(
  (session: any, done: (err: Error | undefined, data: any) => void) => {
    console.log(`1 deser data ${JSON.stringify(session)}`);
    const User = getUser(session.user._id);
    const Auth = getAuth(session.user._id);
    const out = {user: User, auth: Auth};
    console.log(`2 deser data ${JSON.stringify(out)}`);
    done(undefined, out);
  }
);

passport.use(
  new GitHubStrategy(
    {
      clientID: backEndConfig.ghClientConfig.clientID,
      clientSecret: backEndConfig.ghClientConfig.clientSecret,
      callbackURL: `${backEndConfig.ghClientConfig.callbackUrl}/api/auth/github/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: any, user: any) => void
    ) => {
      let User: any;
      console.log(`profile ${JSON.stringify(profile)}`);
      createUser(profile)
        .then(user => {
          User = user;
          return createAuth(user, accessToken, refreshToken);
        })
        .then((auth: any) => {
          done(null, {user: User, auth: auth});
        });
    }
  )
);

export {router as authRouter};
