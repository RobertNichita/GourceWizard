import {Octokit} from '@octokit/rest';
import {NextFunction, Request, Response} from 'express';
import backEndConfig from '../config';
import {authKit, RetryThrottleKit} from '../controllers/octokit';
import {log} from '../logger';
import fs from 'fs';
import path from 'path';
import {
  createAppAuth,
  InstallationAccessTokenAuthentication,
} from '@octokit/auth-app';
import {InstallationLite} from '@octokit/webhooks-types';

const dirname = path.resolve();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    getUserInstallation(authKit(req.passport!.session.user.auth.access_token)!)
      .then(installation => {
        return next();
      })
      .catch(err => {
        throw `User has not installed app ${err}`;
      });
  }
  throw 'Unauthenticated user';
}

async function getUserInstallation(
  kit: Octokit
): Promise<void | InstallationLite> {
  return kit
    .request('GET /user/installations')
    .catch(err => {
      throw `failed to get installations ${err}`;
    })
    .then(ls => {
      const ourInstallations = ls.data!.installations.filter(
        installation =>
          installation.app_id.toString() === backEndConfig.ghClientConfig.appID
      );
      if (!ourInstallations || !(ourInstallations.length > 0)) {
        throw 'user has not installed our app';
      }

      return ourInstallations[0];
    })
    .catch(err => {
      log('error filtering installations', err);
      return err;
    });
}

async function getInstallationKit(userToken: string): Promise<Octokit> {
  return getUserInstallation(authKit(userToken)!)
    .catch(err => {
      log(`err ${err}`);
      throw err;
    })
    .then(ourInstallations => {
      log(`does it exist ${ourInstallations}`);
      return installationAuth(ourInstallations!.id);
    })
    .catch(err => {
      throw `failed to get installation auth ${err}`;
    })
    .then(installationAuth => {
      return authKit(installationAuth!.token);
    })
    .catch(err => {
      return err;
    });
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

function readKeyFile() {
  let file = '';
  try {
    file = fs
      .readFileSync(
        path.join(dirname, `${backEndConfig.ghClientConfig.appKeyFile}`)
      )
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
    privateKey: readKeyFile(),
    installationId: installationId,
  });

  // Retrieve installation access token
  const installationAuthentication = await auth({
    type: 'installation',
    installationId: installationId,
  });
  return installationAuthentication;
}

export {
  isAuthenticated,
  addAuthKit,
  getInstallationKit,
  installationAuth,
  getUserInstallation,
};
