import express, {Response, Request, Router, NextFunction} from 'express';
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
import backEndConfig from '../config';
import {createAuth, getAuth} from '../models/auth';
import {createUser, getUser} from '../models/user';
import {log} from '../logger';

const router: Router = express.Router();

router.post('/signup/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).end('kek');
});

router.post('/signout/', (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.passport) {
    res.redirect('/');
  }
  log(`signing out user: ${req.session.passport!.user.user.github_id}`);
  req.session.destroy(err => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

router.get(
  '/github/',
  passport.authenticate('github', {
    scope: ['read:user', 'repo'],
  })
);

router.get(
  '/github/callback/',
  passport.authenticate('github', {
    failureRedirect: `${backEndConfig.url}`,
    successRedirect: `${backEndConfig.url}/library`,
  }),
  (req, res) => {}
);

passport.serializeUser(
  (data: any, done: (err: Error | undefined, session: any) => void) => {
    done(undefined, data);
  }
);

passport.deserializeUser(
  (session: any, done: (err: Error | undefined, data: any) => void) => {
    const User = getUser(session.user.github_id);
    const Auth = getAuth(session.user.github_id);
    const out = {user: User, auth: Auth};
    done(undefined, out);
  }
);

passport.use(
  new GitHubStrategy(
    {
      clientID: backEndConfig.ghClientConfig.clientID,
      clientSecret: backEndConfig.ghClientConfig.clientSecret,
      callbackURL: `${backEndConfig.url}/api/auth/github/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: any, user: any) => void
    ) => {
      let User: any;
      log(`attempting to authenticate user ${profile.id}`);
      createUser(profile)
        .catch((err: any) => {
          log('failed to create user on login', err);
        })
        .then(user => {
          User = user;
          return createAuth(user, accessToken, refreshToken);
        })
        .catch((err: any) => {
          log('failed to create auth on login', err);
        })
        .then((auth: any) => {
          log(
            `successfully authenticated user ${profile.id}`,
            '',
            'Strategy._verify'
          );
          done(null, {user: User, auth: auth});
        });
    }
  )
);

export {router as authRouter};
