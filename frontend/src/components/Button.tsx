export function Button(props) {
  const {title, className} = props;
  const newClassName = `${className} btn-blue margin`;
  return (
    <button onClick={props.onClick} className={newClassName} type="button">
      {title}
    </button>
  );
}
