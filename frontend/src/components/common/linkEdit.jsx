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

        {/* <button onClick={() => valuesChanged ? onDiscard(link, fetchedLink) : onClose()}>Cancel</button> */}
        <button
          onClick={(e) => onSubmit(e, link)}
          disabled={valuesChanged ? undefined : true}
        >
          Save
        </button>
        
      </form>
    </div>
  );
};
