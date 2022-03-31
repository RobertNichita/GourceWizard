import {execFile, spawn} from 'child_process';
import logger from '../logger';

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

  constructor(
    repoURL: string,
    videoId: string,
    gourceArgs: string,
    ffmpegArgs: string,
    s3Bucket: string,
    timeout: string,
    cdnRoot: string
  ) {
    this.repoURL = repoURL;
    this.videoId = videoId;
    this.gourceArgs = gourceArgs;
    this.ffmpegArgs = ffmpegArgs;
    this.s3Bucket = s3Bucket;
    this.timeout = timeout;
    this.cdnRoot = cdnRoot;
  }

  render(callback: VideoRendererCallback): void {
    const args = [
      this.repoURL,
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
        callback(RenderStatus.success, `${this.cdnRoot}${this.videoId}/${this.videoId}.m3u8`, `${this.cdnRoot}${this.videoId}/${this.videoId}-thumbnail.jpg`);
      } else {
        callback(RenderStatus.failure);
      }
    });
  }
}

export const enum RenderStatus {
  success = "UPLOADED",
  failure = "FAILURE",
  timeout = "TIMEOUT",
}
