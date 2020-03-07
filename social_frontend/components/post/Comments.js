import React from 'react';
import PropTypes from 'prop-types';

import Stream from '../Stream';
import Editor from '../Editor';


/* Footer containing post comments. */
export default class Comments extends React.Component {
  state = {
    posts: [
      {
        id: '0',
        author: {
          id: 'author1@example.net',
          displayName: 'Author 1',
        },
        content: 'This is a comment.',
        commentCount: 0,
      },
    ],
  };

  render() {
    const { PostComponent } = this.props;
    const { posts } = this.state;

    return (
      <div className="post-footer">
        <Stream PostComponent={PostComponent} posts={posts} />
        <Editor isComment />
      </div>
    );
  }
}

Comments.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
};
