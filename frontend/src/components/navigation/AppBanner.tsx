import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import frontEndConfig from '../../config';
import {ErrorAlert} from '../alert/ErrorAlert';
import {createGlobalState} from 'react-hooks-global-state';

const error: {title: string | undefined; description: string | undefined} = {
  title: undefined,
  description: undefined,
};

const {useGlobalState, getGlobalState, setGlobalState} = createGlobalState({
  error: error,
});

export function AppBanner() {
  const navigate = useNavigate();
  const [error, setError] = useGlobalState('error');

  return (
    <div>
      <button
        className="margin text-2xl text-black font-mono fixed top-0 left-0 m-5 z-40"
        onClick={() => navigate('/library')}
      >
        🧙 Gource Wizard ✨
      </button>
      <div className="fixed mt-5 top-0 left-0 w-screen pl-96 pr-96 h-max">
        <div className="ml-auto mr-auto w-96">
          {error.title && (
            <ErrorAlert
              title={error.title}
              description={error.description}
            ></ErrorAlert>
          )}
        </div>
      </div>
      <button
        className="btn-blue bg-gource-red margin font-mono fixed top-0 right-0 m-5 z-40"
        onClick={() =>
          axios
            .post(
              `${frontEndConfig.url}/api/auth/signout`,
              {},
              {withCredentials: true}
            )
            .then(response => {
              window.location.href = frontEndConfig.url;
            })
        }
      >
        logout
      </button>
    </div>
  );
}
export {
  useGlobalState as useError,
  getGlobalState as getError,
  setGlobalState as setError,
};
