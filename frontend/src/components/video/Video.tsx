import {Button} from '../Button';
import {useNavigate} from 'react-router-dom';
import {useLayoutEffect} from 'react';
export function Video(props) {
  const navigate = useNavigate();
  const {data} = props;
  const {title, description, createdAt, thumbnail, status, _id} = data;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="flex justify-center m-2 hover:opacity-75">
      <div
        className="relative rounded-lg shadow-lg bg-white max-w-md max-h-min"
        onClick={() => {
          if (status === 'UPLOADED') {
            navigate(`/video/${data._id}`, {state: data});
          } else if (status === 'ENQUEUED') {
            navigate('/loading', {
              state: {
                videoId: _id,
              },
            });
          } else if (status === 'FAILED') {
            navigate('/video/failed');
          } else if (status === 'TIMEOUT') {
            navigate('/video/timeout');
          }
        }}
      >
        <div className="overflow-hidden max-h-96">
          <a data-mdb-ripple="true" data-mdb-ripple-color="light">
            <img className="rounded-t-lg" src={thumbnail} />
          </a>
        </div>
        <div className="p-6">
          <div className="flex justify-start items-end mb-2">
            <h1 className="text-black text-xl font-medium mr-2">{title}</h1>
            <p className="text-gray-500 text-sm pb-0.5">
              {new Date(parseInt(createdAt)).toLocaleString()}
            </p>
          </div>
          <p className="text-base mb-4`">{description}</p>
          <div>
            <Button
              className="absolute top-1 right-1 m-0 p-0 text-lg bg-transparent hover:bg-transparent"
              title="❌"
              onClick={e => {
                console.log('TODO');
                e.stopPropagation();
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
