export default ({
  link,
  fetchedLink,
  onChange,
  onSubmit,
  onDiscard,
  errors,
}) => {
  //
  const renderInput = (name, label, value, onChange, errors, type = "text") => {
    return (
      <div id={link.id} className="input-container link-edit">
        <label>{label}</label>
        <input
          name={name}
          value={value}
          type={type}
          onChange={onChange}
        ></input>
        {errors[name] && (
          <div className="under-text-container">
            <div className="text-error">{errors[name]}</div>
          </div>
        )}
      </div>
    );
  };

  const valuesChanged = !(JSON.stringify(link) === JSON.stringify(fetchedLink));
  return (
    <div className="link-edit-container">
      <form className="container link-edit">
        {renderInput("linkName", "Name", link.linkName, onChange, errors)}
        {renderInput("linkURL", "URL", link.linkURL, onChange, errors)}
        {renderInput(
          "linkDescription",
          "Description",
          link.linkDescription,
          onChange,
          errors
        )}

        <button
          onClick={(e) => onSubmit(e, link)}
          disabled={valuesChanged ? undefined : true}
        >
          Save
        </button>
        {valuesChanged ? (
          <button onClick={() => onDiscard(link, fetchedLink)}>Cancel</button>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};
