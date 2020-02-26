import React from 'react';

import Post from './Post';

import './stream.css';


// Stream of posts.
export default class Stream extends React.Component {
  state = {
    posts: [
      { id: '0', author: 'Author1ID', content: 'Post 1' },
      { id: '1', author: 'Author2ID', content: 'Post 2' },
      { id: '2', author: 'Author3ID', content: 'Post 3' },
      { id: '3', author: 'Author4ID', content: 'Post 4' },
      { id: '4', author: 'Author5ID', content: 'Post 5' },
    ],
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="stream">
        {posts.map(({ id, author, content }) => (
          <Post key={id} author={author} content={content} />
        ))}
      </div>
    );
  }
}
