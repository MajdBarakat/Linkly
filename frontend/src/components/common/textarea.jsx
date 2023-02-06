export default ({
    name,
    label,
    value,
    onChange,
    onBlur,
    type,
    placeholder,
    help,
    error,
    id,
    className,  
  }) => {
    return (
      <div id={id} className={"input-container" + (className ? className : "")}>
        <label>{label}</label>
        <textarea
          className={error ? "error" : undefined}
          name={name}
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        ></textarea>
        {error || help ? (
          <div className="under-text-container">
            <div className="text-error">{error ? error : ""}</div>
            {help && (
              <div className="text-help">
                {help.text}
                <a href={help.href}>{help.label}</a>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      //if error is truthy returns the div of errors
    );
  };