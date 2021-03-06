import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PopupMenu from '../common/PopupMenu';
import aidToUuid from '../../util/aidToUuid';


const visibilityLabels = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
  FRIENDS: 'All friends',
  FOAF: 'Friends of friends',
  SERVERONLY: 'Local friends',
  AUTHOR: 'Private to group',
};


/* Header of a post.
 * Displays post info, and links to edit and delete if isOwnPost is set.
 *
 * TODO use actual icon for menu
 */
const PostHeader = ({
  author: { id, displayName },
  visibility,
  unlisted,
  isOwnPost,
  onEditClick,
  onDeleteClick,
}) => (
  <header className="post-header">
    <Link
      className="post-author"
      to={`/profile/${aidToUuid(id)}`}
    >
      <img className="avatar" alt={id} />
      <div className="author-name">{displayName}</div>
      {/* <div className="author-id">{id}</div> */}
    </Link>
    {
      (visibility && (visibility !== 'PUBLIC' || unlisted)) && (
        <div className="post-visibility">
          {visibilityLabels[visibility]}
          {unlisted && <span title="Unlisted"> *</span>}
        </div>
      )
    }
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
  visibility: PropTypes.oneOf([
    'PUBLIC',
    'PRIVATE',
    'FRIENDS',
    'FOAF',
    'AUTHOR',
    'SERVERONLY',
  ]),
  unlisted: PropTypes.bool,
  isOwnPost: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

PostHeader.defaultProps = {
  unlisted: false,
  visibility: undefined,
};

export default PostHeader;
