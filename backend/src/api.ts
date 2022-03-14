import express from 'express';
import session from 'express-session';
import config from './config';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema/schema';
import { IWorkerService, WorkerService } from './service/worker-service';

const PORT = config.port;
const app = express();

// app.use(helmet()); // TODO: disabling this for graphiql, but should probably ask Robert
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: 'Dr1IWDJj92FNQAMEtUz7fC3MZFwdl',
    resave: false,
    saveUninitialized: true,
  })
);

// TODO: move this into a better place
let workerService: IWorkerService =  new WorkerService(config.queueConfig.url, config.queueConfig.queue);

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
