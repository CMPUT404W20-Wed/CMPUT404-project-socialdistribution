import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { submitPostEndpoint } from '../util/endpoints';

import Markdown from './Markdown';

import '../styles/editor.css';


/* Control cluster at the bottom of the post form.
 * canPost should be set based on whether the post is valid.
 */
const PostFormControls = ({
  isComment,
  isUnlisted,
  canPost,
  canPreview,
  canCancel,
  cancelCallback,
  isPatching,
  onPreviewToggle,
  onUnlistedToggle,
}) => {
  let submitLabel;
  if (isPatching) submitLabel = 'Save changes';
  else if (isComment) submitLabel = 'Comment';
  else submitLabel = 'Post';

  return (
    <div className="post-form-controls">
      <input
        type="submit"
        value={submitLabel}
        disabled={!canPost}
      />
      {
        canPreview && (
          <button type="button" onClick={onPreviewToggle}>Preview</button>
        )
      }
      {
        canCancel && (
          <button type="button" onClick={cancelCallback}>Cancel</button>
        )
      }
      {
        isComment
          ? null
          : (
            <>
              <select className="post-form-visibility">
                <option>Public</option>
                <option>Friends of friends</option>
                <option>All friends</option>
                <option>Local friends</option>
                <option>Private</option>
              </select>
              <input
                type="checkbox"
                name="unlisted"
                checked={isUnlisted}
                onClick={onUnlistedToggle}
              />
            </>
          )
      }
    </div>
  );
};

PostFormControls.propTypes = {
  isComment: PropTypes.bool,
  isUnlisted: PropTypes.bool.isRequired,
  canPost: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  isPatching: PropTypes.bool.isRequired,
  cancelCallback: PropTypes.func.isRequired,
  canPreview: PropTypes.bool.isRequired,
  onPreviewToggle: PropTypes.func.isRequired,
  onUnlistedToggle: PropTypes.func.isRequired,
};

PostFormControls.defaultProps = {
  isComment: false,
};


/* Form enabling the user to create a new post. */
export default class PostForm extends React.Component {
  state = {
    textContent: '',
    canPost: false,
    // errorMessage: null,
    isMarkdown: false,
    isUnlisted: false,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMarkdownToggle = this.handleMarkdownToggle.bind(this);
    this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
    this.handleUnlistedToggle = this.handleUnlistedToggle.bind(this);
  }

  componentDidMount() {
    const { defaultContent } = this.props;

    this.setState({
      textContent: defaultContent,
      canPost: (defaultContent.length > 0),
    });
  }

  handleTextChange(event) {
    const textContent = event.target.value;
    this.setState({
      textContent,
      canPost: (textContent.length > 0),
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    /* this.setState({
      errorMessage: '',
    }); */

    const { afterSubmit, isPatching, endpoint, isComment } = this.props;
    const { textContent: content, isMarkdown, isUnlisted } = this.state;
    const title = ''; // TODO
    const visibility = 'PUBLIC'; // TODO
    const contentType = isMarkdown ? 'text/markdown' : 'text/plain';

    const post = isComment
      ? {
        contentType,
        comment: content,
      }
      : {
        title,
        contentType,
        content,
        visibility,
        unlisted: isUnlisted,
        description: '',
        // categories: [],
        // visibleTo: [],
      };

    let method = isPatching ? 'put' : 'post';

    // Submit the post to the server
    Axios[method](endpoint, post).then(({
      returnedPost,
    }) => {
      this.setState({
        textContent: '',
        canPost: false,
      });
      submittedCallback(returnedPost);
    }).catch((/* error */) => {
      /* this.setState({
        errorMessage: error.message,
      }); */
    });
  }

  handleMarkdownToggle(event) {
    const value = event.target.checked;
    this.setState({
      isMarkdown: value,
    });

    if (!value) this.setState({ isPreview: false });
  }

  handlePreviewToggle() {
    const { isPreview } = this.state;
    this.setState({
      isPreview: !isPreview,
    });
  }

  handleUnlistedToggle(event) {
    const value = event.target.checked;
    this.setState({
      isUnlisted: value,
    });
  }

  render() {
    const {
      isComment,
      isPatching,
      onCancel,
      endpoint,
    } = this.props;
    const {
      textContent,
      canPost,
      isMarkdown,
      isPreview,
      isUnlisted,
    } = this.state;

    const className = `post-form ${isComment ? 'comment-form' : ''} ${isMarkdown ? 'markdown-mode' : ''}`;
    const placeholder = isComment ? 'Add a comment' : 'Post to your stream';
    return (
      <form onSubmit={this.handleSubmit} className={className}>
        <div className="post-form-mode-controls">
          <input
            type="checkbox"
            name="markdown"
            checked={isMarkdown}
            onChange={this.handleMarkdownToggle}
          />
        </div>
        {
          isMarkdown && isPreview
            ? (
              <div className="post-form-preview">
                <Markdown source={textContent} />
              </div>
            )
            : (
              <textarea
                value={textContent}
                onChange={this.handleTextChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                className="post-form-text"
                placeholder={placeholder}
              />
            )
        }
        <PostFormControls
          canPost={canPost}
          canPreview={isMarkdown}
          onPreviewToggle={this.handlePreviewToggle}
          onUnlistedToggle={this.handleUnlistedToggle}
          isComment={isComment}
          isUnlisted={isUnlisted}
          canCancel={onCancel !== undefined}
          cancelCallback={onCancel}
          isPatching={isPatching}
        />
      </form>
    );
  }
}

PostForm.propTypes = {
  isComment: PropTypes.bool,
  submittedCallback: PropTypes.func.isRequired,
  defaultContent: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

PostForm.defaultProps = {
  isComment: false,
  defaultContent: '',
  onCancel: undefined,
  onSubmit: undefined,
};
