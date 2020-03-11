/* eslint-disable react/no-danger */
/* Passing raw HTML is more or less necessary to implement Markdown
 * (at least without a React-aware Markdown engine,
 *  which commonMark alone is not) */

import React from 'react';
import PropTypes from 'prop-types';

import parseMarkdown from '../Markdown';


const PostContent = ({ contentType, content }) => {
  if (contentType === 'text/plain') {
    return <div className="content-text content-plaintext">{content}</div>;
  }

  if (contentType === 'text/markdown') {
    return (
      <div
        className="content-text content-markdown"
        dangerouslySetInnerHTML={parseMarkdown(content)}
      />
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
