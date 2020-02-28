import React from 'react';
import PropTypes from 'prop-types';


/* Header of a post.
 * Displays post info
 * (currently just author, but should also include other information)
 */
const PostHeader = ({ author: { id, displayName } }) => (
  <header className="post-header">
    <img className="avatar" alt={id} />
    <div className="author">{displayName}</div>
    <div className="author-id">{id}</div>
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostHeader;
