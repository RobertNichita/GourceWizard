import {Button} from '../components/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import {useEffect, useState} from 'react';
import {IVideoService, VideoService} from '../services/video_service';

export interface LoadingState {
  videoId: string;
}

export default function library() {
  const navigate = useNavigate();

  const location = useLocation();

  const videoService: IVideoService = new VideoService();

  useEffect(() => {
    const interval = setInterval(() => {
      const videoId = (location.state as LoadingState).videoId;
      videoService.getVideo(videoId).then(video => {
        console.log(`Got video ${JSON.stringify(video)}`);
        if (video.status === 'UPLOADED') {
          navigate('/video', {
            state: video,
          });
        } else if (video.status === 'FAILED') {
          console.error('Failed to render video!'); // TODO: sad path
        }
      });
    }, 1000 * 5); // TODO: Do we want to poll every second?

    return () => clearInterval(interval); // Th
  }, []);

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <p className="my-2 text-5xl">Rendering Video...</p>
          <p>This may take a while. Grab some popcorn.</p>
        </div>
      </div>
    </div>
  );
}
