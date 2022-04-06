import {Video} from './Video';

export function Videos(props) {
  const {items, deleteVideo} = props;
  if (items.length === 0) {
    return (
      <div className="py-20 m-5">
        <p className="text-center w-full">
          No videos added yet, try adding some.
        </p>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-3">
        {items.map((item, idx) => (
          <Video
            key={`item-idx-${idx}`}
            data={item}
            deleteThis={() => deleteVideo(idx)}
          />
        ))}
      </div>
    );
  }
}
