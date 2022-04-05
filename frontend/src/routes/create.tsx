import {Button} from '../components/Button';
import {useNavigate} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';
import {ErrorAlert} from '../components/alert/ErrorAlert';
import {useState} from 'react';

export default function library() {
  const navigate = useNavigate();

  const [repoURL, setRepoURL] = useState('');
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [description, setDescription] = useState('');
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
      navigate('/customize', {
        state: {
          repoURL: repoURL,
          visibility: visibility,
          title: title,
          description: description,
        },
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
          <p className="my-2 text-5xl">Potion Room</p>

          <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
                <label className="form-label" htmlFor="grid-url">
                  Repository URL
                </label>
                <input
                  className="form-input"
                  id="grid-url"
                  type="text"
                  placeholder="https://github.com/acaudwell/Gource.git"
                  onChange={e => {
                    e.preventDefault();
                    setRepoURL(e.target.value);
                  }}
                ></input>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="form-label" htmlFor="grid-title">
                  Title
                </label>
                <input
                  className="form-input"
                  id="grid-city"
                  type="title"
                  placeholder="Video Title"
                  onChange={e => {
                    e.preventDefault();
                    setTitle(e.target.value);
                  }}
                ></input>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="form-label" htmlFor="grid-state">
                  Visibility
                </label>
                <div className="relative">
                  <select
                    className="form-input"
                    id="grid-state"
                    onChange={e => {
                      e.preventDefault();
                      setVisibility(e.target.value);
                    }}
                  >
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
                <label className="form-label" htmlFor="grid-url">
                  Description
                </label>
                <textarea
                  className="form-input"
                  id="grid-url"
                  placeholder="Describe the repository a little."
                  onChange={e => {
                    e.preventDefault();
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <Button
                className="-mx-0"
                title="Back 📖"
                type="button"
                onClick={() => {
                  navigate('/library');
                }}
              ></Button>
              <Button
                className="-mx-0"
                type="submit"
                title="Next Step ➡️"
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
