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
    "renderType": "gource", // Required (enum: gource)
    "repoURL": "https://github.com/Raieen/Raieen.git", // Required, URL -- USER
    "videoId": "random-uuid-representing-video", // Required, unique string -- SYSTEM
    "gource": {
        // All fields are optional.
        // "-f": true, // -f // Not necessary
        "resolution": "-1280x720", // -1280x720 -- HARD CODE (pass into args: -1280x720)
        "--start-date": "'YYYY-MM-DD hh:mm:ss +tz", // --start-date 'YYYY-MM-DD hh:mm:ss +tz' --- USER
        "--stop-date":  "'YYYY-MM-DD hh:mm:ss +tz",  // Stop at a date and optional time -- USER
        "--stop-at-time": 1, // seconds... stop after 30 seconds? -- SYSTEM
        "--seconds-per-day": 1, //seconds -- SYSTEM
        "--key": true, // bool, -- USER
        "--time-scale": 1.0, // float -- ???
        "--elasticity": 1.0, // float -- USER
        "--output-framerate": 25, // Required Int Enum (25, 30, 60) -- SYSTEM -- HARD CODE (pass into args:  -r 25)
        "--output-ppm-stream": "-", // Should always be STDIN? -- SYSTEM, -- HARD CODE (pass into args: -o -)
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


