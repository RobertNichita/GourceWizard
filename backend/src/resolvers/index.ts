import {
  addAuthKit,
  isAuthenticatedResolver,
} from './middleware/authenticated_resolver';
import {mergeResolvers} from '@graphql-tools/merge';
import {resolvers as userResolvers} from './user_resolver';
import {resolvers as testResolvers} from './test_resolver';
import {VideoResolver} from './video_resolver';
import {composeResolvers} from '@graphql-tools/resolvers-composition';
import {MockWorkerService} from '../service/worker-service';

const videoResolver = new VideoResolver(new MockWorkerService()); // TODO: replace mock

// Merge all resolvers into single resolver object
const mergedResolvers = mergeResolvers([
  userResolvers,
  videoResolver.resolvers,
  testResolvers,
]);

const resolversComposition = {
  'Query.helloAuth': [isAuthenticatedResolver()],
  'Query.me': [isAuthenticatedResolver()],
  'Mutation.renderVideo': [isAuthenticatedResolver(), addAuthKit()], // TODO: comment in
};

const composedResolvers = composeResolvers(
  mergedResolvers,
  resolversComposition
);

export default composedResolvers;
