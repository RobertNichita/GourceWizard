import mongoose from 'mongoose';
import logger, {log} from '../logger';

export enum RenderStatus {
  success = 'UPLOADED',
  failure = 'FAILED',
  timeout = 'TIMEOUT',
  queued = 'ENQUEUED',
}

export enum VideoVisibility {
  public = 'PUBLIC',
  private = 'PRIVATE',
}

export interface RenderOptions {
  start?: Number;
  stop?: Number;
  key?: boolean;
  elasticity?: Number;
  bloomMultiplier?: Number;
  bloomIntensity?: Number;
  title?: String;
}
const renderOptionsSchema = {
  start: {type: Number},
  stop: {type: Number},
  key: {type: Boolean},
  elasticity: {type: Number},
  bloomMultiplier: {type: Number},
  bloomIntensity: {type: Number},
  title: {type: String},
};

export interface Video {
  _id: string;
  ownerId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  visibility: VideoVisibility;
  repositoryURL: string;
  renderOptions: RenderOptions;
  status?: RenderStatus;
  hasWebhook: boolean;
}

export interface IVideoService {
  createVideo(
    ownerId: string,
    gitRepoURL: string,
    status: string,
    title: string,
    description: string,
    hasWebhook: boolean,
    visibility: VideoVisibility,
    renderOptions: RenderOptions
  ): Promise<Video>;

  /**
   *
   * @param videoId Video Id
   * @param status Status
   */
  setStatus(
    videoId: string,
    status: string,
    uploadedURL: string,
    thumbnail: string
  ): Promise<Video>;

  /**
   * get the latest video from this repository
   *
   * @param repoURL the URL of the repository
   */
  getLatestRepoVideo(repoURL: string): Promise<Video>;

  /**
   * Return video with the specified video id
   * @param videoId Video Id
   */
  getVideo(videoId: string): Promise<Video>;

  /**
   * Return all videos owned by the user with the specified ownerId.
   * @param ownerId Owner Id
   */
  getVideos(
    ownerId: string,
    offset: number
  ): Promise<{videos: Video[]; next: boolean}>;

  /**
   * delete a video
   * @param videoId Object Id of the video being deleted
   */
  deleteVideo(videoId: string): Promise<Video>;
}

const videoSchema = new mongoose.Schema<Video>(
  {
    ownerId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    url: {
      type: String,
    },
    visibility: {
      type: String,
      required: true,
    },
    repositoryURL: {
      type: String,
      required: true,
    },
    renderOptions: {
      type: renderOptionsSchema,
    },
    status: {
      type: String,
      enum: Object.values(RenderStatus),
    },
    hasWebhook: {
      type: Boolean,
      required: true,
    },
  },
  {timestamps: true}
);

export const Video = mongoose.model('Video', videoSchema);

export class VideoService implements IVideoService {
  async deleteVideo(videoId: string): Promise<Video> {
    log(videoId);
    const video = await Video.findByIdAndDelete(videoId);
    if (video === null) {
      throw Error('Video not found for deletion');
    }
    log(`Deleting video ${video}`);
    return video;
  }

  async getVideo(videoId: string): Promise<Video> {
    const video = await Video.findById(videoId);
    if (video === null) {
      throw Error('Video not found');
    }
    logger.info('Returning video', video);
    return video;
  }

  /**
   *
   * @param repoURL the URL of the repo being queried
   * @returns the latest video from this repo which has webhook enabled
   */
  async getLatestRepoVideo(repoURL: string): Promise<Video> {
    const videos = await Video.find({repositoryURL: repoURL, hasWebhook: true})
      .sort({
        createdAt: 'desc',
      })
      .limit(1);
    log(`Returning Video from repo ${repoURL}`);
    return videos[0];
  }

  async getVideos(
    ownerId: string,
    offset: number
  ): Promise<{videos: Video[]; next: boolean}> {
    const videos = await Video.find({ownerId: ownerId})
      .sort({
        createdAt: 'desc',
      })
      .skip(offset * 6)
      .limit((offset + 1) * 6);
    const next = await Video.exists({ownerId: ownerId})
      .sort({
        createdAt: 'desc',
      })
      .skip((offset + 1) * 6)
      .limit((offset + 2) * 6);
    logger.info(`Returning videos for owner ${ownerId}`, videos);
    return {videos, next: next !== null};
  }

  async setStatus(
    videoId: string,
    status: string,
    uploadedURL: string,
    thumbnail: string
  ): Promise<Video> {
    const video = await Video.findById(videoId).update({
      status: status,
      url: uploadedURL,
      thumbnail: thumbnail,
    });
    logger.info(`Update video ${videoId} to status ${status}`, video);
    return this.getVideo(videoId);
  }

  async createVideo(
    ownerId: string,
    gitRepoURL: string,
    status: string,
    title: string,
    description: string,
    hasWebhook: boolean,
    visibility: string,
    renderOptions: RenderOptions
  ): Promise<Video> {
    const video = await Video.create({
      ownerId: ownerId,
      visibility: visibility,
      title: title,
      description: description,
      thumbnail: 'https://http.cat/102',
      repositoryURL: gitRepoURL,
      status: status,
      hasWebhook: hasWebhook,
      renderOptions: renderOptions,
    });
    const videoId = video._id.toString();
    logger.info(`Created video ${videoId}`, video);
    return video;
  }
}
