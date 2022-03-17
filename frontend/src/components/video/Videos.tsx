import {Video} from './Video';

export function Videos(props) {
  const {items} = props;
  return (
    <div className="grid grid-cols-3">
      {items.length === 0 ? (
        <h2>No videos added yet, try adding some.</h2>
      ) : (
        items.map((item, idx) => <Video key={`item-idx-${idx}`} data={item} />)
      )}
    </div>
  );
}
