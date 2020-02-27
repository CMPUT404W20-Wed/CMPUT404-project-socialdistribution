import React from 'react';
import PropTypes from 'prop-types';

import StreamPost from '../post/StreamPost';

import './stream.css';


/* Stream is a list of posts.
 * The list of posts is displayed linearly.
 * TODO when dynamic loading is implemented, state should probably
 * be moved up, and posts here will become a prop
 */
export default class Stream extends React.Component {
  state = {
    posts: [
      {
        id: '0',
        author: 'Author1ID',
        content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
        commentCount: 0,
      },
      {
        id: '1',
        author: 'Author2ID',
        content: 'So what I think is going on here is actually nothing in particular.',
        commentCount: 13,
      },
      {
        id: '2',
        author: 'Author3ID',
        content: 'Post 3',
        commentCount: 1,
      },
      {
        id: '3',
        author: 'Author4ID',
        content: 'Post 4',
        commentCount: 0,
      },
      {
        id: '4',
        author: 'Author5ID',
        content: 'Post 5',
        commentCount: 0,
      },
      {
        id: '5',
        author: 'Author1ID',
        content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
        commentCount: 5,
      },
      {
        id: '6',
        author: 'Author2ID',
        content: 'So what I think is going on here is actually nothing in particular. This post, by the way, has an ID of 6, but it\'s actually the seventh post on the page, because that\'s how indexing works.',
        commentCount: 0,
      },
      {
        id: '7',
        author: 'Author1ID',
        content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
        commentCount: 1012,
      },
    ],
  };

  render() {
    const { isComments } = this.props;
    const { posts } = this.state;
    return (
      <div className={isComments ? 'stream comment-stream' : 'stream'}>
        {posts.map(
          ({
            id,
            author,
            content,
            commentCount,
          }) => (
            <StreamPost
              key={id}
              postId={id}
              author={author}
              content={content}
              commentCount={commentCount}
              isComment={isComments}
            />
          ),
        )}
      </div>
    );
  }
}

Stream.propTypes = {
  isComments: PropTypes.bool,
};

Stream.defaultProps = {
  isComments: false,
};
