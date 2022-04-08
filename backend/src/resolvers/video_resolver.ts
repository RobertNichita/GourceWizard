import {ExpressContext, AuthenticationError} from 'apollo-server-express';
import logger from '../logger';
import {IWorkerService} from '../service/worker-service';
import {VideoNotFound} from '../error/video_not_found_error';
import {
  IVideoService,
  RenderOptions,
  RenderStatus,
  VideoVisibility,
} from '../service/video_service';
import {
  MatcherRule,
  mongoObjectIdPattern,
  RangeRule,
  validateArgs,
} from './validation';
import {renderOptionsRules, renderRules} from './validation';
import sanitize from 'mongo-sanitize';

export class VideoResolver {
  workerService: IWorkerService;
  videoService: IVideoService;
  workerAuthSecret: String;

  constructor(
    workerService: IWorkerService,
    videoService: IVideoService,
    workerAuthSecret: String
  ) {
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
        validateArgs(args, {
          offset: {rule: new MatcherRule(mongoObjectIdPattern)},
        });
        args.id = sanitize(args.id);
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
        validateArgs(args, {
          offset: {rule: new RangeRule(0)},
        });

        args.offset = sanitize(args.offset);
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
        validateArgs(args, {
          videoId: {rule: new MatcherRule(mongoObjectIdPattern)},
        });
        args.videoId = sanitize(args.videoId);
        const video = await this.videoService.getVideo(args.videoId);
        if (video.ownerId !== context.req.userId) {
          throw new VideoNotFound('Forbidden');
        }
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
        validateArgs(args, renderRules);

        validateArgs(
          args.renderOptions,
          renderOptionsRules(args.renderOptions.stop)
        );

        args.renderType = sanitize(args.renderType);
        args.repoURL = sanitize(args.repoURL);
        args.title = sanitize(args.title);
        args.description = sanitize(args.description);
        args.renderOptions.title = sanitize(args.renderOptions.title);

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
        logger.info(`header: ${context.req.headers['x-worker-auth']}`);
        logger.info(`secret: ${this.workerAuthSecret}`);
        if (context.req.headers['x-worker-auth'] !== this.workerAuthSecret) {
          logger.info('worker header mismatch');
          throw new AuthenticationError('Forbidden');
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
