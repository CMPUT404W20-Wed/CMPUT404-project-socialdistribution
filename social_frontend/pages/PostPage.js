import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Post from '../components/post/Post';
import { singlePostEndpoint } from '../util/endpoints';


/* Page displaying a single post, including comments.
 * This could be displayed either by itself or in a modal.
 *
 * TODO this should eventually request the post, taking in a postId
 */
export default class PostPage extends React.Component {
  state = {
    post: null,
  };

  constructor(props) {
    super(props);

    this.doLoadPost = this.doLoadPost.bind(this);
    this.handlePostDelete = this.handlePostDelete.bind(this);
    this.handlePostPatch = this.handlePostPatch.bind(this);
  }

  componentDidMount() {
    this.doLoadPost();
  }

  handlePostPatch(post) {
    this.setState({ post });
  }

  handlePostDelete() {
    this.setState({ post: null });
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
    const { post } = this.state;
    return (
      <Post
        type="standalone"
        post={post}
        endpoint={singlePostEndpoint(id)}
        afterPatch={this.handlePostPatch}
        afterDelete={this.handlePostDelete}
      />
    );
  }
}

PostPage.propTypes = {
  id: PropTypes.string.isRequired,
};
