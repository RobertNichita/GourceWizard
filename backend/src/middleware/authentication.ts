import {NextFunction, Request, Response} from 'express';
import {authKit} from '../controllers/octokit';

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
  req.kit = authKit(req.session.passport!.auth.accessToken);
  return next();
}

export {isAuthenticated};
