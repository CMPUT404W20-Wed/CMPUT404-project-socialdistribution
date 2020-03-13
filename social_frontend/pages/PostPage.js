import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Post from '../components/post/Post';
import { singlePostEndpoint } from '../util/endpoints';
import { broadcast } from '../util/broadcast';


/* Page displaying a single post, including comments.
 * This could be displayed either by itself or in a modal.
 *
 * TODO this should eventually request the post, taking in a postId
 */
export default class PostPage extends React.Component {
  state = {
    post: null,
    deleted: false,
  };

  constructor(props) {
    super(props);

    this.doLoadPost = this.doLoadPost.bind(this);
    this.afterPostDelete = this.afterPostDelete.bind(this);
    this.afterPostPatch = this.afterPostPatch.bind(this);
  }

  componentDidMount() {
    this.doLoadPost();
  }

  afterPostPatch(post) {
    broadcast('postDirty', post.id);
    this.setState({ post });
  }

  afterPostDelete() {
    const { post } = this.state;
    broadcast('postDelete', post.id);
    this.setState({ post: null, deleted: true });
  }

  doLoadPost() {
    const { id } = this.props;

    return Axios.get(singlePostEndpoint(id)).then(({ data: { post } }) => {
      this.setState({
        post,
      });
    }).catch((error) => {
      // TODO error?
      console.log('Failed to load single post:');
      console.log(error);
    });
  }

  render() {
    const { id } = this.props;
    const { post, deleted } = this.state;
    if (deleted) {
      return (
        <article className="post standalone-post invalid-post">
          Post deleted.
        </article>
      );
    }

    if (post === null) {
      return (
        <article className="post standalone-post invalid-post">
          Post not found.
        </article>
      );
    }

    return (
      <Post
        type="standalone"
        post={post}
        endpoint={singlePostEndpoint(id)}
        afterPatch={this.afterPostPatch}
        afterDelete={this.afterPostDelete}
      />
    );
  }
}

PostPage.propTypes = {
  id: PropTypes.string.isRequired,
};
