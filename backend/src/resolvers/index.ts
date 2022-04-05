import {
  addAuthKit,
  isAuthenticatedResolver,
} from './middleware/authenticated_resolver';
import {mergeResolvers} from '@graphql-tools/merge';
import {resolvers as userResolvers} from './user_resolver';
import {resolvers as testResolvers} from './test_resolver';
import {VideoResolver} from './video_resolver';
import {composeResolvers} from '@graphql-tools/resolvers-composition';
import {IWorkerService} from '../service/worker-service';
import {IVideoService} from '../service/video_service';
import {userIdResolver} from './middleware/user_id_resolver';

export interface IComposedResolvers {
  compose(): any; // TODO: type
}

export class ComposedResolvers implements IComposedResolvers {
  workerService: IWorkerService;
  videoService: IVideoService;

  constructor(workerService: IWorkerService, videoService: IVideoService) {
    this.workerService = workerService;
    this.videoService = videoService;
  }

  compose() {
    const videoResolver = new VideoResolver(
      this.workerService,
      this.videoService
    );

    // Merge all resolvers into single resolver object
    const mergedResolvers = mergeResolvers([
      userResolvers,
      videoResolver.resolvers,
      testResolvers,
    ]);

    const resolversComposition = {
      'Query.helloAuth': [isAuthenticatedResolver()],
      'Query.me': [isAuthenticatedResolver()],
      'Query.videos': [isAuthenticatedResolver(), userIdResolver()],
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
