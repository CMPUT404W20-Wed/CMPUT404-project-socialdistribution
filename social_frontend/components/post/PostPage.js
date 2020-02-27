import React from 'react';
import PropTypes from 'prop-types';

import Stream from '../stream/Stream';
import PostHeader from './PostHeader';

import './post.css';


const PostComments = ({ postId }) => (
  <footer className="post-footer">
    <Stream isComments />
  </footer>
);

PostComments.propTypes = {
  postId: PropTypes.string.isRequired,
};


export default class PostPage extends React.Component {
  state = {
    post: {
      id: '0',
      author: 'Author0ID',
      content: 'You\'re looking at an expanded post.',
      commentCount: 14,
    },
  };

  render() {
    const { post } = this.state;
    const {
      id,
      author,
      content,
    } = post;
    return (
      <article className="post standalone-post">
        <PostHeader author={author} />
        <div className="content-text">
          {content}
        </div>
        <PostComments postId={id} />
      </article>
    );
  }
}
