import {ExpressContext} from 'apollo-server-express';
import logger from '../logger';
import {IWorkerService} from '../service/worker-service';
import {v4 as uuid} from 'uuid';
import {createPushHook} from '../controllers/webhooks';

export class VideoResolver {
  workerService: IWorkerService;

  constructor(workerService: IWorkerService) {
    this.workerService = workerService;
  }

  resolvers = {
    Mutation: {
      renderVideo: (
        parent: any,
        args: {renderType: string; repoURL: string},
        context: ExpressContext,
        info: any
      ) => {
        logger.info('args', args);
        const ownerId = context.req.passport!.user.user.login;
        const videoId = uuid();
        // TODO: Create a database entry

        this.workerService.enqueue(args.renderType, args.repoURL, videoId);
        // if(videoFinishedUploading){
        const isWebhook = false; // TODO: replace with param from frontend
        if (isWebhook) {
          createPushHook(
            context.req.kit,
            context.req.passport!.user.user,
            args.repoURL
          );
        }
        //}
      },
    },
  };
}
