import React from 'react';
import PropTypes from 'prop-types';


/* Header of a post.
 * Displays post info
 * (currently just author, but should also include other information)
 */
const PostHeader = ({ author }) => (
  <header className="post-header">
    <img className="avatar" alt={author} />
    <div className="author">{author}</div>
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.string.isRequired,
};

export default PostHeader;
