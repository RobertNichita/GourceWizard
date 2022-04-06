export function Button(props) {
  const {title, className, disabled} = props;
  const newClassName = `${className} btn-blue margin`;
  return (
    <button
      onClick={props.onClick}
      disabled={disabled}
      className={newClassName}
      type="button"
    >
      {title}
    </button>
  );
}
