import React from 'react';
import PropTypes from 'prop-types';

import StreamLoader from '../StreamLoader';
import Editor from '../Editor';


/* Footer containing post comments. */
const Comments = ({ PostComponent }) => (
  <div className="post-footer">
    <StreamLoader PostComponent={PostComponent} />
    <Editor isComment />
  </div>
);

Comments.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
};

export default Comments;
