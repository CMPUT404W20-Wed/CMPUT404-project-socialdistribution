import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Markdown from './Markdown';
import Attachments from './Attachments';
import { imageAbsoluteURL, submitPostEndpoint } from '../util/endpoints';

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
  visibility,
  onPreviewToggle,
  onUnlistedToggle,
  onVisibilityChange,
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
              <select
                className="post-form-visibility"
                value={visibility}
                onChange={onVisibilityChange}
              >
                <option value="PUBLIC">Public</option>
                <option value="FOAF">Friends of friends</option>
                <option value="FRIENDS">All friends</option>
                <option value="SERVERONLY">Local friends</option>
                <option value="PRIVATE">Private</option>
              </select>
              <input
                type="checkbox"
                name="unlisted"
                title={`Unlisted: ${isUnlisted ? 'yes' : 'no'}`}
                checked={isUnlisted}
                onChange={onUnlistedToggle}
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
  visibility: PropTypes.oneOf([
    'PUBLIC',
    'FOAF',
    'FRIENDS',
    'SERVERONLY',
    'PRIVATE',
  ]).isRequired,
  cancelCallback: PropTypes.func,
  canPreview: PropTypes.bool.isRequired,
  onPreviewToggle: PropTypes.func.isRequired,
  onUnlistedToggle: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
};

PostFormControls.defaultProps = {
  isComment: false,
  cancelCallback: undefined,
};


/* Form enabling the user to create a new post. */
export default class PostForm extends React.Component {
  state = {
    textContent: '',
    attachments: [],
    canPost: false,
    visibility: 'PUBLIC',
    errorMessage: null,
    isMarkdown: false,
    isUnlisted: false,
    isPreview: false,
    isAttaching: false,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMarkdownToggle = this.handleMarkdownToggle.bind(this);
    this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
    this.handleUnlistedToggle = this.handleUnlistedToggle.bind(this);
    this.handleAttachingToggle = this.handleAttachingToggle.bind(this);
    this.handleAttach = this.handleAttach.bind(this);
    this.handleDetach = this.handleDetach.bind(this);
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

  handleVisibilityChange(event) {
    const { value } = event.target;
    this.setState({
      visibility: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      errorMessage: '',
    });

    const {
      submittedCallback,
      isPatching,
      endpoint,
      isComment,
    } = this.props;
    const {
      textContent: content,
      attachments,
      isMarkdown,
      isUnlisted,
      isAttaching,
      visibility,
    } = this.state;

    // Handle attachments

    Promise.all(
      (isAttaching ? attachments : []).map(({ file, data }) => {
        const attachmentNativeType = file.type;

        let attachmentType;
        let attachmentContent;
        let attachmentExt;
        if (attachmentNativeType === 'image/png'
          || attachmentNativeType === 'image/jpeg'
        ) {
          attachmentType = `${file.type};base64`;
          attachmentContent = data;
          attachmentExt = (attachmentNativeType === 'image/png')
            ? 'png'
            : 'jpeg';
        } else {
          // TODO
          console.log("Can't convert image");
        }

        const attachmentPost = {
          visibility,
          contentType: attachmentType,
          content: window.btoa(attachmentContent),
          title: file.name,
          unlisted: true,
          description: 'Attachment',
          // categories: [],
          // visibleTo: [],
        };

        return Axios.post(submitPostEndpoint(), attachmentPost).then(({
          data: { post: returnedPost },
        }) => ({
          id: returnedPost.id,
          name: file.name,
          ext: attachmentExt,
        }));
      }),
    ).then((attachmentSpecs) => {
      // Handle the main post

      const title = ''; // TODO
      const contentType = isMarkdown ? 'text/markdown' : 'text/plain';

      let adjustedContent;
      let adjustedContentType;
      if (attachmentSpecs.length) {
        const { origin } = window.location;
        adjustedContent = attachmentSpecs.map(
          ({
            id,
            name,
            ext,
          }) => `![${name}](${imageAbsoluteURL(origin, id, ext)})\n\n`,
        ).reduce((x, y) => x + y) + content;
        adjustedContentType = 'text/markdown';
      } else {
        adjustedContent = content;
        adjustedContentType = contentType;
      }

      console.log('isComment?', isComment);
      const post = isComment
        ? {
          contentType: adjustedContentType,
          comment: adjustedContent,
        }
        : {
          title,
          visibility,
          contentType: adjustedContentType,
          content: adjustedContent,
          unlisted: isUnlisted,
          description: '',
          // categories: [],
          // visibleTo: [],
        };

      const method = isPatching ? 'put' : 'post';

      // Submit the post to the server
      Axios[method](endpoint, post).then(({
        data: { post: returnedPost, comment: returnedComment },
      }) => {
        this.setState({
          textContent: '',
          attachments: [],
          canPost: false,
          isPreview: false,
        });

        let returnedContent;
        if (returnedComment) {
          const {
            published,
            id,
            author,
            contentType: commentContentType,
            comment,
          } = returnedComment;
          returnedContent = {
            published,
            id,
            author,
            contentType: commentContentType,
            content: comment,
            comments: [],
          };
        } else {
          returnedContent = returnedPost;
        }

        submittedCallback(returnedContent);
      }).catch((error) => {
        this.setState({
          errorMessage: error.message,
        });
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

  handleAttachingToggle(event) {
    const value = event.target.checked;
    this.setState({
      isAttaching: value,
    });
  }

  handleAttach(file) {
    const fr = new FileReader();
    fr.onload = ({ target: { result } }) => {
      this.setState(({ attachments }) => ({
        attachments: [...attachments, {
          file,
          data: result,
          url: URL.createObjectURL(file),
        }],
      }));
    };
    fr.readAsBinaryString(file);
  }

  handleDetach(file) {
    this.setState(({ attachments }) => ({
      attachments: attachments.filter((a) => a.file !== file),
    }));
  }

  render() {
    const {
      isComment,
      isPatching,
      onCancel,
    } = this.props;
    const {
      textContent,
      attachments,
      canPost,
      isMarkdown,
      isPreview,
      isUnlisted,
      isAttaching,
      visibility,
      errorMessage,
    } = this.state;

    const className = `post-form ${isComment ? 'comment-form' : ''} ${isMarkdown ? 'markdown-mode' : ''}`;
    const placeholder = isComment ? 'Add a comment' : 'Post to your stream';
    return (
      <form onSubmit={this.handleSubmit} className={className}>
        <div className="post-form-mode-controls">
          <input
            type="checkbox"
            name="markdown"
            title={`Markdown: ${isMarkdown ? 'on' : 'off'}`}
            checked={isMarkdown}
            onChange={this.handleMarkdownToggle}
          />
          <input
            type="checkbox"
            name="markdown"
            className="post-form-attach-toggle"
            title="Attach"
            checked={isAttaching}
            onChange={this.handleAttachingToggle}
          />
        </div>
        <Attachments
          attachments={attachments}
          visible={isAttaching}
          onAttach={this.handleAttach}
          onDetach={this.handleDetach}
        />
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
        {errorMessage}
        <PostFormControls
          canPost={canPost}
          canPreview={isMarkdown}
          onPreviewToggle={this.handlePreviewToggle}
          onUnlistedToggle={this.handleUnlistedToggle}
          onVisibilityChange={this.handleVisibilityChange}
          isComment={isComment}
          isUnlisted={isUnlisted}
          canCancel={onCancel !== undefined}
          cancelCallback={onCancel}
          isPatching={isPatching}
          visibility={visibility}
        />
      </form>
    );
  }
}

PostForm.propTypes = {
  isComment: PropTypes.bool,
  isPatching: PropTypes.bool,
  submittedCallback: PropTypes.func,
  defaultContent: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
};

PostForm.defaultProps = {
  isComment: false,
  isPatching: false,
  submittedCallback: undefined,
  defaultContent: '',
  onCancel: undefined,
};
