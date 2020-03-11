import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../Markdown';


const PostContent = ({ contentType, content }) => {
  if (contentType === 'text/plain') {
    return <div className="content-text content-plaintext">{content}</div>;
  }

  if (contentType === 'text/markdown') {
    return (
      <div className="content-text content-markdown">
        <Markdown source={content} />
      </div>
    );
  }

  return (
    <div className="content-unknown">
      {`Unsupported content-type "${contentType}"`}
    </div>
  );
};

PostContent.propTypes = {
  contentType: PropTypes.oneOf([
    'text/plain',
    'text/markdown',
    'image/png;base64', // TODO not implemented
    'image/jpeg;base64', // TODO not implemented
    'application/base64', // TODO what does this indicate?
  ]).isRequired,
  content: PropTypes.string.isRequired,
};

export default PostContent;
