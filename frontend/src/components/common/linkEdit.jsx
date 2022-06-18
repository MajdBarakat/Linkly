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
      <div id={link.id}>
        <label>{label}</label>
        <input
          name={name}
          value={value}
          type={type}
          onChange={onChange}
        ></input>
        {errors && <div>{errors[name]}</div>}
      </div>
    );
  };

  const valuesChanged = !(JSON.stringify(link) === JSON.stringify(fetchedLink));
  return (
    <form>
      {renderInput("order", "Order", link.order, onChange, errors, "number")}
      {renderInput("linkName", "Name", link.linkName, onChange, errors)}
      {renderInput("linkURL", "URL", link.linkURL, onChange, errors)}
      {renderInput(
        "linkDescription",
        "Description",
        link.linkDescription,
        onChange,
        errors
      )}
      {renderInput(
        "linkPictureURL",
        "Picture",
        link.linkPictureURL,
        onChange,
        errors
      )}
      {renderInput(
        "linkThumbnailURL",
        "Thumbnail",
        link.linkThumbnailURL,
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
  );
};
