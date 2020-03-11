import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostHeader from './PostHeader';
import Comments from './Comments';
import Editor from '../Editor';
import PostContent from './PostContent';
import ModalLink from '../common/modal/ModalLink';
import { postShape } from '../../util/shapes';

import '../../styles/post.css';


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
class Post extends React.Component {
  state = {
    isEditing: false,
  };

  constructor(props) {
    super(props);

    this.doEdit = this.doEdit.bind(this);
    this.doCancelEdit = this.doCancelEdit.bind(this);
  }

  doEdit() {
    this.setState({
      isEditing: true,
    });
  }

  doCancelEdit() {
    this.setState({
      isEditing: false,
    });
  }

  render() {
    const {
      post: {
        id: postId,
        author,
        content,
        commentCount,
      },
      type,
      currentUserId,
      deleteCallback,
      patchCallback,
    } = this.props;
    const { isEditing } = this.state;

    const { id: authorId } = author;
    const isOwnPost = (authorId === currentUserId);

    let footer;
    let className;
    if (type === 'standalone') {
      const Comment = ({ post }) => (
        <Post type="comment" post={post} />
      );

      Comment.propTypes = { post: postShape.isRequired };

      footer = <Comments PostComponent={Comment} postId={postId} />;
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
          onEditClick={this.doEdit}
          onDeleteClick={deleteCallback}
        />
        {
          isEditing
            ? (
              <Editor
                inline
                onCancel={this.doCancelEdit}
                onSubmit={patchCallback}
                defaultContent={content}
              />
            )
            : <PostContent content={content} contentType={contentType} />
        }
        {footer}
      </article>
    );
  }
}

Post.propTypes = {
  post: postShape.isRequired,
  type: PropTypes.oneOf(['standalone', 'stream', 'comment']).isRequired,
  deleteCallback: PropTypes.func.isRequired,
  patchCallback: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
};

Post.defaultProps = {
  currentUserId: null,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
});

export default connect(mapStateToProps)(Post);
