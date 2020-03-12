import React from 'react';
import PropTypes from 'prop-types';

import StreamLoader from '../StreamLoader';
import Editor from '../Editor';
import {
  commentsEndpoint,
  submitCommentEndpoint,
  singleCommentEndpoint,
} from '../../util/endpoints';


/* Footer containing post comments. */
export default class Comments extends React.Component {
  state = {
    pushedPosts: [],
  };

  constructor(props) {
    super(props);

    this.afterSubmitPost = this.afterSubmitPost.bind(this);
  }

  afterSubmitPost(post) {
    const { pushedPosts: currentPushedPosts } = this.state;
    this.setState({
      pushedPosts: [post, ...currentPushedPosts],
    });
  }

  render() {
    const { postId, PostComponent } = this.props;
    const { pushedPosts } = this.state;

    return (
      <div className="post-footer">
        <StreamLoader
          PostComponent={PostComponent}
          getEndpoint={commentsEndpoint(postId)}
          itemEndpointPattern={
            (commentId) => singleCommentEndpoint(postId, commentId)
          }
          pushedPosts={pushedPosts}
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
