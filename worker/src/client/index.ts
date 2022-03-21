import axios from 'axios';
import logger from '../logger';
import {RenderStatus} from '../render';

// TODO: this.
export interface APIClient {
  setStatus(videoId: string, status: RenderStatus, uploadedURL?: string): any;
}

export class MockAPIClient implements APIClient {
  setStatus(videoId: string, status: RenderStatus, uploadedURL?: string) {
    logger.info(`Mock API Call with ${videoId} ${status} ${uploadedURL}`);
  }
}

export class GraphQLAPIClient implements APIClient {
  backendURL: string;
  constructor(backendURL: string) {
    this.backendURL = backendURL;
  }

  async setStatus(videoId: string, status: RenderStatus, uploadedURL?: string) {
    const body = {
      query:
        'mutation($videoId: ID!, $status: VideoStatus!, $uploadedURL: String!) {updateStatus(id: $videoId, status: $status, uploadedURL: $uploadedURL) {status}}',
      variables: {
        videoId: videoId,
        status: 'UPLOADED',
        uploadedURL: uploadedURL,
      },
    };

    const response = await axios.post(this.backendURL, body);
    logger.info(`Successfully updated status of video ${videoId}`)

    if (response.status !== 200) {
      throw Error(`Failed to update status of video ${videoId}`);
    }
  }
}
