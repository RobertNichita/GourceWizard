import {Video} from './Video';

export function Videos(props) {
  const {items} = props;
  return (
    <div className="grid grid-cols-3">
      {items.length === 0 ? (
        <p className="text-center">No videos added yet, try adding some.</p>
      ) : (
        items.map((item, idx) => <Video key={`item-idx-${idx}`} data={item} />)
      )}
    </div>
  );
}
