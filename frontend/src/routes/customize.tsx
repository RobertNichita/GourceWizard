import {Button} from '../components/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {useState} from 'react';
import {IVideoService, VideoService} from '../services/video_service';
import {ErrorAlert} from '../components/alert/ErrorAlert';

export interface FormState {
  repoURL: string;
  visibility: string;
  title: string;
  description: string;
  hasWebhook: boolean;
}

export interface CustomizeState {
  hasWebhook: boolean;
}

export default function customize() {
  const videoService: IVideoService = new VideoService();

  const navigate = useNavigate();
  const location = useLocation();
  const previousState = location.state as FormState;

  const [repoURL] = previousState.repoURL
    ? useState(previousState.repoURL)
    : useState('');

  const [title] = previousState.title
    ? useState(previousState.title)
    : useState('');

  const [visibility] = previousState.visibility
    ? useState(previousState.visibility)
    : useState('Public');

  const [description] = previousState.description
    ? useState(previousState.description)
    : useState('');

  const [hasWebhook, setHasWebhook] = useState(previousState.hasWebhook);

  const [error, setError] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();
    if (!repoURL) {
      setError({
        title: 'Missing Repository URL',
        description: 'The Repository URL is required before continuing.',
      });
    } else if (!title) {
      setError({
        title: 'Missing Video Title',
        description: 'A Video Title is required before continuing.',
      });
    } else if (!visibility) {
      setError({
        title: 'Missing Video Visibility',
        description:
          'You must declare the visibility of the repository is required before continuing.',
      });
    } else {
      setError(null);
      videoService
        .createVideo('GOURCE', repoURL, title, description, hasWebhook)
        .then(video => {
          console.log(JSON.stringify(video));
          // Assume enqueued successfully
          navigate('/loading', {
            state: {
              videoId: video._id,
            },
          });
        })
        .catch(e => {
          console.warn('Failed to enqueue render job', e);
        });
    }
  };

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="relative flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <div className="absolute -top-1/4 w-3/4">
            {error && (
              <ErrorAlert
                title={error.title}
                description={error.description}
              ></ErrorAlert>
            )}
          </div>
          <p className="my-2 text-5xl">Customize.</p>

          {/* Form Design from: https://v1.tailwindcss.com/components/forms# */}
          <form className="w-full max-w-lg">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="flex justify-start items-center">
                  <input
                    type="checkbox"
                    checked={hasWebhook}
                    className="form-checkbox m-2"
                    onChange={e => {
                      setHasWebhook(e.target.checked);
                    }}
                  />
                  <label className="form-label text-center m-2">
                    Render on commit
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap m-2">
              <div className="w-full">
                <label className="form-label" htmlFor="grid-url">
                  Parameters
                </label>
                <p>Video customization is post-beta feature.</p>
                <textarea
                  className="form-input w-96 h-36 invisible"
                  id="grid-url"
                  placeholder="Enter a JSON object."
                ></textarea>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <Button
                className=""
                title="Back ⬅️"
                type="button"
                onClick={() => {
                  navigate('/create', {
                    state: {
                      repoURL: repoURL,
                      visibility: visibility,
                      title: title,
                      description: description,
                      hasWebhook: hasWebhook,
                    },
                  });
                }}
              ></Button>
              <Button
                className=""
                title="Render 🧪"
                onClick={e => {
                  handleSubmit(e);
                }}
              ></Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
