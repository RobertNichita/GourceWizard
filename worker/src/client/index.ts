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
