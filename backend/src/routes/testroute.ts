import express, {Request, Response, Router} from 'express';
import {isAuthenticated, addAuthKit} from '../middleware/authentication';
import {createPushHook} from '../controllers/webhooks';

const router: Router = express.Router();

router.use(
  '/createhook',
  isAuthenticated,
  addAuthKit,
  async (req: Request, res: Response) => {
    await createPushHook(
      req.session.passport!.user.auth.access_token,
      req.kit,
      req.session.passport!.user.user.login,
      req.query.repoURL as unknown as string
    ).then((result: any) => {
      return res.status(200).json({
        response: JSON.stringify(result),
      });
    });
  }
);

export {router as testRouter};
