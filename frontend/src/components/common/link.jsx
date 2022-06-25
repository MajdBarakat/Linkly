import LinkEdit from "./linkEdit";

export default ({
  link,
  fetchedLink,
  isEditing,
  onEdit,
  onChange,
  onDelete,
  onSubmit,
  onDiscard,
  onToggleVisiblity,
  errors,
}) => {
  return (
    <div className="link-container" isediting={isEditing} order={link.order}>
      <h2>{fetchedLink.linkName}</h2>
      <button
        onClick={() => onToggleVisiblity(link)}
      >{`${link.isVisible}`}</button>
      <h2>{fetchedLink.linkURL}</h2>
      <button onClick={() => onEdit(link)}>Edit</button>
      <button onClick={() => onDelete(link)}>Delete</button>
      {link.isEditing ? (
        <LinkEdit
          link={link}
          fetchedLink={fetchedLink}
          onChange={onChange}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          errors={errors}
        />
      ) : (
        ""
      )}
    </div>
  );
};
