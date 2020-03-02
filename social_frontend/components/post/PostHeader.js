import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PopupMenu from '../menu/PopupMenu';


/* Header of a post.
 * Displays post info
 * (currently just author, but should also include other information)
 */
const PostHeader = ({ author: { id, displayName }, isOwnPost }) => (
  <header className="post-header">
    <Link
      className="post-author"
      to={`/profile/${id}`}
    >
      <img className="avatar" alt={id} />
      <div className="author-name">{displayName}</div>
      <div className="author-id">{id}</div>
    </Link>
    {
      isOwnPost
        ? (
          <PopupMenu className="post-menu" handle=":">
            <button type="button" className="post-edit-button">Edit</button>
            <button type="button" className="post-delete-button">Delete</button>
          </PopupMenu>
        )
        : null
    }
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  isOwnPost: PropTypes.bool.isRequired,
};

export default PostHeader;
