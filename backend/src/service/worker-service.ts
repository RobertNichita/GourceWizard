import * as amqp from 'amqplib';
import logger from '../logger';

interface IWorkerService {
    enqueue(renderType: string, repoURL: string, videoId: string): any; // TODO: Define the return value
}

/**
 * Send a render request to the work queue. If the enqueue function
 * returns without errors, then the request was successfully queued.
 * 
 * The status of the job can be determined by it's status in the database:
 *  - ENQUEUED: Job is in the work queue or has been picked up by a consumer.
 *  - FAILED: Failed to render visualization.
 *  - UPLOADED: The video was successfully generated and uploaded.
 * 
 * See /worker/src/schema/gource-schema.ts for detailed payload schema.
 */
class WorkerService implements IWorkerService {
    url: string;
    queue: string;

    // AMQP Connection
    private connection: amqp.Connection | undefined;

    // AMQP Channel Object
    private channel: amqp.Channel | undefined;

    /**
     * Worker Service
     * @param url AMQP Url
     * @param queue Name of AMQP Queue
     */
    constructor(url: string, queue: string) {
        this.url = url;
        this.queue = queue;
    }

    async initialize() {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        this.channel.assertQueue(this.queue, { durable: true });
    }

    /**
     * Queue a render job in the specified queue and sets the video with the
     * specified videoId as status ENQUEUED
     * 
     * @param renderType Render Type
     * @param repoURL Repository URL, including https:// or git://
     * @param videoId Video ID
     */
    enqueue(renderType: string, repoURL: string, videoId: string) {
        if (!this.channel && !this.connection) {
            throw Error("Worker Service is not initalized.");
        }

        const message = {
            "renderType": renderType,
            "repoURL": repoURL,
            "videoId": videoId,
        };

        this.channel?.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        // TODO: set videoId in database to status ENQUEUED
    }
}

/** 
 * Mock Worker Service
 * 
 * Does not queue anything, just logs the parameters.
 */
class MockWorkerService implements IWorkerService {
    enqueue(renderType: string, repoURL: string, videoId: string) {
        logger.info("Job has been sent to mock worker service.", {renderType, repoURL, videoId});
    }    
}