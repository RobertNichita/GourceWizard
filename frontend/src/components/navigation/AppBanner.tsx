import {useNavigate} from 'react-router-dom';

export function AppBanner(props) {
  const navigate = useNavigate();
  return (
    <button
      className="margin text-2xl text-black font-mono fixed top-0 left-0 m-5"
      onClick={() => navigate('/library')}
    >
      🧙 Gource Wizard ✨
    </button>
  );
}
