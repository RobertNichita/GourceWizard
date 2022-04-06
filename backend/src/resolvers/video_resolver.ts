import {ExpressContext} from 'apollo-server-express';
import logger, {log} from '../logger';
import {IWorkerService} from '../service/worker-service';
import {createPushHook} from '../controllers/webhooks';
import {VideoNotFound} from '../error/video_not_found_error';
import {IVideoService, RenderStatus} from '../service/video_service';
import {getRepo} from '../common/util';

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
        const userId = context.req.userId;

        try {
          const video = await this.videoService.getVideo(args.id);
          console.log(userId);
          console.log(video.ownerId);
          if (video.visibility !== 'PUBLIC' && video.ownerId !== userId) {
            throw new VideoNotFound('Video not found!');
          }
          return video;
        } catch (error) {
          throw new VideoNotFound('Video not found!');
        }
      },
      videos: async (
        parent: any,
        args: any,
        context: ExpressContext,
        info: any
      ) => {
        const ownerId = context.req.userId!;
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
          hasWebhook: boolean;
        },
        context: ExpressContext,
        info: any
      ) => {
        logger.info('args', args);
        log(`ffffff${JSON.stringify(context.req.session.passport)}`);
        const ownerId = context.req.userId!;
        const video = await this.videoService.createVideo(
          ownerId,
          args.repoURL,
          RenderStatus.queued,
          args.title,
          args.description,
          args.hasWebhook
        );
        const videoId = video._id;
        this.workerService.enqueue(
          args.renderType,
          args.repoURL,
          videoId,
          context.req.session.passport!.user.auth.access_token
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
