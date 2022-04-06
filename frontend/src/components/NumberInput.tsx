export function NumberInput(props) {
  const {title, value, min, max, step, setValue} = props;
  return (
    <div>
      {/* <div className="flex flex-wrap -mx-3">
        <div className="w-full px-3"> */}
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
          console.log(e.target.value);
          setValue(e.target.value);
          e.preventDefault();
        }}
      ></input>
    </div>
    //   </div>
    // </div>
  );
}
