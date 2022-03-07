#!/bin/sh

# Visualize Git repos using Gource and upload the video to S3.
#
# Usage: gource.sh REPO_URL FILE_NAME GOURCE_ARGS FFMPEG_ARGS S3_BUCKET TIMEOUT
#
# REPO_URL - Git Repository URL
# FILE_NAME - File name to save the video file, this should be a UUID or something unique.
# GOURCE_ARGS - Arguments for Gource
# FFMPEG_ARGS - Arguments for FFmpeg
# S3_BUCKET - S3 Bucket to upload the video files
# TIMEOUT - Timeout to generate Gource visualization
#
# Exit Codes
# 0 - Success
# 124 - Timeout
# Anything Else - Assume failure
################################################################
if [ "$#" -ne 6 ]; then
    echo "Invalid Arguments"
    exit 1
fi

REPO_URL="$1"
FILE_NAME="$2"
GOURCE_ARGS="$3"
FFMPEG_ARGS="$4"
S3_BUCKET="$5"
TIMEOUT="$6"

TEMP_DIRECTORY="/tmp/$FILE_NAME"

function cleanup() {
    rm -rf $TEMP_DIRECTORY
}

# Kill gource 1 second after timeout.
KILL='1'

# Create temporary directory
mkdir $TEMP_DIRECTORY
if [ $? -ne 0 ]; then
    echo "Failed to create temporary directory $TEMP_DIRECTORY"
    exit 1
fi

cd $TEMP_DIRECTORY

# Only clone git history
echo "Cloning repo $REPO_URL"
git clone $REPO_URL --bare .git
if [ $? -ne 0 ]; then
    echo "Failed to clone git repo $REPO_URL"
    cleanup
    exit 1
fi

echo "Visualizing repo $REPO_URL"
timeout -k $KILL $TIMEOUT gource $GOURCE_ARGS | ffmpeg $FFMPEG_ARGS
EXIT_VAL=$?
if [ $EXIT_VAL -ne 0 ]; then
    echo "Error generating video, with exit code $EXIT_VAL".
    cleanup
    exit $EXIT_VAL
fi

echo "Uploading file $FILE_NAME to S3 bucket $S3_BUCKET"
aws s3 cp $FILE_NAME.mp4 $S3_BUCKET
if [ $? -ne 0 ]; then
    echo "Failed to upload $FILE_NAME to $S3_BUCKET"
    exit 1
fi

# Cleanup by removing temporary directory
cleanup