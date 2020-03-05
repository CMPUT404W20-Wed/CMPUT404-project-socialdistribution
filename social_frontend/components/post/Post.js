import React from 'react';
import PropTypes from 'prop-types';
import ModalLink from '../modal/ModalLink';

import PostHeader from './PostHeader';
import Stream from '../stream/Stream';
import PostForm from '../postform/PostForm';
import { userShape, postShape } from '../shapes';

import './post.css';


/* Footer containing post comments. */
const PostComments = ({ /* postId, */ sessionUser }) => {
  const Comment = ({ post }) => (
    <Post type="comment" sessionUser={sessionUser} post={post} />
  );

  Comment.propTypes = { post: postShape.isRequired };

  return (
    <div className="post-footer">
      <Stream PostComponent={Comment} />
      <PostForm isComment />
    </div>
  );
};

PostComments.propTypes = {
  /* postId: PropTypes.string.isRequired, */
  sessionUser: userShape.isRequired,
};


/* Footer displaying comment count.
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


/* General view of a post.
 *
 * type prop controls the appearance and footer content:
 * 'standalone' => comments in footer
 *     'stream' => link to expand post in footer
 *    'comment' => no footer
 */
const Post = ({
  post: {
    id: postId,
    author,
    content,
    commentCount,
  },
  type,
  sessionUser,
}) => {
  const { id: sessionUserId } = sessionUser;
  const { id: authorId } = author;
  const isOwnPost = (authorId === sessionUserId);

  let footer;
  let className;
  if (type === 'standalone') {
    footer = <PostComments postId={postId} sessionUser={sessionUser} />;
    className = 'standalone-post';
  } else if (type === 'stream') {
    footer = <StreamPostFooter postId={postId} commentCount={commentCount} />;
    className = 'stream-post';
  } else if (type === 'comment') {
    footer = null;
    className = 'stream-post comment';
  }

  if (isOwnPost) className += ' own';

  // TODO Pasting the content directly into the HTML is not the
  // correct way to handle actual posts from the server!
  return (
    <article className={`post ${className}`}>
      <PostHeader
        author={author}
        isOwnPost={isOwnPost}
      />
      <div className="content-text">
        {content}
      </div>
      {footer}
    </article>
  );
};

Post.propTypes = {
  post: postShape.isRequired,
  type: PropTypes.oneOf(['standalone', 'stream', 'comment']).isRequired,
  sessionUser: userShape.isRequired,
};

export default Post;
