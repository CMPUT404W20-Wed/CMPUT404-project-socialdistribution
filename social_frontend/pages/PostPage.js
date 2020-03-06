import React from 'react';

import Post from '../components/post/Post';
import { userShape } from '../util/shapes';


/* Page displaying a single post, including comments.
 * This could be displayed either by itself or in a modal.
 *
 * TODO this should eventually request the post, taking in a postId
 */
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
    const { sessionUser } = this.props;
    const { post } = this.state;
    return <Post type="standalone" post={post} sessionUser={sessionUser} />;
  }
}

PostPage.propTypes = {
  sessionUser: userShape.isRequired,
};
