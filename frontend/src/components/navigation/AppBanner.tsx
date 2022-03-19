import {useNavigate} from 'react-router-dom';

export function AppBanner(props) {
  const navigate = useNavigate();
  return (
    <button
      className="margin text-2xl text-gource-blue1 font-mono"
      onClick={() => navigate('/')}
    >
      🧙 Gource Wizard ✨
    </button>
  );
}
