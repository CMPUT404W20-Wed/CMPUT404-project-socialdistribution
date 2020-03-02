import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


/* Header of a post.
 * Displays post info
 * (currently just author, but should also include other information)
 */
const PostHeader = ({ author: { id, displayName } }) => (
  <header>
    <Link
      className="post-header"
      to={`/profile/${id}`}
    >
      <img className="avatar" alt={id} />
      <div className="author">{displayName}</div>
      <div className="author-id">{id}</div>
    </Link>
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostHeader;
