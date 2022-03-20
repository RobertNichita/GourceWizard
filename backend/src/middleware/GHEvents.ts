import express, {Router, Request, Response, NextFunction} from 'express';
import crypto from 'crypto';
import {
  Webhooks,
  createNodeMiddleware,
  EmitterWebhookEvent,
} from '@octokit/webhooks';
import backEndConfig from '../config';
import logger, {log} from '../logger';

function eventTransformer(event: EmitterWebhookEvent) {
  //... change the event if needed...
  return event;
}

const hooks: Webhooks = new Webhooks({
  secret: backEndConfig.ghClientConfig.hookSecret,
  transform: eventTransformer,
});

//method called before any individual event handler
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

/**
 * handler for push events should check to see that the user has enabled webhooks for this repo.
 * if they do, check the commit hash against the existing videos for this repo
 * if it is a new commit, generate a video and append it
 *
 **/
hooks.on('push', (event: EmitterWebhookEvent) => {
  console.log('push');
});

// /**
//  * Verifies the signature of a webhook against the webhook token
//  *
//  * @param request_signature the HTTP_X_HUB_SIGNATURE_256 signature of the request
//  * @param payload_body the payload
//  * @returns whether this request is a ligitimate request from a Github webhook
//  */

// const verify_signature = (request_signature: string, payload_body: string) => {
//   const signature =
//     'sha256=' +
//     crypto
//       .createHmac('sha256', process.env.WEBHOOK_TOKEN!)
//       .update(payload_body)
//       .digest('hex');
//   return crypto.timingSafeEqual(
//     Buffer.from(signature),
//     Buffer.from(request_signature)
//   );
// };

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.redirect();
// });

const ghEventsMiddleware = createNodeMiddleware(hooks, {
  path: '/events/github',
  log: logger,
});
export default ghEventsMiddleware;
