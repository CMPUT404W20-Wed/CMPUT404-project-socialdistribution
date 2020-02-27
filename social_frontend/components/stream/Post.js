import React from 'react';
import PropTypes from 'prop-types';
import ModalLink from '../modal/ModalLink';


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


/* Footer of a post.
 * Displays the comment count.
 * Clicking the footer links to the expanded view of the post.
 */
const PostFooter = ({ commentCount, postId }) => (
  <footer
    className={commentCount ? 'post-footer' : 'post-footer no-comments'}
  >
    <ModalLink to={`/post/${postId}`} hash="comments">
      {
        commentCount === 0
          ? 'No comments'
          : (
            commentCount.toLocaleString()
            + (commentCount !== 1 ? ' comments' : ' comment')
          )
      }
    </ModalLink>
  </footer>
);

PostFooter.propTypes = {
  commentCount: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired,
};


/* View for a post in the stream. (aka. unexpanded post)
 * Displays the post's content, and some basic information.
 * Clicking the post's footer links to the expanded view of the post.
 */
const Post = ({
  postId,
  author,
  content,
  commentCount,
}) => (
  // TODO Pasting the content directly into the HTML is not the
  // correct way to handle actual posts from the server!
  <article className="post">
    <PostHeader author={author} />
    <div className="content-text">
      {content}
    </div>
    <PostFooter
      postId={postId}
      commentCount={commentCount}
    />
  </article>
);

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
};

export default Post;
