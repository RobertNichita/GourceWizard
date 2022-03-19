import {Button} from '../components/Button';
import {useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';

export default function library() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
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
                <textarea
                  className="form-input w-96 h-36"
                  id="grid-url"
                  placeholder="Enter a JSON object."
                ></textarea>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <Button
                className="-mx-0"
                title="Render 🧪"
                onClick={() => {
                  navigate('/library');
                }}
              ></Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
