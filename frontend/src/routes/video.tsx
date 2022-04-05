import { useLocation } from 'react-router-dom';
import { AppBanner } from '../components/navigation/AppBanner';
import { Back } from '../components/navigation/Back';
import { IVideoService, Video, VideoService } from '../services/video_service';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DotLoader from 'react-spinners/DotLoader';
import ReactPlayer from 'react-player';
import { ErrorAlert } from '../components/alert/ErrorAlert';

export default function library(props) {

  const [isLoading, setIsLoading] = useState(false);

  // Test video from Akamai Stream Validation and Player Test Page (https://players.akamai.com/players/hlsjs)
  const testVideo = "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8";
  const [video, setVideo] = useState({ title: "Title", description: "Description", createdAt: "1", thumbnail: "https://http.cat/404", url: testVideo });
  const [errorMessage, setErrorMessage] = useState<String>();

  const location = useLocation();
  const { videoId } = useParams();

  const videoService: IVideoService = new VideoService();

  useEffect(() => {
    if (location.state) {
      const video = location.state as Video;
      setVideo(video);
      setIsLoading(false);
    } else if (videoId) {
      setIsLoading(true);
      // No state was passed, but we have a video id... fetch the video.
      videoService.getVideo(videoId).then((video) => {
        setIsLoading(false);
        setVideo(video);
      }).catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
    }
  }, []);

  let content = <></>
  if (!errorMessage) {
    if (isLoading) {
      content = <DotLoader />;
    } else {
      content = <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">

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
        <div className="mt-5 max-w-fit">
          <p className="text-base mb-4 ">{video.description}</p>
        </div>
      </div>
    }
  }

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10 mt-10">
        {errorMessage && <ErrorAlert description={errorMessage} />}
        {content}
      </div>
    </div>
  );
}
