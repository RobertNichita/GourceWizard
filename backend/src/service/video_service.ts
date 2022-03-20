import mongoose from "mongoose";
import logger from "../logger";

export interface IVideoService {

    createVideo(ownerId: string, gitRepoURL: string, status: string): Promise<any>

    setStatus(videoId: string, status: string): Promise<any>

    getVideo(videoId: string): Promise<any>
}

const videoSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    thumbnail: {
        type: String
    },
    url: {
        type: String
    },
    visibility: {
        type: String,
        required: true
    },
    repositoryURL: {
        type: String,
        required: true
    },
    renderOptions: {
        type: String
    },
    status: {
        type: String // TODO: How to do enums?
    }
}, {timestamps: true})

export const Video = mongoose.model("Video", videoSchema);

export class VideoService implements IVideoService {
    async getVideo(videoId: string): Promise<any> {
        let video = await Video.findById(videoId);
        logger.info(`Returning video`, video);
        return video
    }

    async setStatus(videoId: string, status: string): Promise<any> {
        let video = await Video.findById(videoId).update({status: status});
        logger.info(`Update video ${videoId} to status ${status}`, video);
        return this.getVideo(videoId);
    }

    // TODO: @Robert how to mongoose and get the types working properly?
    // This returns the id of the new video right now, without error checking.
    // We probably want to return the inserted result.
    async createVideo(ownerId: string, gitRepoURL: string, status: string): Promise<String> {
        let video = await Video.create({
            ownerId: ownerId,
            visibility: 'PUBLIC',
            title: 'An unnamed video',
            description: 'Lorem Ipsum',
            repositoryURL: gitRepoURL,
            renderOptions: 'todo',
            status: status
        });
        let videoId = video._id.toString();
        logger.info(`Created video ${videoId}`, video);
        return videoId;
    }
}


// resolvers = {
//   Mutation: {
//       renderVideo: (parent: any, args: { renderType: string, repoURL: string }, context: ExpressContext, info: any) => {
//           logger.info('args', args)
//           const ownerId = 123; // TODO: hard code until Robert merge, should get from context.
//           const videoId = uuid();
//           // TODO: Create a database entry
//           /**
//            * 
//            * Video
//            * {
//            *  owner: ownerId,
//            *  createdAt: now()
//            *  updatedAt: now()
//            *  title: repoUrl???
//            *  description: ???
//            *  thumbnail: none -- to be generated later?
//            *  url: none
//            *  visibility: PUBLIC -- for now, hard coded.
//            *  gitRepoURL: $repoURL
//            *  renderOptions: hard code to something for now.
//            *  renderType: $repoType
//            * }
//            * 
//            * 
//       *  owner: User
//       *  createdAt: Timestamp
//       *  updatedAt: Timestamp
//       *  title: String
//       *  description: String
//       *  thumbnail: String
//       *  url: String
//       *  visibility: VideoVisibility
//       *  gitRepoURL: String (Only visible to owner)
//       *  renderOptions: String(JSON representation of [1]), Only visible to owner)
//            * 
//            * }
//            * 
//            * 
//            * 
//            * 
//            * 
//            * 
//            */

//           this.workerService.enqueue(args.renderType, args.repoURL, videoId);
//       }