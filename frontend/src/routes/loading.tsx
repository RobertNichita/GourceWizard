import {useLocation, useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import {useEffect} from 'react';
import {IVideoService, VideoService} from '../services/video_service';
import DotLoader from 'react-spinners/DotLoader';

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
        if (video.status === 'UPLOADED') {
          navigate(`/video/${video._id}`, {
            state: video,
          });
        } else if (video.status === 'FAILED') {
          navigate('/video/failed', {
            state: video,
          });
        } else if (video.status === 'TIMEOUT') {
          navigate('/video/timeout', {
            state: video,
          });
        }
      });
    }, 1000);

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
          <p className="my-2 text-5xl text-center w-full">Rendering Video</p>
          <div className="flex justify-center content-center w-full p-10">
            <DotLoader size={45} />
          </div>
          <p className="p-10">This may take a while. Go grab some popcorn.</p>
        </div>
      </div>
    </div>
  );
}
