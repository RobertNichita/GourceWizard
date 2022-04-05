import {retry} from '@octokit/plugin-retry';
import {throttling} from '@octokit/plugin-throttling';
import {Octokit} from '@octokit/rest';
import logger, {log} from '../logger';
import {createAppAuth} from '@octokit/auth-app';
import backEndConfig from '../config';
import fs from 'fs';

const RetryThrottleKit = Octokit.plugin(retry).plugin(throttling);

function onRateLimit(retryAfter: Number, options: any) {
  log(
    '',
    `Error: quota used for request type ${options.method} at ${options.url}`
  );
  if (options.request.retryCount <= 2) {
    log(`retrying after ${retryAfter} seconds`);
  }
}

function onAbuseLimit(retryAfter: Number, options: any) {
  log(
    '',
    `Error: quota ABUSED for request type ${options.method} at ${options.url}`
  );
}

function authKit(accessToken: string) {
  let kit;
  try {
    kit = new RetryThrottleKit({
      auth: `token ${accessToken}`,
      throttle: {onRateLimit: onRateLimit, onAbuseLimit: onAbuseLimit},
      log: logger,
    });
  } catch (err) {
    log('failed to create authorized octokit', err);
  }
  return kit;
}

// async function installationKit(installationId: number) {
//   let kit;
//   try {
//     kit = new RetryThrottleKit({
//       authStrategy: createAppAuth,
//       auth: {
//         appId: backEndConfig.ghClientConfig.appID,
//         privateKey: readKeyFile(
//           `../${backEndConfig.ghClientConfig.appKeyFile}`
//         ),
//         installationId: installationId,
//       },
//       throttle: {onRateLimit: onRateLimit, onAbuseLimit: onAbuseLimit},
//       log: logger,
//     });
//   } catch (err) {
//     log('failed to create app installation octokit', err);
//   }

//   return kit;
// }

export {authKit, /*installationKit, */ RetryThrottleKit};
