import {Octokit} from '@octokit/rest';
import {NextFunction, Request, Response} from 'express';
import backEndConfig from '../config';
import {authKit} from '../controllers/octokit';
import {log} from '../logger';
import fs from 'fs';
import path from 'path';
import {
  createAppAuth,
  InstallationAccessTokenAuthentication,
} from '@octokit/auth-app';
import {InstallationLite} from '@octokit/webhooks-types';

const dirname = path.resolve();

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

export function logRequests(req: Request, res: Response, next: NextFunction) {
  const username = req.session.passport
    ? req.session.passport.user.user.login
    : null;
  log(`${username}, ${req.method}, ${req.url}, ${JSON.stringify(req.body)}`);
  next();
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
      return authKit(installationAuth!.token, 'Bearer');
    })
    .catch(err => {
      return err;
    });
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
  log(`installation: ${JSON.stringify(installationAuthentication)}`);
  return installationAuthentication;
}

export {getInstallationKit, installationAuth, getUserInstallation};
