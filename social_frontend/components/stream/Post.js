import React from 'react';
import PropTypes from 'prop-types';

const PostHeader = ({ author }) => (
  <header className="post-header">
    <div className="author">{author}</div>
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.string.isRequired,
};


const Post = ({ author, content }) => (
  <article className="post">
    <PostHeader author={author} />
    {content}
  </article>
);

Post.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Post;
