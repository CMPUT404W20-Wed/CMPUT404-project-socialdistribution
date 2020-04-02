import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { connect } from 'react-redux';

import PostHeader from './PostHeader';
import Comments from './Comments';
import Editor from '../Editor';
import PostContent from './PostContent';
import TagBar from '../common/TagBar';
import ModalLink from '../common/modal/ModalLink';
import aidToUuid from '../../util/aidToUuid';
import { postShape } from '../../util/shapes';
import safeFormat from '../../util/safeFormat';

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
            safeFormat(commentCount)
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
    this.doDelete = this.doDelete.bind(this);
    this.doCancelEdit = this.doCancelEdit.bind(this);
    this.doAfterPatch = this.doAfterPatch.bind(this);
  }

  doDelete() {
    const { endpoint, afterDelete, post } = this.props;

    Axios.delete(endpoint).then(() => { afterDelete(post); });
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

  doAfterPatch(post) {
    const { afterPatch } = this.props;
    this.setState({
      isEditing: false,
    });
    if (afterPatch) afterPatch(post);
  }

  render() {
    const {
      post,
      type,
      currentUserId,
      endpoint,
    } = this.props;
    const { isEditing } = this.state;

    if (post === null) return null;
    const {
      id: postId,
      author,
      title,
      description,
      content,
      categories,
      comments,
      contentType,
      visibility,
      unlisted,
    } = post;

    const authorId = aidToUuid(author.id);
    const isOwnPost = (authorId === currentUserId);
    const commentCount = comments ? comments.length : 0;

    let footer;
    let className;
    if (type === 'standalone') {
      const Comment = (props) => (
        /* (This is meant to be a transparent wrapper.) */
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        <Post type="comment" currentUserId={currentUserId} {...props} />
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

    return (
      <article className={`post ${className}`}>
        <PostHeader
          author={author}
          visibility={visibility}
          unlisted={unlisted}
          isOwnPost={isOwnPost}
          onEditClick={this.doEdit}
          onDeleteClick={this.doDelete}
        />
        {
          isEditing
            ? (
              <Editor
                isPatching
                isComment={type === 'comment'}
                onCancel={this.doCancelEdit}
                submittedCallback={this.doAfterPatch}
                endpoint={endpoint}
                defaultContent={content}
                defaultDescription={description}
                defaultTitle={title}
                defaultCategories={categories}
                defaultVisibility={visibility}
                defaultUnlistedState={unlisted}
              />
            )
            : (
              <>
                {
                  (title || description) && (
                    <div className="post-preface">
                      {title && <h3 className="post-title">{title}</h3>}
                      {
                        description && (
                          <div className="post-description">{description}</div>
                        )
                      }
                    </div>
                  )
                }
                <PostContent content={content} contentType={contentType} />
                {
                  categories && categories.length > 0 && (
                    <TagBar
                      render={(category)=>`#${category}`}
                      items={categories}
                    />
                  )
                }
                {footer}
              </>
            )
        }
      </article>
    );
  }
}

Post.propTypes = {
  post: postShape,
  type: PropTypes.oneOf(['standalone', 'stream', 'comment']).isRequired,
  afterDelete: PropTypes.func.isRequired,
  afterPatch: PropTypes.func.isRequired,
  endpoint: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
};

Post.defaultProps = {
  post: null,
  currentUserId: null,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
});

export default connect(mapStateToProps)(Post);
