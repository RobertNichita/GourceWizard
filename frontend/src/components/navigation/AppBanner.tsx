import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import frontEndConfig from '../../config';

export function AppBanner() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="margin text-2xl text-black font-mono fixed top-0 left-0 m-5 z-40"
        onClick={() => navigate('/library')}
      >
        🧙 Gource Wizard ✨
      </button>
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
