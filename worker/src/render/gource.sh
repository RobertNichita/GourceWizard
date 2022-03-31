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

# Create temporary directory
cd $(mktemp -d)
TEMP_DIRECTORY=`pwd`

function cleanup() {
    # rm -rf $TEMP_DIRECTORY
    echo "e"
}

# Kill gource 1 second after timeout.
KILL='1'

# Only clone git history
echo "Cloning repo $REPO_URL into $TEMP_DIRECTORY"
git clone $REPO_URL --bare --single-branch .git
if [ $? -ne 0 ]; then
    echo "Failed to clone git repo $REPO_URL"
    cleanup
    exit 1
fi

echo "Visualizing repo $REPO_URL"
# FFMPEG_ARGS is hard coded to:
# -i - -profile:v high444 -preset ultrafast -start_number 0 -hls_list_size 0 -hls_segment_filename '$FILE_NAME-%06d.ts' -f hls $FILE_NAME.m3u8
# Which generates a list of mpeg transport streams called ${videoId}-0000XXX.ts in order of time.
timeout -k $KILL $TIMEOUT gource $GOURCE_ARGS | ffmpeg $FFMPEG_ARGS
EXIT_VAL=$?
if [ $EXIT_VAL -ne 0 ]; then
    echo "Error generating video, with exit code $EXIT_VAL".
    cleanup
    exit $EXIT_VAL
fi

# Generate thumbnail
echo "Generating thumbnail"
# Get the last transtorm stream and use that to get the stream's last frame.
LAST_SEGMENT_FILE_NAME=`ls *.ts | grep $FILE_NAME- | sort -r | head -n 1`
echo "USING FILEEEE" $LAST_SEGMENT_FILE_NAME
echo "ffmpeg -i $LAST_SEGMENT_FILE_NAME -update 1 -q:v 1 $FILE_NAME-thumbnail.jpg"
ffmpeg -i $LAST_SEGMENT_FILE_NAME -update 1 $FILE_NAME-thumbnail.jpg
EXIT_VAL=$?
if [ $EXIT_VAL -ne 0 ]; then
    echo "Error generating thumbnail, with exit code $EXIT_VAL".
    cleanup
    exit $EXIT_VAL
fi

echo "Uploading files to S3 bucket $S3_BUCKET"
# Copying multiple files: https://stackoverflow.com/questions/57765350/aws-how-to-copy-multiple-file-from-local-to-s3
aws s3 cp $TEMP_DIRECTORY $S3_BUCKET/$FILE_NAME/  --recursive --exclude "*" --include "$FILE_NAME*"
if [ $? -ne 0 ]; then
    echo "Failed to upload $FILE_NAME and it's thumbnail to $S3_BUCKET"
    exit 1
fi

# Cleanup by removing temporary directory
cleanup