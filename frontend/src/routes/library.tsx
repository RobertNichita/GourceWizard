import {Button} from '../components/Button';
import {Videos} from '../components/video/Videos';
import {AppBanner} from '../components/navigation/AppBanner';
import {useNavigate} from 'react-router-dom';

export default function library() {
  const navigate = useNavigate();
  return (
    <div>
      <AppBanner></AppBanner>
      <div className="relative">
        <Button
          className="fixed bottom-5 right-5 p-5 text-xl"
          title="Potion Brewing 🧪"
          onClick={() => {
            navigate('/create');
          }}
        ></Button>
      </div>

      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <p className="margin text-center text-5xl">The Hidden Library.</p>

        <Videos
          className="text-center"
          items={[
            {content: 'Mulan'},
            {content: 'Alladin'},
            {content: 'Encanto'},
            {content: 'Atlantis'},
            {content: 'Beauty and the Beast'},
          ]}
        ></Videos>
      </div>
    </div>
  );
}
