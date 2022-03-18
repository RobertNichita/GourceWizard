import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import config from './config';
import { schema } from './schema/schema';
import { IWorkerService, WorkerService } from './service/worker-service';
import path from 'path';
import { authRouter } from './routes/authroute';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { log } from './logger';
import MongoStore from 'connect-mongo';

import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

const PORT = config.port;
const app = express();
const dirname = path.resolve();

// app.use(helmet()); // TODO: disabling this for apollo, but should probably ask Robert
app.use(express.urlencoded({ extended: false }));
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
  origins.push('https://studio.apollographql.com')
}

const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
app.set('view engine', 'html');
app.use(passport.initialize());

app.use((req, res, next) => {
  req.nonsense = 'nonsense';
  next();
});

const { user, password, host, db_name, options } = config.dbConfig;
const dbname = db_name + '_' + process.env.NODE_ENV;
const uri = `mongodb+srv://${user}:${password}@${host}/${dbname}`;

declare module 'express-session' {
  export interface SessionData {
    passport: { [key: string]: any };
    user: { [key: string]: any };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    _passport?: any;
    sessionStore?: any;
    nonsense?: string;
  }
}

//ADD ROUTES AND MIDDLEWARE WHICH REQUIRES DB OR SESSION HERE
async function afterConnect() {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req: Request, res: Response, next: NextFunction) => {
    //TODO: create a type declaration to add user.id
    // req.user = {id: req.session.id ? req.session.id : null};
    // console.log('HTTP request', req.method, req.url, req.body);
    next();
  });

  // TODO: initialize database connection
  if (config.environment === 'production') {
    await (workerService as WorkerService).initialize();
  }

  const server = await app.listen(PORT);

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    mocks: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
    dataSources: () => {
      return { db: mongoose.models };
    },
    context: (context: ExpressContext) => context,
  });

  await apolloServer.start();
  await apolloServer.applyMiddleware({ app });

  log(
    `🧙 Started Gource Wizard API server at http://localhost:${PORT}/graphql`
  );

  //ROUTES
  const router = express.Router();

  app.get('/', (req, res) => {
    res.sendFile(dirname + '/src/link.html');
  });

  router.use('/auth/', authRouter);
  app.use('/api/', router);
}

async function handleConnect(value: typeof mongoose) {
  app.use(
    session({
      secret: config.session_secret,
      resave: false,
      saveUninitialized: false,
      cookie: { sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
        stringify: false, //change to true if using datatypes unsupported by mongodb in the session
        autoRemove: 'native',
        crypto: {
          secret: config.session_secret,
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
    hello: (parent: any, args: any, context: ExpressContext, info: any) => {
      return "potato"
    },
  },
  Mutation: {
    renderVideo: (
      parent: any,
      {
        renderType,
        repoURL,
        videoId,
      }: { renderType: string; repoURL: string; videoId: string }
    ) => {
      console.log(parent);
      workerService.enqueue(renderType.toLowerCase(), repoURL, videoId);
      return [renderType, repoURL, videoId];
    },
  },
};
