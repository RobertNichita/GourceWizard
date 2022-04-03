import {useLocation} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import {Video} from '../services/video_service';
import ReactPlayer from 'react-player'

export default function library() {
  const location = useLocation();
  const {title, description, createdAt, thumbnail, url} =
    location.state as Video;

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10 mt-10">
        <div className="relative">
          <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-start items-end">
              <p className="mr-2 text-5xl">{title}</p>
              <p className="mx-2 text-gray-500 text-2xl">
                {new Date(parseInt(createdAt)).toLocaleString()}
              </p>
            </div>
            <a data-mdb-ripple="true" data-mdb-ripple-color="light">
              <ReactPlayer
                playsinline={true}
                controls={true}
                light={thumbnail}
                url={url}
                />
            </a>
            <div className="mt-5 max-w-fit">
              <p className="text-base mb-4 ">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
