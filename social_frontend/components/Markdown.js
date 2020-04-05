/* eslint-disable react/no-danger */
/* Passing raw HTML is more or less necessary to implement Markdown
 * (at least without a React-aware Markdown engine,
 *  which commonMark alone is not) */

import React from 'react';
import PropTypes from 'prop-types';
import CommonMark from 'commonmark';

import { imagePortalEndpoint } from '../util/endpoints';


const mdParser = new CommonMark.Parser({ smart: true });
const mdWriter = new CommonMark.HtmlRenderer({ safe: true });


const parseMarkdown = (source) => {
  const ast = mdParser.parse(source);
  const w = ast.walker();
  for (let e = w.next(); e; e = w.next()) {
    if (e.entering && e.node.type === 'image') {
      e.node.destination = imagePortalEndpoint(e.node.destination);
    }
  }
  return { __html: mdWriter.render(ast) };
};

const Markdown = ({ source }) => {
  const rendered = (
    <div className="md" dangerouslySetInnerHTML={parseMarkdown(source)} />
  );

  return rendered;
};

Markdown.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Markdown;
