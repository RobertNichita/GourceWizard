import {spawn} from 'child_process';
import logger from '../logger';

function insertToken(repoURL: string, token: string): string {
  const splitURL: string[] = repoURL.split('/');
  if (token.substring(0, 3) === 'ghs') {
    token = 'x-access-token:'.concat(token);
  }
  const inserted = `${token}@${splitURL[2]}`;
  splitURL[2] = inserted;
  return splitURL.join('/');
}

export interface VideoRenderer {
  render(callback: VideoRendererCallback): void;
}

export type VideoRendererCallback = (
  status: RenderStatus,
  uploadedURL?: string,
  thumbnail?: string
) => void;

export class GourceVideoRenderer implements VideoRenderer {
  repoURL: string;
  videoId: string;
  gourceArgs: string;
  ffmpegArgs: string;
  s3Bucket: string;
  timeout: string;
  cdnRoot: string;
  token: string;

  constructor(
    repoURL: string,
    videoId: string,
    gourceArgs: string,
    ffmpegArgs: string,
    s3Bucket: string,
    timeout: string,
    cdnRoot: string,
    token: string
  ) {
    this.repoURL = repoURL;
    this.videoId = videoId;
    this.gourceArgs = gourceArgs;
    this.ffmpegArgs = ffmpegArgs;
    this.s3Bucket = s3Bucket;
    this.timeout = timeout;
    this.cdnRoot = cdnRoot;
    this.token = token;
  }

  render(callback: VideoRendererCallback): void {
    let authUrl = this.repoURL;
    if (this.token) {
      authUrl = insertToken(this.repoURL, this.token);
    }

    const args = [
      authUrl,
      this.videoId,
      this.gourceArgs,
      this.ffmpegArgs,
      this.s3Bucket,
      this.timeout,
    ];
    const childProcess = spawn('/worker/src/render/gource.sh', args);
    logger.info(`Running gource.sh with arguments ${args}`);

    childProcess.stdout?.on('data', data => {
      logger.info(data);
    });

    childProcess.stderr?.on('data', data => {
      logger.warn(data);
    });

    childProcess.on('close', (code, signal) => {
      logger.info(`Exit Code ${code}`);
      logger.info(`Signal ${signal}`);

      if (code === 0) {
        callback(
          RenderStatus.success,
          `${this.cdnRoot}${this.videoId}/${this.videoId}.m3u8`,
          `${this.cdnRoot}${this.videoId}/${this.videoId}-thumbnail.jpg`
        );
      } else if (code == 124) {
        callback(RenderStatus.timeout);
      } else {
        callback(RenderStatus.failure);
      }
    });
  }
}

export const enum RenderStatus {
  success = 'UPLOADED',
  failure = 'FAILED',
  timeout = 'TIMEOUT',
}
