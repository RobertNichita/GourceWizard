import axios from 'axios';
import logger from '../logger';
import {RenderStatus} from '../render';

// TODO: this.
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
      query: // TODO: add thumbnail... double check schema for failure case because we have optional stuff.
        'mutation($videoId: ID!, $status: VideoStatus!, $uploadedURL: String, $thumbnail: String) {updateStatus(id: $videoId, status: $status, uploadedURL: $uploadedURL, thumbnail: $thumbnail) {status}}',
      variables: {
        videoId: videoId,
        status: status,
        uploadedURL: uploadedURL,
        thumbnail: thumbnail
      },
    };

    const response = await axios.post(this.backendURL, body);
    logger.info(`Successfully updated status of video ${videoId}`)

    if (response.status !== 200) {
      throw Error(`Failed to update status of video ${videoId}`);
    }
  }
}
