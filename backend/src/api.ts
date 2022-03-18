import express, {NextFunction, Request, Response} from 'express';
import session from 'express-session';
import config from './config';
import {schema} from './schema/schema';
import {IWorkerService, WorkerService} from './service/worker-service';
import {body, query, param} from 'express-validator';
import bcrypt from 'bcrypt';
import path from 'path';
import {authRouter} from './routes/authroute';
import helmet from 'helmet';
import backEndConfig from './config';
import mongoose from 'mongoose';
import {log} from './logger';
import MongoStore from 'connect-mongo';

import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import {Server} from 'http';
import {Octokit} from '@octokit/rest';

const PORT = config.port;
const app = express();
const dirname = path.resolve();

// app.use(helmet()); // TODO: disabling this for graphiql, but should probably ask Robert
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
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
  credentials: true,
};

app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors(corsOptions)); // TODO: disabling this for apollo, but should probably ask Robert
app.use(express.static(dirname + '/src/static'));
app.use(passport.initialize());

app.use((req, res, next) => {
  req.body.nonsense = 'nonsense';
  next();
});

const {user, password, host, db_name, options} = backEndConfig.dbConfig;
const dbname = db_name + '_' + process.env.NODE_ENV;
const uri = `mongodb+srv://${user}:${password}@${host}/${dbname}`;

declare module 'express-session' {
  export interface SessionData {
    passport: {[key: string]: any};
    user: {[key: string]: any};
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    kit: Octokit;
  }
}
//ADD ROUTES AND MIDDLEWARE WHICH REQUIRES DB OR SESSION HERE
async function afterConnect() {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req: Request, res: Response, next: NextFunction) => {
    //TODO: create a type declaration to add user.id
    // req.user = {id: req.session.id ? req.session.id : null};
    console.log('HTTP request', req.method, req.url, req.body);
    next();
  });

  // TODO: initialize database connection
  if (backEndConfig.environment === 'production') {
    await (workerService as WorkerService).initialize();
  }

  const server = await app.listen(PORT);

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer: server})],
    dataSources: () => {
      return {db: mongoose.models};
    },
  });

  await apolloServer.start();
  await apolloServer.applyMiddleware({app});

  log(
    `🧙 Started Gource Wizard API server at http://localhost:${PORT}/graphql`
  );

  //ROUTES
  const router = express.Router();

  // app.get('/', (req, res) => {
  //   res.render(dirname + '/src/static/link.html');
  // });
  router.use('/auth/', authRouter);
  app.use('/api/', router);
}

async function handleConnect(value: typeof mongoose) {
  app.use(
    session({
      secret: backEndConfig.session_secret,
      resave: false,
      saveUninitialized: false,
      cookie: {sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000},
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
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
  await afterConnect();
  log(`successfully connected to DB ${dbname}`);
}

async function handleConnectErr(err: any) {
  log(`failed to connect to Db ${dbname}`, err);
  log(`db props ${uri} ${JSON.stringify(options)}`);
}

mongoose.connect(uri, options).then(handleConnect).catch(handleConnectErr);

// TODO: move this into a better place
const workerService: IWorkerService = new WorkerService(
  config.queueConfig.url,
  config.queueConfig.queue
);

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    renderVideo: (
      parent: any,
      {
        renderType,
        repoURL,
        videoId,
      }: {renderType: string; repoURL: string; videoId: string}
    ) => {
      console.log(parent);
      workerService.enqueue(renderType.toLowerCase(), repoURL, videoId);
      return [renderType, repoURL, videoId];
    },
  },
};

// (async () => {
//   // TODO: initialize database connection
//   await (workerService as WorkerService).initialize();

//   const server = await app.listen(PORT);
//   const apolloServer = new ApolloServer({
//     typeDefs: schema,
//     resolvers,
//     plugins: [ApolloServerPluginDrainHttpServer({httpServer: server})],
//   });
//   await apolloServer.start();
//   await apolloServer.applyMiddleware({app});

//   log(
//     `🧙 Started Gource Wizard API server at http://localhost:${PORT}/graphql`
//   );
// })();
