# Use this base image for OpenGL support inside a Docker container
FROM utensils/opengl:stable

# Setup dependencies
RUN apk add --no-cache git gource ffmpeg aws-cli

# AWS Credentials
ENV AWS_ACCESS_KEY_ID 'secret'
ENV AWS_SECRET_ACCESS_KEY 'secret'
ENV AWS_REGION 'us-east-1'

ADD src/render/gource.sh /src/render/gource.sh

# docker build -t worker .
# docker run -it --rm -v $(pwd):/host worker /bin/sh





# apk add mesa-dri # seems to segfault instead of 
# gource: SDL initialization failed - GLX is not supported

# TODO: piping ffmpeg output to s3 seems complex.

# https://stackoverflow.com/questions/54736246/stream-ffmpeg-transcoding-result-to-s3