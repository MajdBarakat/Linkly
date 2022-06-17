export default ({
  name,
  label,
  onChange,
  onBlur,
  error,
  defaultValue,
  options,
}) => {
  return (
    <div>
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
