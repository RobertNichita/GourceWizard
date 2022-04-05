import {Button} from '../components/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import {useState} from 'react';
import {IVideoService, VideoService} from '../services/video_service';

export interface FormState {
  repoURL: string;
  visibility: string;
  title: string;
  description: string;
  webhookURL: string;
}

export default function customize() {
  const videoService: IVideoService = new VideoService();

  const navigate = useNavigate();
  const location = useLocation();
  const previousState = location.state as FormState;

  const [webhookURL, setWebhookURL] = previousState.webhookURL
    ? useState(previousState.webhookURL)
    : useState('');

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <p className="my-2 text-5xl">Customize.</p>

          <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
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

            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
                <label className="form-label" htmlFor="grid-url">
                  Webhook URL
                </label>
                <input
                  className="form-input"
                  id="grid-url"
                  value={webhookURL}
                  type="text"
                  placeholder="https://github.com/acaudwell/Gource"
                  onChange={e => {
                    e.preventDefault();
                    setWebhookURL(e.target.value);
                  }}
                ></input>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <Button
                className="-mx-0"
                title="Back ⬅️"
                type="button"
                onClick={() => {
                  const prevState = location.state as FormState;
                  prevState.webhookURL = webhookURL;
                  navigate('/create', {
                    state: prevState,
                  });
                }}
              ></Button>
              <Button
                className="-mx-0"
                title="Render 🧪"
                onClick={() => {
                  const payload = location.state as FormState; // TODO: This is just stuff passed from create but in the future we should be a bit better than this.
                  console.log(payload);
                  videoService
                    .createVideo(
                      'GOURCE',
                      payload.repoURL,
                      payload.title,
                      payload.description
                    )
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
                }}
              ></Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
