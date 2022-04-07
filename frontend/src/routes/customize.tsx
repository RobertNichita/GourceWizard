import {Button} from '../components/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {useState} from 'react';
import {IVideoService, VideoService} from '../services/video_service';
import {ErrorAlert} from '../components/alert/ErrorAlert';
import {NumberInput} from '../components/NumberInput';
import {VideoVisibility} from '../services/video_service';

export interface FormState {
  repoURL: string;
  visibility: VideoVisibility;
  title: string;
  description: string;
  hasWebhook: boolean;
  displayLegend: boolean;
  elasticity: number;
  bloomMult: number;
  bloomInt: number;
  start: number;
  stop: number;
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
    : useState(VideoVisibility.public);
  const [description] = previousState.description
    ? useState(previousState.description)
    : useState('');
  const [hasWebhook, setHasWebhook] = useState(previousState.hasWebhook);
  const [displayLegend, setDisplayLegend] = useState(
    previousState.displayLegend
  );
  const [elasticity, setElasticity] = previousState.elasticity
    ? useState(previousState.elasticity)
    : useState(1.0);
  const [bloomMult, setBloomMult] = previousState.bloomMult
    ? useState(previousState.bloomMult)
    : useState(1.0);
  const [bloomInt, setBloomInt] = previousState.bloomInt
    ? useState(previousState.bloomInt)
    : useState(1.0);
  const [start, setStart] = previousState.start
    ? useState(previousState.start)
    : useState(0);
  const [stop, setStop] = previousState.stop
    ? useState(previousState.stop)
    : useState(1.0);
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
    } else if (elasticity > 3 || elasticity < 0.5) {
      setError({
        title: 'Invalid Elasticity',
        description: 'Elasticity must be greater than 0.5, and less than 3.0.',
      });
    } else if (bloomMult > 1.5 || bloomMult < 0.5) {
      setError({
        title: 'Invalid Bloom Multiplier',
        description:
          'Bloom Multiplier must be greater than 0.5, and less than 1.5.',
      });
    } else if (bloomInt > 1.5 || bloomInt < 0.5) {
      setError({
        title: 'Invalid Bloom Intensity',
        description:
          'Bloom Intensity must be greater than 0.5, and less than 1.5.',
      });
    } else if (start > 1.0 || start < 0) {
      setError({
        title: 'Invalid Start Time',
        description: 'Start Time must be greater than 0.0, and less than 1.0.',
      });
    } else if (stop > 1.0 || stop < 0) {
      setError({
        title: 'Invalid Stop Time',
        description: 'Stop Time must be greater than 0.0, and less than 1.0.',
      });
    } else if (start >= stop) {
      setError({
        title: 'Invalid Time Range',
        description: 'Start Time cannot be equal or past Stop Time.',
      });
    } else {
      setError(null);
      const renderOptions = {
        bloomIntensity: bloomInt,
        bloomMultiplier: bloomMult,
        elasticity: elasticity,
        key: displayLegend,
        start: start,
        stop: stop,
        title: title,
      };

      videoService
        .createVideo(
          'GOURCE',
          repoURL,
          title,
          description,
          hasWebhook,
          visibility,
          renderOptions
        )
        .then(video => {
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
              <label className="form-label text-xl m-2" htmlFor="grid-url">
                TOGGLES
              </label>
              <div className="flex w-full">
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
                <div className="flex justify-start items-center">
                  <input
                    type="checkbox"
                    checked={displayLegend}
                    className="form-checkbox m-2"
                    onChange={e => {
                      setDisplayLegend(e.target.checked);
                    }}
                  />
                  <label className="form-label text-center m-2">
                    Display Legend
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full"></div>
            </div>

            <div className="flex flex-wrap m-2">
              <div className="w-full">
                <label className="form-label text-xl" htmlFor="grid-url">
                  Values
                </label>
                <div className="flex flex-row items-end">
                  <div className="mr-2 mt-2 mb-2 flex-1">
                    <NumberInput
                      value={elasticity}
                      step="0.1"
                      min="0.5"
                      max="3.0"
                      title="Elasticity"
                      setValue={setElasticity}
                    ></NumberInput>
                  </div>
                  <div className="m-2 flex-1">
                    <NumberInput
                      value={bloomMult}
                      step="0.1"
                      min="0.5"
                      max="1.5"
                      title="Bloom Multiplier"
                      setValue={setBloomMult}
                    ></NumberInput>
                  </div>
                  <div className="m-2 flex-1">
                    <NumberInput
                      value={bloomInt}
                      step="0.1"
                      min="0.5"
                      max="1.5"
                      title="Bloom Intensity"
                      setValue={setBloomInt}
                    ></NumberInput>
                  </div>
                </div>

                <div className="flex flex-row items-end">
                  <div className="mr-2 mt-2 mb-2 flex-1">
                    <NumberInput
                      value={start}
                      step="0.1"
                      min="0"
                      max="1.0"
                      title="Start (min 0.0)"
                      setValue={setStart}
                    ></NumberInput>
                  </div>
                  <div className="m-2 flex-1">
                    <NumberInput
                      value={stop}
                      step="0.1"
                      min="0"
                      max="1.0"
                      title="Stop (max 1.0)"
                      setValue={setStop}
                    ></NumberInput>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <Button
                className=""
                title="Back ⬅️"
                type="button"
                onClick={() => {
                  // Pass State
                  const args = {
                    repoURL: repoURL,
                    visibility: visibility,
                    title: title,
                    description: description,
                    hasWebhook: hasWebhook,
                    displayLegend: displayLegend,
                    elasticity: elasticity,
                    bloomMult: bloomMult,
                    bloomInt: bloomInt,
                    start: start,
                    stop: stop,
                  };

                  navigate('/create', {
                    state: args,
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
