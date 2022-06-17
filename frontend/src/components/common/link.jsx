export default ({
  id,
  order,
  name,
  isVisible,
  linkURL,
  linkPictureURL,
  linkThumbnailURL,
  linkDescription,
  onEdit,
  onDelete,
}) => {
  return (
    <div order={order}>
      <button>{`${isVisible}`}</button>
      <h1>{name}</h1>
      <h2>{linkURL}</h2>
      <button onClick={onEdit}>Edit</button>
      <button onClick={() => onDelete(id, order)}>Delete</button>
    </div>
  );
};
