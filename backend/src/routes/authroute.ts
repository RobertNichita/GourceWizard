import express, {Response, Request, Router, NextFunction} from 'express';
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
import backEndConfig from '../config';
import authModel from '../models/auth';
import userModel from '../models/user';
import {log} from '../logger';
import {session} from 'passport';
const router: Router = express.Router();

router.post('/signup/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).end('kek');
});

router.post(
  '/signin/',
  (req: Request, res: Response, next: NextFunction) => {}
);

router.get(
  '/signout/',
  (req: Request, res: Response, next: NextFunction) => {}
);

router.get(
  '/github/',
  passport.authenticate('github', {scope: ['user:email']})
);

router.get(
  '/github/callback/',
  passport.authenticate('github', {
    failureRedirect: `${backEndConfig.url}`,
  }),
  (req, res) => {
    req.session.user!.a = 'asdf';
    // Successful authentication, redirect home.
    res.redirect(`${backEndConfig.url}/app`);
  }
);

passport.serializeUser(
  (user: any, done: (err: Error | undefined, session: any) => void) => {
    done(undefined, session);
  }
);

passport.deserializeUser(
  (id: string, done: (err: Error | undefined, userid: string) => void) => {
    userModel.findOne({github_id: id}, (err: Error | undefined, user: any) => {
      done(err, user);
    });
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
      userModel
        .findOneAndUpdate(
          {github_id: profile.id},
          {github_id: profile.id},
          {upsert: true, new: true}
        )
        .then((user: any) => {
          User = user;
          console.log(`access: ${accessToken}`);
          return authModel.findOneAndUpdate(
            {
              user_id: user._id,
            },
            {
              user_id: user._id,
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            {upsert: true, new: true}
          );
        })
        .then((auth: any) => {
          done(null, {user: User, auth: auth});
        });
    }
  )
);

export {router as authRouter};
