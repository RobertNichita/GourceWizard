# Worker

Workers will be assigned (round-robin) render jobs.

The worker is extensible to other visualizers (if this wasn't a course project) in the future but only Gource has been implemented.

Each worker will
1. checkout the repo
2. visualize it
3. upload the visualization it to s3


## Incoming Message

This should be sent to the worker over RabbitMQ. The message is a JSON string of the following object.

See https://github.com/acaudwell/Gource/wiki/Controls

```json
{
    "type": "gource", // Required (enum: gource)
    "repoURL": "https://github.com/Raieen/Raieen.git", // Required, URL -- USER
    "videoId": "random-uuid-representing-video", // Required, unique string -- SYSTEM
    "gource": {
        // All fields are optional.
        // "-f": true, // -f // Not necessary
        "resolution": "-1280x720", // -1280x720 -- USER
        "--start-date": "'YYYY-MM-DD hh:mm:ss +tz", // --start-date 'YYYY-MM-DD hh:mm:ss +tz' --- USER
        "--stop-date":  "'YYYY-MM-DD hh:mm:ss +tz",  // Stop at a date and optional time -- USER
        "--stop-at-time": 1, // seconds... stop after 30 seconds? -- SYSTEM
        "--seconds-per-day": 1, //seconds -- SYSTEM
        "--key": true, // bool, -- USER
        "--time-scale": 1.0, // float -- ???
        "--elasticity": 1.0, // float -- USER
        "--output-framerate": 25, // Required Int Enum (25, 30, 60) -- SYSTEM
        "--output-ppm-stream": "-", // Should always be STDIN? -- SYSTEM,
        "--bloom-multiplier": 2.0, // float -- USER
        "--bloom-intensity": 1.5, // float -- USER
        "--title": "Title Here" // String -- USER
    },
    // No FFMPEG customizations here, it gets hard coded.
    // "ffmpeg": {
        // No customizability here. We hard code things.
    // }
}
```

### Success

???

Upon success, the worker will update the database with the link to the video.

### Failure

???

NACK and hope the job gets re-queued.

Dead-letter queue after 3 retries?






TODO: https://www.digitalocean.com/community/tutorials/typescript-new-project


docker run --rm -it amazon/aws-cli configure

AWS Access Key ID: AKIA3SK6BFZU2XCMKO6A
Secret Access Key: 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
Users with AWS Management Console access can sign-in at: https://795303030377.signin.aws.amazon.com/console 



docker run --rm -it -v ~/.aws:/root/.aws amazon/aws-cli configure

docker run --rm -it -v ~/.aws:/root/.aws amazon/aws-cli sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/795303030377/gource-wizard-ryan.fifo

docker run --rm -it -v ~/.aws:/root/.aws amazon/aws-cli sqs list-queues

```bash
[ryan worker] docker run --rm -it -v ~/.aws:/root/.aws amazon/aws-cli sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/795303030377/gource-wizard-ryan.fifo                             [master✱]
{
    "Messages": [
        {
            "MessageId": "bef8c78d-74e6-408d-aa1c-a7f344fac36a",
            "ReceiptHandle": "AQEB/uIQJeW/URONuJ6bscS5h7Nbce3uU8Sy4u9HFWqjIRfKJ/RtzBJvrEiwCskR7yX1GHmabylvBw9McFV8MGgeJqGuNwXENZUX/g7Ir9jJaVMKwTNVGWTeC/4p/kVhGLzyJ+iI+iuxw/gYkyoOd0/PvK7D7+WLByOdrY2ea7cKs2Ngk+CtrtWL05kPVeMmeIkvqkui7i1Ze0fV7FWBiLmfKj0pGazZDrmQT8rN6d8y4NU222TwHLEML2RrzqoqA3sXXX0YNdIUB5+2qMKZeJ95XJYEXGqNlYGsMeI0uVa8Tw8=",
            "MD5OfBody": "d1d4180b7e411c4be86b00fb2ee103eb",
            "Body": "Test Message"
        }
    ]
}

```

ARN: arn:aws:sqs:us-east-1:795303030377:gource-wizard-ryan.fifo
URL: https://sqs.us-east-1.amazonaws.com/795303030377/gource-wizard-ryan.fifo




```bash
sudo npm install -g ts-node

ts-node index.ts
```



```bash
# Worker Stuff

# 1. Get message
docker run --rm -it -v ~/.aws:/root/.aws amazon/aws-cli sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/795303030377/gource-wizard-ryan.fifo

# 2. Delete message
docker run --rm -it -v ~/.aws:/root/.aws amazon/aws-cli sqs delete-message --queue-url https://sqs.us-east-1.amazonaws.com/795303030377/gource-wizard-ryan.fifo --receipt-handle x

# 3. gource | ffmpeg | aws cli
# Use the message's payload to get the gource command line arguments, ffmpeg command line arguments, aws cli command line arguments

# 4. grpc/curl to backend API, tell it the job is done and where to find video.

# TODO: how to handle worker failures? i.e. if there's no ack from worker, should the request be re-queued? or dead-lettered?
```

read about https://www.migenius.com/articles/cost-effective-rendering-with-amazon-sqs-and-s3


https://www.rabbitmq.com/tutorials/tutorial-two-python.html

Does SQS have
- round robin
- how fails?
- consumer ack



Round Robin (Is this the best to use?)

Use Fair Dispatch
