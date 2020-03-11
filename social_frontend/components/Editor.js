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
  onPreviewToggle,
  onUnlistedToggle,
}) => (
  <div className="post-form-controls">
    <input
      type="submit"
      value={isComment ? 'Comment' : 'Post'}
      disabled={!canPost}
    />
    {
      canPreview && (
        <button type="button" onClick={onPreviewToggle}>Preview</button>
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
              onChange={onUnlistedToggle}
            />
          </>
        )
    }
  </div>
);

PostFormControls.propTypes = {
  isComment: PropTypes.bool,
  canPost: PropTypes.bool.isRequired,
  canPreview: PropTypes.bool.isRequired,
  onPreviewToggle: PropTypes.func.isRequired,
};

PostFormControls.defaultProps = {
  isComment: false,
};


/* Form enabling the user to create a new post. */
export default class PostForm extends React.Component {
  state = {
    textContent: '',
    canPost: false,
    errorMessage: null,
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

  handleTextChange(event) {
    const textContent = event.target.value;
    this.setState({
      textContent,
      canPost: (textContent.length > 0),
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      errorMessage: '',
    });

    const { submittedCallback } = this.props;
    const { textContent: content, isMarkdown, isUnlisted } = this.state;
    const title = ''; // TODO
    const visibility = 'PUBLIC'; // TODO

    const post = {
      title,
      content,
      visibility,
      unlisted: isUnlisted,
      description: '',
      contentType: isMarkdown ? 'text/markdown' : 'text/plain',
      categories: [],
      visibleTo: [],
    };

    // Submit the post to the server
    Axios.post(submitPostEndpoint(), {
      query: 'createPost',
      post,
    }).then(({ returnedPost }) => {
      this.setState({
        textContent: '',
        canPost: false,
      });
      submittedCallback(returnedPost);
    }).catch((error) => {
      this.setState({
        errorMessage: error.message,
      });
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
    const { isComment } = this.props;
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
      <form className={className}>
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
        />
      </form>
    );
  }
}

PostForm.propTypes = {
  isComment: PropTypes.bool,
  submittedCallback: PropTypes.func.isRequired,
};

PostForm.defaultProps = {
  isComment: false,
};
