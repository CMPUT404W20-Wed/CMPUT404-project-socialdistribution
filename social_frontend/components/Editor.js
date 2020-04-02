import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Markdown from './Markdown';
import Attachments from './Attachments';
import TagBar from './common/TagBar';
import EditorUserBar from './EditorUserBar';
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
                <option value="AUTHOR">Specific people</option>
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
    'AUTHOR',
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
    title: '',
    description: '',
    attachments: [],
    categories: [],
    canPost: false,
    visibility: 'PUBLIC',
    visibleTo: [],
    errorMessage: null,
    isMarkdown: false,
    isUnlisted: false,
    isPreview: false,
    isAttaching: false,
    showAdvanced: false,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMarkdownToggle = this.handleMarkdownToggle.bind(this);
    this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
    this.handleUnlistedToggle = this.handleUnlistedToggle.bind(this);
    this.handleAttachingToggle = this.handleAttachingToggle.bind(this);
    this.handleAdvancedToggle = this.handleAdvancedToggle.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleAttach = this.handleAttach.bind(this);
    this.handleDetach = this.handleDetach.bind(this);
  }

  componentDidMount() {
    const {
      defaultContent,
      defaultTitle,
      defaultDescription,
      defaultCategories,
      defaultVisibility,
      defaultVisibleTo,
      defaultUnlistedState,
    } = this.props;

    this.setState({
      textContent: defaultContent,
      title: defaultTitle,
      description: defaultDescription,
      categories: defaultCategories ?? [],
      visibility: defaultVisibility,
      visibleTo: defaultVisibleTo ?? [],
      isUnlisted: defaultUnlistedState,
      canPost: (defaultContent.length > 0),
      showAdvanced: (
        (defaultCategories && defaultCategories.length > 0)
        || defaultTitle.length > 0
        || defaultDescription.length > 0
      ),
    });
  }

  handleTextChange(event) {
    const textContent = event.target.value;
    this.setState({
      textContent,
      canPost: (textContent.length > 0),
    });
  }

  handleDescriptionChange(event) {
    const textContent = event.target.value;
    this.setState({
      description: textContent,
    });
  }

  handleTitleChange(event) {
    const textContent = event.target.value;
    this.setState({
      title: textContent,
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
      description,
      title,
      categories,
      attachments,
      isMarkdown,
      isUnlisted,
      isAttaching,
      visibility,
      visibleTo,
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
          visibleTo,
          contentType: attachmentType,
          content: window.btoa(attachmentContent),
          title: file.name,
          unlisted: true,
          description: 'Attachment',
          categories: [],
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
          visibleTo,
          categories,
          description,
          contentType: adjustedContentType,
          content: adjustedContent,
          unlisted: isUnlisted,
        };

      const method = isPatching ? 'put' : 'post';

      // Submit the post to the server
      Axios[method](endpoint, post).then(({
        data: { post: returnedPost, comment: returnedComment },
      }) => {
        this.setState({
          textContent: '',
          description: '',
          title: '',
          attachments: [],
          categories: [],
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

  handleAdvancedToggle(event) {
    const value = event.target.checked;
    this.setState({
      showAdvanced: value,
    });
  }

  handleAddCategory(category) {
    this.setState(({ categories }) => ({
      categories: [...categories, category],
    }));
  }

  handleRemoveCategory(index) {
    this.setState(({ categories }) => ({
      categories: categories.filter((a, i) => i !== index),
    }));
  }

  handleAddUser(id) {
    this.setState(({ visibleTo }) => ({
      visibleTo: [...visibleTo, id],
    }));
  }

  handleRemoveUser(index) {
    this.setState(({ visibleTo }) => ({
      visibleTo: visibleTo.filter((u, i) => i !== index),
    }));
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
      title,
      description,
      categories,
      attachments,
      canPost,
      isMarkdown,
      isPreview,
      isUnlisted,
      isAttaching,
      showAdvanced,
      visibility,
      visibleTo,
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
          {
            !isComment && (
              <input
                type="checkbox"
                name="markdown"
                className="post-form-advanced-toggle"
                title="Advanced"
                checked={showAdvanced}
                onChange={this.handleAdvancedToggle}
              />
            )
          }
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
          showAdvanced && !isComment && (
            <>
              <input
                value={title}
                onChange={this.handleTitleChange}
                className="post-form-title"
                placeholder="Title"
              />
              <textarea
                value={description}
                onChange={this.handleDescriptionChange}
                className="post-form-description"
                placeholder="Description"
              />
            </>
          )
        }
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
        {
          showAdvanced && !isComment && (
            <TagBar
              editable
              editPlaceholder="Add category"
              items={categories}
              render={(text) => `#${text}`}
              onAddItem={this.handleAddCategory}
              onRemoveItem={this.handleRemoveCategory}
            />
          )
        }
        {errorMessage}
        {
          visibility === 'AUTHOR' && (
            <>
              <h4 className="user-bar-header">Share with</h4>
              <EditorUserBar
                items={visibleTo}
                onAddUser={this.handleAddUser}
                onRemoveUser={this.handleRemoveUser}
              />
            </>
          )
        }
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
  defaultTitle: PropTypes.string,
  defaultDescription: PropTypes.string,
  defaultCategories: PropTypes.arrayOf(PropTypes.string),
  defaultVisibleTo: PropTypes.arrayOf(PropTypes.string),
  defaultUnlistedState: PropTypes.bool,
  defaultVisibility: PropTypes.oneOf([
    'PUBLIC',
    'FOAF',
    'FRIENDS',
    'SERVERONLY',
    'AUTHOR',
    'PRIVATE',
  ]),
  endpoint: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
};

PostForm.defaultProps = {
  isComment: false,
  isPatching: false,
  submittedCallback: undefined,
  defaultContent: '',
  defaultTitle: '',
  defaultDescription: '',
  defaultCategories: null,
  defaultVisibleTo: null,
  defaultUnlistedState: false,
  defaultVisibility: 'PUBLIC',
  onCancel: undefined,
};
