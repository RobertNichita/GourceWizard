import {useLocation} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import {
  IVideoService,
  Video,
  VideoService,
  VideoVisibility,
} from '../services/video_service';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import DotLoader from 'react-spinners/DotLoader';
import ReactPlayer from 'react-player';
import {ErrorAlert} from '../components/alert/ErrorAlert';
import {Button} from '../components/Button';
import {useNavigate} from 'react-router-dom';

export default function library(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Test video from Akamai Stream Validation and Player Test Page (https://players.akamai.com/players/hlsjs)
  const testVideo =
    'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8';
  const [video, setVideo] = useState<Video>({
    title: 'Title',
    description: 'Description',
    createdAt: '1',
    thumbnail: 'https://http.cat/404',
    url: testVideo,
    status: 'UPLOADED',
    _id: '1',
    hasWebhook: false,
    visibility: VideoVisibility.public,
  });
  const [errorMessage, setErrorMessage] = useState<String>();

  const location = useLocation();
  const {videoId} = useParams();

  const videoService: IVideoService = new VideoService();

  useEffect(() => {
    if (location.state) {
      const video = location.state as Video;
      setVideo(video);
      setIsLoading(false);
    } else if (videoId) {
      setIsLoading(true);
      // No state was passed, but we have a video id... fetch the video.
      videoService
        .getVideo(videoId)
        .then(video => {
          setIsLoading(false);
          setVideo(video);
        })
        .catch(error => {
          setIsLoading(false);
          setErrorMessage(error.message);
        });
    }
  }, []);

  let content = <></>;
  if (!errorMessage) {
    if (isLoading) {
      content = <DotLoader />;
    } else {
      content = (
        <div>
          <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-start items-end">
              <p className="mr-2 text-5xl">{video.title}</p>
              <p className="mx-2 text-gray-500 text-2xl">
                {new Date(parseInt(video.createdAt)).toLocaleString()}
              </p>
            </div>
            <a data-mdb-ripple="true" data-mdb-ripple-color="light">
              <ReactPlayer
                playsinline={true}
                controls={true}
                light={video.thumbnail}
                url={video.url}
              />
            </a>
            {video.hasWebhook && (
              <div className="mt-1 mr-1 mb-1 max-w-fit">
                <p className="text-sm">
                  🔁 This video is set to be re-rendered on every commit.
                </p>
              </div>
            )}
            {video.description && (
              <div className="mt-5 max-w-fit">
                <label className="form-label" htmlFor="grid-title">
                  Description
                </label>
                <p className="text-base mb-4 ">{video.description}</p>
              </div>
            )}

            <div className="flex flex-row">
              <Button
                className="ml-0 pl-2"
                title="📖 Back"
                onClick={() => {
                  navigate('/library');
                }}
              ></Button>
              {video.visibility === VideoVisibility.public && (
                <Button
                  className="pl-2"
                  title="🔗 Share with Friends"
                  onClick={e => {
                    navigator.clipboard.writeText(window.location.href);
                    e.stopPropagation();
                  }}
                ></Button>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10 mt-10">
        {errorMessage && <ErrorAlert description={errorMessage} />}
        {content}
      </div>
    </div>
  );
}
