import {CONTENT_TYPE, INSECURE_SSL} from './enum';

enum HookEventName {
  PUSH = 'push',
}

const ACCEPT = 'application/vnd.github.v3+json';

type HookConfig = {
  url: string;
  content_type: CONTENT_TYPE;
  secret: string;
  insecure_ssl: INSECURE_SSL;
};

type HookParams = {
  accept: string;
  owner: string;
  repo: string;
  hook_id?: number;
  config?: HookConfig;
  events?: HookEventName[]; //list of events which will trigger the hook
  //   ==I have no idea what these do==
  //   address: string;
  //   room: string;
};
export {HookConfig, HookParams, HookEventName, ACCEPT};
