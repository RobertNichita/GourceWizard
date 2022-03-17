import {Button} from '../components/Button';
import {Videos} from '../components/video/Videos';
import {useNavigate} from 'react-router-dom';

export default function library() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="margin">🧙 Gource Wizard ✨</h1>
      <div className="relative">
        <Button
          className="fixed bottom-5 right-5 p-5 text-xl"
          title="Finish Brewing 🧪"
          onClick={() => {
            console.log('brewbrewbew');
          }}
        ></Button>
      </div>

      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <p className="margin text-center text-5xl">Potion Room.</p>

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
