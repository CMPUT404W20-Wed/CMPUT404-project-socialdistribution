import React from 'react';
import PropTypes from 'prop-types';

import Markdown from './Markdown';

import '../styles/editor.css';


/* Control cluster at the bottom of the post form.
 * canPost should be set based on whether the post is valid.
 */
const PostFormControls = ({
  isComment,
  canPost,
  canPreview,
  canCancel,
  cancelCallback,
  isPatching,
  onPreviewToggle,
}) => {
  let submitLabel;
  if (isPatching) submitLabel = 'Save changes';
  else if (isComment) submitLabel = 'Comment';
  else submitLabel = 'Post';

  return (
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
              <input type="checkbox" name="unlisted" />
            </>
          )
        }
      </div>
    )
  );
};

PostFormControls.propTypes = {
  isComment: PropTypes.bool,
  canPost: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  isPatching: PropTypes.bool.isRequired,
  cancelCallback: PropTypes.func.isRequired,
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
    isMarkdown: false,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMarkdownToggle = this.handleMarkdownToggle.bind(this);
    this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
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

  render() {
    const { isComment, onCancel, onSubmit } = this.props;
    const {
      textContent,
      canPost,
      isMarkdown,
      isPreview,
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
          canCancel={onCancel !== undefined}
          cancelCallback={onCancel}
          isComment={isComment}
          isPatching={onSubmit !== undefined}
        />
      </form>
    );
  }
}

PostForm.propTypes = {
  isComment: PropTypes.bool,
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
