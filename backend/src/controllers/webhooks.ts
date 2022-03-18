import {Octokit} from '@octokit/rest';
import {CONTENT_TYPE, INSECURE_SSL} from '../common/enum';
import {HookEventName, HookParams, ACCEPT} from '../common/hook';
import {log} from '../logger';
import {User} from '../models/user';

async function createPushHook(kit: Octokit, user: User, repo: string) {
  const params = {
    accept: ACCEPT,
    owner: user.login,
    repo: repo,
    events: [HookEventName.PUSH],
  };

  return createHook(kit, params);
}

//prereq: kit is authenticated as params.owner
async function createHook(kit: Octokit, params: HookParams) {
  return kit.rest.repos.createWebhook(params).catch((err: any) => {
    log(`could not create hook ${params}`, err);
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
