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
const Comments = ({ postId, PostComponent }) => (
  <div className="post-footer">
    <StreamLoader
      PostComponent={PostComponent}
      getEndpoint={commentsEndpoint(postId)}
      itemEndpointPattern={
        (commentId) => singleCommentEndpoint(postId, commentId)
      }
    />
    <Editor isComment endpoint={submitCommentEndpoint(postId)} />
  </div>
);

Comments.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
};

export default Comments;
