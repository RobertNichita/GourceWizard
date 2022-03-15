export function Button(props) {
  const {title, className} = props;
  const newClassName = `${className} btn-blue margin`;
  console.log(newClassName);
  return (
    <button className={newClassName} type="button">
      {title}
    </button>
  );
}
