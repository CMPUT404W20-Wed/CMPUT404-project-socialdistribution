import React from 'react';
import PropTypes from 'prop-types';

const PostHeader = ({ author }) => (
  <header className="post-header">
    <img className="avatar" alt={author} />
    <div className="author">{author}</div>
  </header>
);

PostHeader.propTypes = {
  author: PropTypes.string.isRequired,
};


// TODO Pasting the content directly into the HTML is not the
// correct way to handle actual posts from the server!
const Post = ({ author, content }) => (
  <article className="post">
    <PostHeader author={author} />
    <div className="content-text">
      {content}
    </div>
  </article>
);

Post.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Post;
