import { body } from 'express-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

const isAuthenticated = () => {};

router.post('/signup/', (req, res, next) => {});

router.post('/signin/', (req, res, next) => {});

router.get('/signout/', isAuthenticated, (req, res, next) => {});

router.get('/callback/', (req, res, next) => {});

export { router, isAuthenticated };
