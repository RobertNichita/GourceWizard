import {Octokit} from '@octokit/rest';
import {NextFunction, Request, Response} from 'express';
import backEndConfig from '../config';
import {authKit} from '../controllers/octokit';
import {log} from '../logger';
import fs from 'fs';
import {
  createAppAuth,
  InstallationAccessTokenAuthentication,
} from '@octokit/auth-app';

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

function readKeyFile(path: string) {
  let file = '';
  try {
    file = fs
      .readFileSync(`../${backEndConfig.ghClientConfig.appKeyFile}`)
      .toString();
  } catch (err) {
    log('could not read app key', err);
  }
  return file;
}

async function installationAuth(
  installationId: number
): Promise<InstallationAccessTokenAuthentication> {
  const auth = createAppAuth({
    appId: backEndConfig.ghClientConfig.appID,
    privateKey: readKeyFile(`../${backEndConfig.ghClientConfig.appKeyFile}`),
    installationId: installationId,
  });

  // Retrieve installation access token
  const installationAuthentication = await auth({
    type: 'installation',
    installationId: installationId,
  });
  return installationAuthentication;
}

export {isAuthenticated, addAuthKit, installationAuth};
