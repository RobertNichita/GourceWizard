import express, {Response, Request, Router, NextFunction} from 'express';
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
import backEndConfig from '../config';
import authModel from '../models/auth';
import userModel from '../models/user';
const router: Router = express.Router();

const isAuthenticated = () => {};

router.post(
  '/signup/',
  (req: Request, res: Response, next: NextFunction) => {}
);

router.post(
  '/signin/',
  (req: Request, res: Response, next: NextFunction) => {}
);

router.get(
  '/signout/',
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {}
);

router.get(
  '/github/',
  passport.authenticate('github', {scope: ['user:email']})
);

router.get(
  '/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

passport.serializeUser(
  (user: any, done: (err: Error | undefined, userid: string) => void) => {
    done(undefined, user.id);
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
      callbackURL: `${backEndConfig.url}/auth/callback/`,
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
          {upsert: true}
        )
        .then((user: any) => {
          User = user;
          authModel.findOneAndUpdate(
            {user_id: user._id},
            {
              user_id: user._id,
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            {upsert: true}
          );
        })
        .then((auth: any) => {
          done(null, User);
        });
    }
  )
);

export {router as authRouter};
