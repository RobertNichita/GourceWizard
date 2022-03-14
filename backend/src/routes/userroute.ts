import express, {Response, Request, Router, NextFunction} from 'express';

import backEndConfig from '../config';
import userModel from '../models/user';
const router: Router = express.Router();

const isAuthenticated = () => {};

router.get('/', (req: Request, res: Response) => {});

export {router as userRouter};
