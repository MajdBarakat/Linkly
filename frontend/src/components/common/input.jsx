export default ({ name, label, value, onChange, onBlur, type, error }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
      ></input>
      {error && <div>{error}</div>}
    </div>
    //if error is truthy returns the div of errors
  );
};
