import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { submitPostEndpoint } from '../util/endpoints';

import '../styles/editor.css';


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
    errorMessage: null,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { textContent: content } = this.state;
    const title = ''; // TODO
    const visibility = 'PUBLIC'; // TODO
    const unlisted = false; // TODO

    const post = {
      title,
      content,
      visibility,
      unlisted,
      description: '',
      contentType: 'text/plain',
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

  render() {
    const { isComment } = this.props;
    const { textContent, canPost, errorMessage } = this.state;
    return (
      <form
        className={isComment ? 'post-form comment-form' : 'post-form'}
        onSubmit={this.handleSubmit}
      >
        <textarea
          value={textContent}
          onChange={this.handleTextChange}
          className="post-form-text"
          placeholder={isComment ? 'Add a comment' : 'Post to your stream'}
        />
        { errorMessage && <div className="error-message">{errorMessage}</div> }
        <PostFormControls canPost={canPost} isComment={isComment} />
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
