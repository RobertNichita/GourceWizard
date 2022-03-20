import {Button} from '../components/Button';
import {Videos} from '../components/video/Videos';
import {AppBanner} from '../components/navigation/AppBanner';
import {useNavigate} from 'react-router-dom';

export default function library() {
  const navigate = useNavigate();
  return (
    <div className="p-20">
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

      <div className="flex items-center justify-center flex-col mx-10">
        <p className="margin text-center text-5xl">The Hidden Library.</p>

        <Videos
          className="text-center bg-g"
          items={[
            {
              title: 'Mulan',
              description:
                'Mulan is a responsible young woman, seen as a fearless warrior, leader, and beloved role model among her people, both men, and women.',
              createdAt: 'March 9, 2020',
              thumbnail:
                'https://imgix.bustle.com/uploads/image/2020/2/26/76316f92-c732-47cf-8f6d-e63dba5877c2-1601055a.jpg?w=1200&h=630&fit=crop&crop=faces&fm=jpg',
            },
            {
              title: 'Aladdin',
              description:
                'Aladdin is a 2019 American musical fantasy film produced by Walt Disney Pictures.',
              createdAt: 'May 4, 1992',
              thumbnail:
                'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/F8E06B89CCFCCB4660AC6EC26D4A7CC8BEBA67D9595B4197A5AEC5DCA188F4BE/scale?width=1200&aspectRatio=1.78&format=jpeg',
            },
            {
              title: 'Atlantis',
              description:
                'A young linguist named Milo Thatch joins an intrepid group of explorers to find the mysterious lost continent of Atlantis.',
              createdAt: 'June 3, 2001',
              thumbnail:
                'https://thedisinsider.com/wp-content/uploads/2020/05/85E52E97-8540-44CB-8D7D-A173CD92F1BD.jpeg',
            },
            {
              title: 'Beauty and the Beast',
              description:
                'Beauty and the Beast is a 2017 American musical romantic fantasy film directed by Bill Condon from a screenplay by Stephen Chbosky and Evan Spiliotopoulos.',
              createdAt: 'September 29, 1991',
              thumbnail:
                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4de7856b-9425-4b91-b489-4bff9b1a8658/dbeifzj-7e5a441c-352a-4d89-9026-7773909cfd24.jpg/v1/fill/w_1024,h_693,q_75,strp/commission__beauty_and_the_bat_by_raizel_v_dbeifzj-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzRkZTc4NTZiLTk0MjUtNGI5MS1iNDg5LTRiZmY5YjFhODY1OFwvZGJlaWZ6ai03ZTVhNDQxYy0zNTJhLTRkODktOTAyNi03NzczOTA5Y2ZkMjQuanBnIiwiaGVpZ2h0IjoiPD02OTMiLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiJcL3dtXC80ZGU3ODU2Yi05NDI1LTRiOTEtYjQ4OS00YmZmOWIxYTg2NThcL3JhaXplbC12LTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.MRsolrHlsxH2IWAfw4I-1YBvi_RUssvtBaP_QDOdzF8',
            },
            {
              title: 'Encanto',
              description:
                'Encanto tells the tale of an extraordinary family, the Madrigals, who live hidden in the mountains of Colombia.',
              createdAt: 'November 24, 2021',
              thumbnail:
                'https://lumiere-a.akamaihd.net/v1/images/p_encanto_homeent_22359_4892ae1c.jpeg',
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
