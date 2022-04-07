import {AuthenticationError, ExpressContext, ForbiddenError} from 'apollo-server-express';
import logger, {log} from '../logger';
import {IWorkerService} from '../service/worker-service';
import {createPushHook} from '../controllers/webhooks';
import {VideoNotFound} from '../error/video_not_found_error';
import {
  IVideoService,
  RenderOptions,
  RenderStatus,
  VideoVisibility,
} from '../service/video_service';
import {getRepo} from '../common/util';

export class VideoResolver {
  workerService: IWorkerService;
  videoService: IVideoService;
  workerAuthSecret: String;

  constructor(workerService: IWorkerService, videoService: IVideoService, workerAuthSecret: String) {
    this.workerService = workerService;
    this.videoService = videoService;
    this.workerAuthSecret = workerAuthSecret;
  }

  resolvers = {
    Query: {
      video: async (
        parent: any,
        args: {id: string},
        context: ExpressContext,
        info: any
      ) => {
        const userId = context.req.userId;

        try {
          const video = await this.videoService.getVideo(args.id);
          if (
            video.visibility !== VideoVisibility.public &&
            video.ownerId !== userId
          ) {
            throw new VideoNotFound('Forbidden');
          }
          return video;
        } catch (error) {
          console.log(error);
          throw new VideoNotFound('Video not found!');
        }
      },
      videos: async (
        parent: any,
        args: {offset: number},
        context: ExpressContext,
        info: any
      ) => {
        const ownerId = context.req.userId!;
        return this.videoService.getVideos(ownerId, args.offset);
      },
    },
    Mutation: {
      deleteVideo: async (
        parent: any,
        args: {
          videoId: string;
        },
        context: ExpressContext,
        info: any
      ) => {
        return await this.videoService.deleteVideo(args.videoId);
      },
      renderVideo: async (
        parent: any,
        args: {
          renderType: string;
          repoURL: string;
          title: string;
          renderOptions: RenderOptions;
          description: string;
          hasWebhook: boolean;
          visibility: VideoVisibility;
        },
        context: ExpressContext,
        info: any
      ) => {
        logger.info('args', args);
        const ownerId = context.req.userId!;
        const video = await this.videoService.createVideo(
          ownerId,
          args.repoURL,
          RenderStatus.queued,
          args.title,
          args.description,
          args.hasWebhook,
          args.visibility,
          args.renderOptions
        );
        const videoId = video._id;
        this.workerService.enqueue(
          args.renderType,
          args.repoURL,
          videoId,
          context.req.session.passport!.user.auth.access_token,
          args.renderOptions
        );
        return this.videoService.getVideo(videoId);
      },
      updateStatus: async (
        parent: any,
        args: {
          id: string;
          status: string;
          uploadedURL: string;
          thumbnail: string;
        },
        context: ExpressContext,
        info: any
      ) => {
        // Check the request is actually coming from the worker.
        if (context.req.headers["X-Worker-Auth"] !== this.workerAuthSecret) {
          throw new AuthenticationError("Forbidden");
        }

        return await this.videoService.setStatus(
          args.id,
          args.status,
          args.uploadedURL,
          args.thumbnail
        );
      },
    },
  };
}
