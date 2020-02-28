import React from 'react';
// import PropTypes from 'prop-types';

import Stream from '../stream/Stream';
import PostHeader from './PostHeader';
import PostForm from '../app/PostForm';

import './post.css';


/* Footer containing post comments. */
const PostComments = (/* { postId } */) => (
  <div className="post-footer">
    <Stream isComments />
    <PostForm isComment />
  </div>
);

/*
PostComments.propTypes = {
  postId: PropTypes.string.isRequired,
};
*/


/* A standalone post, including comments. */
export default class PostPage extends React.Component {
  state = {
    post: {
      id: '0',
      author: {
        id: 'post.author@example.net',
        displayName: 'Post Author',
      },
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
