import {Octokit} from '@octokit/rest';
import {CONTENT_TYPE, INSECURE_SSL} from '../common/enum';
import {HookEventName, HookParams, ACCEPT} from '../common/hook';
import backEndConfig from '../config';
import {log} from '../logger';

async function createPushHook(kit: Octokit, login: string, repo: string) {
  const params = {
    accept: ACCEPT,
    owner: login,
    repo: repo,
    name: 'web',
    config: {
      url: `${backEndConfig.url}/events/github`,
      content_type: CONTENT_TYPE.JSON,
      secret: backEndConfig.ghClientConfig.hookSecret,
      insecure_ssl: INSECURE_SSL.INSECURE,
    },
    events: [HookEventName.PUSH],
    active: true,
  };
  log(`params: ${params}`);

  return createHook(kit, params);
}

//prereq: kit is authenticated as params.owner
async function createHook(kit: Octokit, params: HookParams) {
  return kit.rest.repos.createWebhook(params).catch((err: any) => {
    log('failed to create webhook', err);
  });
}

//prereq: kit is authenticated as params.owner
function deleteHook(
  kit: Octokit,
  owner: string,
  repo: string,
  hook_id: number
) {
  return kit.rest.repos
    .deleteWebhook({
      owner: owner,
      repo: repo,
      hook_id: hook_id,
    })
    .catch((err: any) => {
      log('could not delete hook', err);
    });
}
export {createHook, createPushHook, deleteHook};
