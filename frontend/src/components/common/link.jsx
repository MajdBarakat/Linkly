import { PencilAltIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";

export default ({ link, fetchedLink, onEdit, onDelete, onToggleVisiblity }) => {
  return (
    <div className="link-container">
      <div className="top">
        <div className="left">
          <h1>{fetchedLink.linkName}</h1>
          <PencilAltIcon onClick={() => onEdit(link)}>Edit</PencilAltIcon>
        </div>
        <div className="right">
          <button
            onClick={() => onToggleVisiblity(link)}
          >{`${link.isVisible}`}</button>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <h2>{fetchedLink.linkURL}</h2>
          <div className="banner" />
        </div>
        <div className="right">
          <TrashIcon onClick={() => onDelete(link)}>Delete</TrashIcon>
        </div>
      </div>
    </div>
  );
};
