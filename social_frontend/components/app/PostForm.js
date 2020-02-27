import React from 'react';
import PropTypes from 'prop-types';

import './postform.css';

const PostFormControls = ({ canPost }) => (
  <div className="post-form-controls">
    <input type="submit" value="Post" disabled={!canPost} />
    <select className="post-form-visibility">
      <option>Public</option>
      <option>Friends of friends</option>
      <option>All friends</option>
      <option>Local friends</option>
      <option>Private</option>
    </select>
  </div>
);

PostFormControls.propTypes = {
  canPost: PropTypes.bool.isRequired,
};

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
    const { textContent, canPost } = this.state;
    return (
      <form className="post-form">
        <textarea
          value={textContent}
          onChange={this.handleTextChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="post-form-text"
          placeholder="Post to your stream"
        />
        <PostFormControls canPost={canPost} />
      </form>
    );
  }
}
