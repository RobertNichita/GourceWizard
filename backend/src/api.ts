import express, {NextFunction, Request, Response} from 'express';
import session from 'express-session';
import config from './config';
import {schema} from './schema/schema';
import {IWorkerService, WorkerService} from './service/worker-service';
import path from 'path';
import {authRouter} from './routes/authroute';
import helmet from 'helmet';
import mongoose from 'mongoose';
import {log} from './logger';
import MongoStore from 'connect-mongo';

import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import {ApolloServer, ExpressContext} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';

import ghEventsMiddleware from './middleware/GHEvents';
import backEndConfig from './config';
import {getCSP} from './common/util';
import {ENVIRONMENT} from './common/enum';
import {testRouter} from './routes/testroute';
import {ComposedResolvers} from './resolvers';
import {VideoService} from './service/video_service';
// eslint-disable-next-line node/no-unpublished-import
import {sys} from 'typescript';

const PORT = config.port;
const app = express();
const dirname = path.resolve();
app.enable('trust proxy');
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
const origins = [
  `${config.url}`,
  'http://localhost:3000',
  'https://github.com',
  'http://localhost',
  'http://localhost:5000',
  'http://nginx',
  'http://frontend:3000',
  'http://backend:5000',
];

if (config.apolloCORS) {
  origins.push('https://studio.apollographql.com');
}

const content_providers: string[] = [
  'apollo-server-landing-page.cdn.apollographql.com',
  'studio.apollographql.com',
  'localhost:3000',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults:
        backEndConfig.environment === ENVIRONMENT.PROD ? true : false,
      directives: {
        defaultSrc: getCSP(content_providers, backEndConfig.environment),
      },
    },
    crossOriginResourcePolicy: {
      policy:
        backEndConfig.environment === ENVIRONMENT.PROD
          ? 'same-origin'
          : 'cross-origin',
    },
    crossOriginEmbedderPolicy:
      backEndConfig.environment === ENVIRONMENT.PROD ? true : false,
  })
);

const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors(corsOptions)); // TODO: disabling this for apollo, but should probably ask Roberta
app.use(passport.initialize());

app.use((req, res, next) => {
  req.nonsense = 'nonsense';
  next();
});

const {user, password, host, db_name, options} = config.dbConfig;
const uri = `mongodb://${user}:${password}@${host}/`;

declare module 'express-session' {
  export interface SessionData {
    passport: {[key: string]: any};
    user: {[key: string]: any};
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    kit: any;
    nonsense?: string;
    passport?: {[key: string]: any};
    userId?: string;
  }
}

//ADD ROUTES AND MIDDLEWARE WHICH REQUIRES DB OR SESSION HEREa
async function afterConnect() {
  app.use(passport.initialize());
  app.use(passport.session());
  // memecachexd

  app.use((req: Request, res: Response, next: NextFunction) => {
    //TODO: create a type declaration to add user.id
    // req.user = {id: req.session.id ? req.session.id : null};
    // console.log('HTTP request', req.method, req.url, req.body);
    next();
  });

  // TODO: initialize database connection

  await (workerService as WorkerService).initialize();
  const videoService = new VideoService();
  app.use(ghEventsMiddleware(workerService, videoService));

  const server = await app.listen(PORT);

  const composedResolvers = new ComposedResolvers(workerService, videoService);

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers: composedResolvers.compose(),
    mocks: config.returnMocks,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer: server})],
    dataSources: () => {
      return {db: mongoose.models};
    },
    context: (context: ExpressContext) => context,
  });

  await apolloServer.start();
  await apolloServer.applyMiddleware({app});

  log(
    `🧙 Started Gource Wizard API server at http://localhost:${PORT}/graphql`
  );

  //ROUTES
  const router = express.Router();

  router.use('/auth/', authRouter);
  if (backEndConfig.environment !== ENVIRONMENT.PROD) {
    router.use('/test/', testRouter);
  }
  app.use('/api/', router);

  app.use('/', express.static(dirname + '/src/static'));
}

async function handleConnect(value: typeof mongoose) {
  app.use(
    session({
      secret: config.session_secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: 'lax',
        secure: backEndConfig.environment === 'production',
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
        stringify: false, //change to true if using datatypes unsupported by mongodb in the sessiona
        autoRemove: 'native',
        crypto: {
          secret: config.session_secret,
        },
        touchAfter: 60 * 60, //only update the session every hour if nothing in the session changes (for expiry)
      }),
    })
  );
  await afterConnect();
  log(`successfully connected to DB ${db_name}`);
}

async function handleConnectErr(err: any) {
  log(`failed to connect to Db ${db_name}`, err);
  log(`db props ${uri} ${JSON.stringify(options)}`);
  sys.exit(1);
}

mongoose.connect(uri, options).then(handleConnect).catch(handleConnectErr);

// TODO: move this into a better place
const workerService: IWorkerService = new WorkerService(
  config.queueConfig.url,
  config.queueConfig.queue
);
