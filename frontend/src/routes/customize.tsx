import {Button} from '../components/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import { useState } from 'react';
import {IVideoService, MockVideoService} from '../services/video_service';

export interface CreateVideoState {
  repoURL: string
  visibility: string
  title: string
  description: string
}

export default function library() {
  const navigate = useNavigate();

  const location = useLocation()

  const videoService: IVideoService = new MockVideoService();

  

  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <p className="my-2 text-5xl">Customize.</p>

          {/* Form Design from: https://v1.tailwindcss.com/components/forms# */}
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
                  type="text"
                  placeholder="https://github.com/acaudwell/Gource"
                ></input>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <Button
                className="-mx-0"
                title="Render 🧪"
                onClick={() => {
                  const payload = location.state as CreateVideoState; // TODO: This is just stuff passed from create but in the future we should be a bit better than this.
                  console.log(payload);
                  videoService.createVideo('GOURCE', payload.repoURL, payload.title, payload.description).then((video) => {
                    // Assume enqueued successfully
                    navigate('/loading', {
                      state: {
                        videoId: video._id
                      }
                    });
                  }).catch((e) => {
                    console.warn(`Failed to enqueue render job`,e);
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
