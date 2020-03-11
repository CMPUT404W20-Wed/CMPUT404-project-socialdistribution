import React from 'react';
import PropTypes from 'prop-types';

import '../styles/editor.css';


/* Control cluster at the bottom of the post form.
 * canPost should be set based on whether the post is valid.
 */
const PostFormControls = ({
  canPost,
  canCancel,
  cancelCallback,
  isComment,
  isPatching,
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
  );
};

PostFormControls.propTypes = {
  isComment: PropTypes.bool,
  canPost: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  isPatching: PropTypes.bool.isRequired,
  cancelCallback: PropTypes.func.isRequired,
};

PostFormControls.defaultProps = {
  isComment: false,
};


/* Form enabling the user to create a new post. */
export default class PostForm extends React.Component {
  state = {
    textContent: '',
    canPost: false,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
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

  render() {
    const { isComment, onCancel, onSubmit } = this.props;
    const { textContent, canPost } = this.state;
    return (
      <form className={isComment ? 'post-form comment-form' : 'post-form'}>
        <textarea
          value={textContent}
          onChange={this.handleTextChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="post-form-text"
          placeholder={isComment ? 'Add a comment' : 'Post to your stream'}
        />
        <PostFormControls
          canPost={canPost}
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
