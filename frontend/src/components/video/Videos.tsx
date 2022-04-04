import {Video} from './Video';

export function Videos(props) {
  const {items} = props;
  if (items.length === 0) {
    return (
      <div>
        <p className="text-center w-full">
          No videos added yet, try adding some.
        </p>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-3">
        {items.map((item, idx) => (
          <Video key={`item-idx-${idx}`} data={item} />
        ))}
      </div>
    );
  }
}
