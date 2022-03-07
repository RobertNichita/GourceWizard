/*  ******* Data types *******
        image objects must have at least the following attributes:
            - (String) _id 
            - (String) title
            - (String) author
            - (Date) date
    
        comment objects must have the following attributes
            - (String) _id
            - (String) imageId
            - (String) author
            - (String) content
            - (Date) date
    
    ****************************** */
import express from 'express';
import { body, query, param } from 'express-validator';
import session from 'express-session';
import bcrypt from 'bcrypt';
import path from 'path';
import * as authroute from './routes/authroute';
import helmet from 'helmet';
import https from 'https';

const PORT = 3000;
const app = express();

// const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
// 	if (!req.username) return res.status(401).end('access denied');
// 	next();
// };
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
	session({
		secret: 'Dr1IWDJj92FNQAMEtUz7fC3MZFwdl',
		resave: false,
		saveUninitialized: true,
	})
);

// app.use((req, res, next) => {
// 	req.username = req.session.username ? req.session.username : null;
// 	console.log('HTTP request', req.username, req.method, req.url, req.body);
// 	next();
// });

app.use((req: express.Request, res, next) => {
	console.log('HTTP request', req.method, req.url, req.body);
	next();
});
const dirname = path.resolve();

app
	.listen(PORT, () => {
		console.log(`server is listening on ${PORT}`);
		console.log(`server running from ${dirname}`);
	})
	.on('error', () => {
		console.log(`server startup failed`);
	});
