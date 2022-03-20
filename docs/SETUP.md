# Setup

## Worker

1. Configure the environment variables found in the `docker-compose.yml` file.
2. Run `docker-compose up`

## S3 Bucket and Cloudfront CDN

Reference: https://docs.aws.amazon.com/AmazonS3/latest/userguide/tutorial-s3-cloudfront-route53-video-streaming.html

### S3 Bucket

S3 is used to store the generated videos.

### Cloudfront CDN

Cloudfront is the CDN used to cache generated videos in S3.

1. Create a Cloudfront Origin Access Identity, call this C09-Gource-OAI
2. Create a Cloudfront distribution, it should match the S3 Bucket Name but that's just convention.
- Leave all the settings as defaults, **except** for Price Class and Viewer Protocol Policy
- Price Class: Use only North America and Europe.
- Viewer Protocol Policy: HTTPS Only
3. Configure the worker with the distribution domain name from S3. E.g. `nonsense.cloudfront.net`.
