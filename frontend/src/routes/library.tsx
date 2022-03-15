import {Button} from '../components/Button';
import {useNavigate} from 'react-router-dom';

export default function library() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="margin">🧙 Gource Wizard ✨</h1>

      <div className="flex h-screen items-center justify-center flex-col">
        <p className="margin text-center text-5xl">The Hidden Library.</p>

        <Button
          title="Wizards Tower 🧙"
          onClick={() => {
            navigate('/');
          }}
        ></Button>
      </div>
    </div>
  );
}
