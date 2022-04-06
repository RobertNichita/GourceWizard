import {useNavigate} from 'react-router-dom';

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
        onClick={() => console.log('there is no escape')}
      >
        logout
      </button>
    </div>
  );
}
