export function NumberInput(props) {
  const {title, value, min, max, step, setValue} = props;
  return (
    <div>
      <label className="form-label" htmlFor="grid-url">
        {title}
      </label>
      <input
        className="form-input"
        value={value}
        id="grid-url"
        type="number"
        step={step}
        min={min}
        max={max}
        placeholder="https://github.com/acaudwell/Gource.git"
        onChange={e => {
          setValue(parseFloat(e.target.value));
          e.preventDefault();
        }}
      ></input>
    </div>
  );
}
