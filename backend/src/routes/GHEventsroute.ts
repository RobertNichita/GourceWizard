import {body} from 'express-validator';
import express, {Router, Request, Response, NextFunction} from 'express';
import crypto from 'crypto';

const router: Router = express.Router();

const isAuthenticated = () => {};

/**
 * Verifies the signature of a webhook against the webhook token
 *
 * @param request_signature the HTTP_X_HUB_SIGNATURE_256 signature of the request
 * @param payload_body the payload
 * @returns whether this request is a ligitimate request from a Github webhook
 */

const verify_signature = (request_signature: string, payload_body: string) => {
  const signature =
    'sha256=' +
    crypto
      .createHmac('sha256', process.env.WEBHOOK_TOKEN!)
      .update(payload_body)
      .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(request_signature)
  );
};

router.get(
  '/authcallback/',
  (req: Request, res: Response, next: NextFunction) => {}
);

export {router as GHEventsRoute, isAuthenticated};
