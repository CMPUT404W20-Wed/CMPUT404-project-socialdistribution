import React from 'react';
import PropTypes from 'prop-types';

import StreamLoader from '../StreamLoader';
import Editor from '../Editor';
import { broadcast } from '../../util/broadcast';
import {
  commentsEndpoint,
  submitCommentEndpoint,
  singleCommentEndpoint,
} from '../../util/endpoints';


/* Footer containing post comments. */
export default class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.streamRef = React.createRef();

    this.afterSubmitPost = this.afterSubmitPost.bind(this);
    this.afterDeletePost = this.afterDeletePost.bind(this);
  }

  afterSubmitPost(post) {
    const { postId } = this.props;

    // TODO can this be made declarative?
    this.streamRef.current.pushPostToBottom(post);

    broadcast('postDirty', postId);
  }

  afterDeletePost() {
    const { postId } = this.props;
    broadcast('postDirty', postId);
  }

  render() {
    const { postId, PostComponent } = this.props;

    return (
      <div className="post-footer">
        <StreamLoader
          ref={this.streamRef}
          PostComponent={PostComponent}
          getEndpoint={commentsEndpoint(postId)}
          itemEndpointPattern={
            (commentId) => singleCommentEndpoint(postId, commentId)
          }
          afterDeletePost={this.afterDeletePost}
        />
        <Editor
          isComment
          endpoint={submitCommentEndpoint(postId)}
          submittedCallback={this.afterSubmitPost}
        />
      </div>
    );
  }
}

Comments.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
  postId: PropTypes.string.isRequired,
};
