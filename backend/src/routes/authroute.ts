import express, {Response, Request, Router, NextFunction} from 'express';
import https from 'https';

const router: Router = express.Router();

const isAuthenticated = () => {};

router.post(
  '/signup/',
  (req: Request, res: Response, next: NextFunction) => {}
);

router.post(
  '/signin/',
  (req: Request, res: Response, next: NextFunction) => {}
);

router.get(
  '/signout/',
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {}
);

export {router as authRoute, isAuthenticated};
