import {ExpressContext} from 'apollo-server-express';
import logger from '../logger';
import {IWorkerService} from '../service/worker-service';
import {createPushHook} from '../controllers/webhooks';
import {IVideoService} from '../service/video_service';

export class VideoResolver {
  workerService: IWorkerService;
  videoService: IVideoService;

  constructor(workerService: IWorkerService, videoService: IVideoService) {
    this.workerService = workerService;
    this.videoService = videoService;
  }

  resolvers = {
    Query: {
      video: async (
        parent: any,
        args: {id: string},
        context: ExpressContext,
        info: any
      ) => {
        return this.videoService.getVideo(args.id);
      },
      videos: async (
        parent: any,
        args: any,
        context: ExpressContext,
        info: any
      ) => {
        const ownerId = 'ownerid'; // TODO: replace with context ownerId.
        return this.videoService.getVideos(ownerId);
      },
    },
    Mutation: {
      renderVideo: async (
        parent: any,
        args: {
          renderType: string;
          repoURL: string;
          title: string;
          description: string;
        },
        context: ExpressContext,
        info: any
      ) => {
        logger.info('args', args);
        // const ownerId = context.req.passport!.user.user.login;
        const ownerId = 'ownerid';
        const videoId = await this.videoService.createVideo(
          ownerId,
          args.repoURL,
          'ENQUEUED',
          args.title,
          args.description
        );
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
        return this.videoService.getVideo(videoId);
      },
      updateStatus: async (
        parent: any,
        args: {id: string; status: string; uploadedURL: string},
        context: ExpressContext,
        info: any
      ) => {
        return await this.videoService.setStatus(
          args.id,
          args.status,
          args.uploadedURL
        );
      },
    },
  };
}
