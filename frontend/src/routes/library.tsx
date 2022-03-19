import {Button} from '../components/Button';
import {Videos} from '../components/video/Videos';
import {AppBanner} from '../components/navigation/AppBanner';
import {useNavigate} from 'react-router-dom';

export default function library() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
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
          className="text-center bg-g"
          items={[
            {
              title: 'Mulan',
              description:
                'Mulan is a responsible young woman, seen as a fearless warrior, leader, and beloved role model among her people, both men, and women.',
              createdAt: 'March 9, 2020',
            },
            {
              title: 'Alladin',
              description:
                'Aladdin is a 2019 American musical fantasy film produced by Walt Disney Pictures.',
              createdAt: 'May 4, 1992',
            },
            {
              title: 'Encanto',
              description:
                'Encanto tells the tale of an extraordinary family, the Madrigals, who live hidden in the mountains of Colombia.',
              createdAt: 'November 24, 2021',
            },
            {
              title: 'Atlantis',
              description:
                'A young linguist named Milo Thatch joins an intrepid group of explorers to find the mysterious lost continent of Atlantis.',
              createdAt: 'June 3, 2001',
            },
            {
              title: 'Beauty and the Beast',
              description:
                'Beauty and the Beast is a 2017 American musical romantic fantasy film directed by Bill Condon from a screenplay by Stephen Chbosky and Evan Spiliotopoulos.',
              createdAt: 'September 29, 1991',
            },
          ]}
        ></Videos>

        <div className="flex items-center">
          <Button
            title="Previous"
            className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-400 hover:text-white"
            onClick={() => {
              navigate('/library');
            }}
          ></Button>
          <p className="px-10 py-2 text-gray-700 bg-gray-200 rounded-md font-mono">
            1
          </p>
          <Button
            title="Next"
            className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-400 hover:text-white"
            onClick={() => {
              navigate('/library');
            }}
          ></Button>
        </div>
      </div>
    </div>
  );
}
