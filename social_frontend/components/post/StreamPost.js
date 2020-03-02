import React from 'react';
import PropTypes from 'prop-types';
import ModalLink from '../modal/ModalLink';

import PostHeader from './PostHeader';

import './post.css';


/* Footer of a post.
 * Displays the comment count.
 * Clicking the footer links to the expanded view of the post.
 */
const StreamPostFooter = ({ commentCount, postId }) => (
  <footer
    className={commentCount ? 'post-footer' : 'post-footer no-comments'}
  >
    <ModalLink className="comments-link" to={`/post/${postId}`} hash="comments">
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

StreamPostFooter.propTypes = {
  commentCount: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired,
};


/* View for a post in the stream. (aka. unexpanded post)
 * Displays the post's content, and some basic information.
 * Clicking the post's footer links to the expanded view of the post.
 */
const StreamPost = ({
  postId,
  author,
  content,
  commentCount,
  isComment,
  isOwnPost,
}) => (
  // TODO Pasting the content directly into the HTML is not the
  // correct way to handle actual posts from the server!
  <article
    className={`post stream-post ${isComment ? 'comment' : ''} ${isOwnPost ? 'own' : ''}`}
  >
    <PostHeader author={author} isOwnPost={isOwnPost} />
    <div className="content-text">
      {content}
    </div>
    {
      isComment
        ? null
        : (
          <StreamPostFooter
            postId={postId}
            commentCount={commentCount}
          />
        )
    }
  </article>
);

StreamPost.propTypes = {
  postId: PropTypes.string.isRequired,
  author: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  content: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
  isComment: PropTypes.bool,
  isOwnPost: PropTypes.bool,
};

StreamPost.defaultProps = {
  isComment: false,
  isOwnPost: false,
};

export default StreamPost;
