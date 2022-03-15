import express, { Request } from 'express';
import session from 'express-session';
import config from './config';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema/schema';
import { IWorkerService, WorkerService } from './service/worker-service';
import { body, query, param } from 'express-validator';
import bcrypt from 'bcrypt';
import path from 'path';
import { authRouter } from './routes/authroute';
import helmet from 'helmet';
import backEndConfig from './config';
import mongoose from 'mongoose';
import { log } from './logger';
import MongoStore from 'connect-mongo';
import { userRouter } from './routes/userroute';
import cors from 'cors';
import passport from 'passport';
import csurf from 'csurf';

const PORT = config.port;
const app = express();
const dirname = path.resolve();

// app.use(helmet()); // TODO: disabling this for graphiql, but should probably ask Robert
app.use(express.urlencoded({ extended: false }));

const origins = [
  `${backEndConfig.url}`,
  'http://localhost:3000',
  'https://github.com',
  'http://localhost',
  'http://localhost:5000',
  'http://nginx',
  'http://frontend:3000',
  'http://backend:5000',
];
const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200,
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
app.set('view engine', 'html');
app.use(passport.initialize());

const { user, password, host, dev_name, prod_name, options } =
  backEndConfig.dbConfig;
const dbname = process.env.NODE_ENV === 'production' ? prod_name : dev_name;
const uri = `mongodb+srv://${user}:${password}@${host}/${dbname}`;

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

async function handleConnect(value: typeof mongoose) {
  console.log('connected a');
  app.use(
    session({
      secret: backEndConfig.session_secret,
      resave: false,
      saveUninitialized: true,
      // cookie: {maxAge: 8 * 60 * 60 * 1000},
      // store: MongoStore.create({
      //   client: mongoose.connection.getClient(),
      //   dbName: dbname,
      //   collectionName: 'sessions',
      //   stringify: false, //change to true if using datatypes unsupported by mongodb in the session
      //   autoRemove: 'native',
      //   crypto: {
      //     secret: backEndConfig.session_secret,
      //   },
      //   touchAfter: 60 * 60, //only update the session every hour if nothing in the session changes (for expiry)
      // }),
    })
  );
  app.use(passport.session());
  log(`successfully connected to DB ${dbname}`);
}

async function handleConnectErr(err: any) {
  log(`failed to connect to Db ${dbname}`, err);
}

mongoose.connect(uri, options).then(handleConnect).catch(handleConnectErr);

// TODO: move this into a better place
let workerService: IWorkerService = new WorkerService(config.queueConfig.url, config.queueConfig.queue);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  renderVideo: ({ renderType, repoURL, videoId }: { renderType: string, repoURL: string, videoId: string }) => {
    workerService.enqueue(renderType.toLowerCase(), repoURL, videoId);
    return [renderType, repoURL, videoId];
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: config.graphiql,
}));

(async () => {
  // TODO: initialize database connection
  await (workerService as WorkerService).initialize();

  app.listen(PORT);
  console.log(`🧙 Started Gource Wizard API server at http://localhost:${PORT}/graphql`);
})()
app.use((req: Request, res, next) => {
  console.log('HTTP request', req.method, req.url, req.body);
  next();
});

const router = express.Router();

app.get('/', (req, res) => {
  res.sendFile(dirname + '/src/link.html');
});

router.use('/user/', userRouter);
router.use('/auth/', authRouter);
app.use('/api/', router);
