import express, {Request, Response} from 'express';
import {body, query, param} from 'express-validator';
import session from 'express-session';
import bcrypt from 'bcrypt';
import path from 'path';
import {authRouter} from './routes/authroute';
import helmet from 'helmet';
import backEndConfig from './config';
import mongoose from 'mongoose';
import {log} from './logger';
import MongoStore from 'connect-mongo';
import {userRouter} from './routes/userroute';
import cors from 'cors';
import csurf from 'csurf';

log('Gource Wizard server starting...');
const PORT = 5000;
const app = express();
const dirname = path.resolve();

// const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
// 	if (!req.username) return res.status(401).end('access denied');
// 	next();
// };
const origins = [
  `${backEndConfig.url}`,
  'http://localhost:3000',
  'https://github.com',
];
const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200,
};
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors(corsOptions));
app.set('view engine', 'html');

const {user, password, host, dev_name, prod_name, options} =
  backEndConfig.dbConfig;
const dbname = process.env.NODE_ENV === 'production' ? prod_name : dev_name;
const uri = `mongodb+srv://${user}:${password}@${host}/${dbname}`;

mongoose.connection.on('connect', () => {
  app.use(
    session({
      secret: backEndConfig.session_secret,
      resave: false,
      saveUninitialized: false,
      cookie: {maxAge: 8 * 60 * 60 * 1000},
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: dbname,
        collectionName: 'sessions',
        stringify: false, //change to true if using datatypes unsupported by mongodb in the session
        autoRemove: 'native',
        crypto: {
          secret: backEndConfig.session_secret,
        },
        touchAfter: 60 * 60, //only update the session every hour if nothing in the session changes (for expiry)
      }),
    })
  );
});

async function handleConnect(value: typeof mongoose) {
  log(`successfully connected to DB ${dbname}`);
}
async function handleConnectErr(err: any) {
  log(`failed to connect to Db ${dbname}`, err);
}

mongoose.connect(uri, options).then(handleConnect).catch(handleConnectErr);

// app.use((req, res, next) => {
// 	req.username = req.session.username ? req.session.username : null;
// 	console.log('HTTP request', req.username, req.method, req.url, req.body);
// 	next();
// });

app.use((req: Request, res, next) => {
  console.log('HTTP request', req.method, req.url, req.body);
  next();
});

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(dirname + '/src/link.html');
});

router.use('/user/', userRouter);
router.use('/auth/', authRouter);
app.use('/api/', router);

app
  .listen(PORT, () => {
    log(`server is listening on ${PORT}`);
    log(`server running from ${dirname}`);
  })
  .on('error', () => {
    log('server startup failed', 'server startup failed');
  });
