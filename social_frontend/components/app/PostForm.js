import React from 'react';
import PropTypes from 'prop-types';

import './postform.css';


/* Control cluster at the bottom of the post form.
 * canPost should be set based on whether the post is valid.
 */
const PostFormControls = ({ canPost, isComment }) => (
  <div className="post-form-controls">
    <input
      type="submit"
      value={isComment ? 'Comment' : 'Post'}
      disabled={!canPost}
    />
    {
      isComment
        ? null
        : (
          <select className="post-form-visibility">
            <option>Public</option>
            <option>Friends of friends</option>
            <option>All friends</option>
            <option>Local friends</option>
            <option>Private</option>
          </select>
        )
    }
  </div>
);

PostFormControls.propTypes = {
  canPost: PropTypes.bool.isRequired,
  isComment: PropTypes.bool,
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

  handleTextChange(event) {
    const textContent = event.target.value;
    this.setState({
      textContent,
      canPost: (textContent.length > 0),
    });
  }

  render() {
    const { isComment } = this.props;
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
        <PostFormControls canPost={canPost} isComment={isComment} />
      </form>
    );
  }
}

PostForm.propTypes = {
  isComment: PropTypes.bool,
};

PostForm.defaultProps = {
  isComment: false,
};
