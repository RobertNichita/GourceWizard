import {Octokit} from '@octokit/rest';
import {NextFunction, Request, Response} from 'express';
import {authKit} from '../controllers/octokit';
import {log} from '../logger';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

/**
 * prereq, isAuthenticated must be infront of this middleware
 * postreq, req.kit is an Octokit Instance authenticated as the logged in user
 **/
function addAuthKit(req: Request, res: Response, next: NextFunction) {
  try {
    req.kit = authKit(req.session.passport!.user.auth.access_token);
  } catch (err) {
    log('failed to add kit middleware', err);
    res.status(500).end('autkit failed');
  }
  return next();
}

export {isAuthenticated, addAuthKit};
