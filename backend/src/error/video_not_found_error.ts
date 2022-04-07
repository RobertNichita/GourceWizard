import {ApolloError} from 'apollo-server-errors';

export class VideoNotFound extends ApolloError {
  constructor(message: string) {
    super(message, 'VIDEO_NOT_FOUND');

    Object.defineProperty(this, 'name', {value: 'VideoNotFound'});
  }
}
