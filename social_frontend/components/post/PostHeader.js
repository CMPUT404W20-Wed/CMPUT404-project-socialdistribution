import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PopupMenu from '../common/PopupMenu';


/* Header of a post.
 * Displays post info, and links to edit and delete if isOwnPost is set.
 *
 * TODO use actual icon for menu
 */
const PostHeader = ({
  author: { id, displayName },
  isOwnPost,
  onEditClick,
  onDeleteClick,
}) => (
  <header className="post-header">
    <Link
      className="post-author"
      to={`/profile/${id}`}
    >
      <img className="avatar" alt={id} />
      <div className="author-name">{displayName}</div>
      {/* <div className="author-id">{id}</div> */}
    </Link>
    {
      isOwnPost && (
        <PopupMenu className="post-menu" handle="⁝">
          <button
            type="button"
            className="post-edit-button"
            onClick={(event) => { event.target.blur(); onEditClick(); }}
          >
            Edit
          </button>
          <button
            type="button"
            className="post-delete-button popup-red-button"
            onClick={onDeleteClick}
          >
            Delete
          </button>
        </PopupMenu>
      )
    }
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  isOwnPost: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default PostHeader;
