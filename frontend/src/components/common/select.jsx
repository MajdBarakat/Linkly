export default ({
  name,
  label,
  onChange,
  onBlur,
  error,
  defaultValue,
  options,
  id,
  className,
}) => {
  return (
    <div id={id} className={"select-container" + (className ? className : "")}>
      <label>{label}</label>
      <select
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
        disabled={error ? true : false}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div>{error}</div>}
    </div>
  );
};
