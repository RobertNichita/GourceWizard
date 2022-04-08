import {
  addAuthKit,
  isAuthenticatedResolver,
} from './middleware/authenticated_resolver';
import {mergeResolvers} from '@graphql-tools/merge';
import {VideoResolver} from './video_resolver';
import {composeResolvers} from '@graphql-tools/resolvers-composition';
import {IWorkerService} from '../service/worker-service';
import {IVideoService} from '../service/video_service';
import {userIdResolver} from './middleware/user_id_resolver';

export interface IComposedResolvers {
  compose(): any;
}

export class ComposedResolvers implements IComposedResolvers {
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

  compose() {
    const videoResolver = new VideoResolver(
      this.workerService,
      this.videoService,
      this.workerAuthSecret
    );

    // Merge all resolvers into single resolver object
    const mergedResolvers = mergeResolvers([videoResolver.resolvers]);

    const resolversComposition = {
      'Query.helloAuth': [isAuthenticatedResolver()],
      'Query.me': [isAuthenticatedResolver()],
      'Query.video': [userIdResolver()],
      'Query.videos': [isAuthenticatedResolver(), userIdResolver()],
      'Mutation.deleteVideo': [userIdResolver()],
      'Mutation.renderVideo': [
        isAuthenticatedResolver(),
        userIdResolver(),
        addAuthKit(),
      ],
    };

    const composedResolvers = composeResolvers(
      mergedResolvers,
      resolversComposition
    );

    return composedResolvers;
  }
}
