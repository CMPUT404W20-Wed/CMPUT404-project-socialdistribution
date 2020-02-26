import React from 'react';

import Post from './Post';

import './stream.css';


// Stream of posts.
export default class Stream extends React.Component {
  state = {
    posts: [
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
    ],
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="stream">
        {posts.map(({ id }) => <Post key={id} />)}
      </div>
    );
  }
}
