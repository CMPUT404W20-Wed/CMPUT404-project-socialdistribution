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


const PostFooter = ({ commentCount }) => {
  if (commentCount) {
    return (
      <footer className="post-footer">
        {commentCount.toLocaleString()}
        {commentCount > 1 ? ' comments' : ' comment'}
      </footer>
    );
  }

  return null;
};

PostFooter.propTypes = {
  commentCount: PropTypes.number.isRequired,
};


// TODO Pasting the content directly into the HTML is not the
// correct way to handle actual posts from the server!
const Post = ({ author, content, commentCount }) => (
  <article className="post">
    <PostHeader author={author} />
    <div className="content-text">
      {content}
    </div>
    <PostFooter commentCount={commentCount} />
  </article>
);

Post.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
};

export default Post;
