import {Button} from '../components/Button';
import {Videos} from '../components/video/Videos';
import {AppBanner} from '../components/navigation/AppBanner';
import {
  IVideoService,
  VideoService,
  VideoVisibility,
} from '../services/video_service';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import DotLoader from 'react-spinners/DotLoader';

export default function library() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [nextButton, setNextButton] = useState(false);
  const [backButton, setBackButton] = useState(false);
  const [busy, setBusy] = useState(true);
  const videoService: IVideoService = new VideoService();

  const updatePage = page => {
    videoService.getVideos(page).then(videoPage => {
      setBusy(false);
      setVideos(videoPage.videos);
      if (page === 0) {
        setBackButton(true);
      } else {
        setBackButton(false);
      }
      if (videoPage.next) {
        setNextButton(false);
      } else {
        setNextButton(true);
      }
    });
  };

  const updateLibraryPage = () => {
    updatePage(page);
  };

  // Load videos
  useEffect(() => {
    console.log('Loading library videos');
    updatePage(page);
  }, [page]);

  return (
    <div className="p-20">
      <div className="relative">
        <AppBanner></AppBanner>
        <Button
          className="fixed bottom-5 right-5 p-5 text-xl z-50"
          title="Visualize 🧪"
          onClick={() => {
            // Pass State
            navigate('/create', {
              state: {
                repoURL: '',
                visibility: VideoVisibility.public,
                title: '',
                description: '',
                hasWebhook: false,
                displayLegend: false,
                elasticity: 1.0,
                bloomMult: 1.0,
                bloomInt: 1.0,
                start: 0,
                stop: 1.0,
              },
            });
          }}
        ></Button>
      </div>

      <div className="flex items-center justify-center flex-col mx-10 h-full">
        <p className="margin text-center text-5xl">Library.</p>

        {busy ? (
          <div className="relative h-screen">
            <div className="absolute top-1/3 right-1/2">
              <DotLoader size={45} />
            </div>
          </div>
        ) : (
          <div>
            <Videos
              className="text-center bg-g"
              items={videos}
              update={updateLibraryPage}
            ></Videos>

            <div className="flex items-center justify-center">
              <Button
                title="Previous"
                disabled={backButton}
                className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-400 hover:text-white"
                onClick={() => {
                  setPage(page => {
                    return page - 1;
                  });
                }}
              ></Button>
              <p className="px-10 py-2 text-gray-700 bg-gray-200 rounded-md font-mono">
                {page + 1}
              </p>
              <Button
                title="Next"
                disabled={nextButton}
                className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-400 hover:text-white"
                onClick={() => {
                  setPage(page => {
                    return page + 1;
                  });
                }}
              ></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
