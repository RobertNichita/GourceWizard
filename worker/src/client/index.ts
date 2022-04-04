import axios from 'axios';
import logger from '../logger';
import { RenderStatus } from '../render';

export interface APIClient {
  setStatus(videoId: string, status: RenderStatus, uploadedURL?: string, thumbnail?: string): any;
}

export class MockAPIClient implements APIClient {
  setStatus(videoId: string, status: RenderStatus, uploadedURL?: string, thumbnail?: string) {
    logger.info(`Mock API Call with ${videoId} ${status} ${uploadedURL}`);
  }
}

export class GraphQLAPIClient implements APIClient {
  backendURL: string;
  constructor(backendURL: string) {
    this.backendURL = backendURL;
  }

  async setStatus(videoId: string, status: RenderStatus, uploadedURL?: string, thumbnail?: string) {
    const body = {
      query:
        'mutation($videoId: ID!, $status: VideoStatus!, $uploadedURL: String, $thumbnail: String) {updateStatus(id: $videoId, status: $status, uploadedURL: $uploadedURL, thumbnail: $thumbnail) {status}}',
      variables: {
        videoId: videoId,
        status: status,
        uploadedURL: uploadedURL || null, // This default is needed because we actually want a null value instead of undefined.
        thumbnail: thumbnail || null // This default is needed because we actually want a null value instead of undefined.
      },
    };

    logger.info(`body`, body)
    const response = await axios.post(this.backendURL, body);
    logger.info(`Successfully updated status of video ${videoId}`);

    if (response.status !== 200) {
      logger.error(`Failed to update status of video ${videoId}`, body, response)
      throw Error(`Failed to update status of video ${videoId}`);
    }
  }
}
