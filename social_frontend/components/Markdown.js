/* eslint-disable react/no-danger */
/* Passing raw HTML is more or less necessary to implement Markdown
 * (at least without a React-aware Markdown engine,
 *  which commonMark alone is not) */

import React from 'react';
import PropTypes from 'prop-types';
import CommonMark from 'commonmark';


const mdParser = new CommonMark.Parser({ smart: true });
const mdWriter = new CommonMark.HtmlRenderer({ safe: true });


const parseMarkdown = (source) => (
  { __html: mdWriter.render(mdParser.parse(source)) }
);

const Markdown = ({ source }) => (
  <div className="md" dangerouslySetInnerHTML={parseMarkdown(source)} />
);

Markdown.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Markdown;
