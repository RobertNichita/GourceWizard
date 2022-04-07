import {
  Webhooks,
  createNodeMiddleware,
  EmitterWebhookEvent,
} from '@octokit/webhooks';
import backEndConfig from '../config';
import logger, {log} from '../logger';
import {PushEvent} from '@octokit/webhooks-types';
import {installationAuth} from './authentication';
import {InstallationAccessTokenAuthentication} from '@octokit/auth-app';
import {IVideoService, RenderStatus, Video} from '../service/video_service';
import {IWorkerService} from '../service/worker-service';

function eventTransformer(event: EmitterWebhookEvent) {
  //... change the event if needed...
  return event;
}

//method called before any individual event handler
function addPreHandler(hooks: Webhooks) {
  hooks.onAny((event: EmitterWebhookEvent) => {
    log('recieved event');
    hooks
      .sign(event.payload)
      .then((signature: string) => {
        return hooks.verify(event.payload, signature);
      })
      .then((isLegitimate: boolean) => {
        if (!isLegitimate) {
          log('', 'Illegitimate webhook request', 'verifyWebhookSignature');
        }
      });
  });
  return hooks;
}

function repositoryURL(repoName: string, repoOwner: string) {
  return `https://github.com/${repoOwner}/${repoName}.git`;
}

/**
 * handler for push events should check to see that the user has enabled webhooks for this repo.
 * if they do, check the commit hash against the existing videos for this repo
 * if it is a new commit, generate a video and append it
 *
 **/
function addPushHandler(
  hooks: Webhooks,
  workerService: IWorkerService,
  videoService: IVideoService
) {
  hooks.on('push', (event: EmitterWebhookEvent<'push'>) => {
    const payload: PushEvent = event.payload;
    const installation = payload.installation;
    installationAuth(installation!.id).then(
      (auth: InstallationAccessTokenAuthentication) => {
        try {
          if (!auth) {
            throw 'ERROR: failed to create installation auth for push event';
          }
          if (!payload.repository.owner.name) {
            throw 'ERROR: event missing repo owner name';
          }
          const repoUrl = repositoryURL(
            payload.repository.name,
            payload.repository.owner.name!
          );
          videoService
            .getLatestRepoVideo(repoUrl)
            .then((video: Video) => {
              if (video) {
                return videoService.createVideo(
                  video.ownerId,
                  video.repositoryURL,
                  RenderStatus.queued,
                  video.title ? video.title : '',
                  video.description ? video.description : '',
                  false,
                  video.visibility,
                  video.renderOptions
                );
              }
              return undefined;
            })
            .then((createdVideo: Video | undefined) => {
              if (createdVideo) {
                workerService.enqueue(
                  'GOURCE',
                  repoUrl,
                  createdVideo._id,
                  auth.token,
                  createdVideo.renderOptions
                );
              }
            });
        } catch (err) {
          log(`could not handle push event ${event}`, err);
        }
      }
    );
  });
  return hooks;
}

function ghEventsMiddleware(
  workerService: IWorkerService,
  videoService: IVideoService
) {
  let hooks: Webhooks = new Webhooks({
    secret: backEndConfig.ghClientConfig.hookSecret,
    transform: eventTransformer,
  });

  hooks = addPushHandler(hooks, workerService, videoService);
  hooks = addPreHandler(hooks);

  return createNodeMiddleware(hooks, {
    path: '/api/events/github',
    log: logger,
  });
}

export default ghEventsMiddleware;
