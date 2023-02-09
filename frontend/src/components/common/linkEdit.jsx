import Input from "./input";
import Textarea from "./textarea";

export default ({
  link,
  fetchedLink,
  onChange,
  onSubmit,
  onDiscard,
  errors,
  onClose,
  onDelete,
  onUpload
}) => {

  const renderInput = (name, label, value, onChange, errors, type = "text") => {
    return (
      <Input
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={errors[name]}
        id={link.id}
      />
    );
  }

  const renderTextarea = (name, label, value, onChange, errors, type = "text") => {
    return (
      <Textarea
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={errors[name]}
        id={link.id}
      />
    );
  }

  const valuesChanged = !(JSON.stringify(link) === JSON.stringify(fetchedLink));
  return (
    <div className="link-edit-container">
      <form className="container link-edit">
        {renderInput("linkName", "Name", link.linkName, onChange, errors)}
        {renderInput("linkURL", "URL", link.linkURL, onChange, errors)}
        {renderTextarea(
          "linkDescription",
          "Description",
          link.linkDescription,
          onChange,
          errors
        )}
        <div className="thumbnails-container">
          <div className="thumbnail"
            style={{ background: `url(${link.thumbnailURL})` }}
            onClick={() => onUpload( "thumbnail", link )} />
          <div className="banner"
            style={{ background: `url(${link.bannerURL})` }}
            onClick={() => onUpload( "banner", link )} />
        </div>

        <div className="bottom">
          <div className="left">
            <button
              type="button"
              onClick={() => onDelete(link)}
            >
              Delete</button>
          </div>
          <div className="right">
            <button
              className="save"
              onClick={(e) => onSubmit(e, link)}
              disabled={valuesChanged ? undefined : true}
            >
              Save
            </button>
            <button
              className="discard"
              type="button"
              onClick={() => valuesChanged ? onDiscard(link, fetchedLink) : onClose()}
            >
              {valuesChanged ? "Cancel" : "Close"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
