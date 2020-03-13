import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Stream from './Stream';
import Suspender from './common/suspend/Suspender';
import { listen, removeListener } from '../util/broadcast';

export default class StreamLoader extends React.Component {
  state = {
    posts: [],
    pending: true,
    nextPageUrl: undefined,
  };

  constructor(props) {
    super(props);

    this.doLoadMore = this.doLoadMore.bind(this);
    this.afterDeletePost = this.afterDeletePost.bind(this);
    this.afterPatchPost = this.afterPatchPost.bind(this);
    this.handlePostDirty = this.handlePostDirty.bind(this);
    this.handlePostDelete = this.handlePostDelete.bind(this);
  }

  componentDidMount() {
    this.doLoadMore().then(
      () => { this.setState({ pending: false }); },
    );

    this.dirtyListener = listen('postDirty', this.handlePostDirty);
    this.deleteListener = listen('postDelete', this.handlePostDelete);
  }

  componentWillUnmount() {
    removeListener('postDirty', this.dirtyListener);
    removeListener('postDelete', this.deleteListener);
  }

  handlePostDirty(id) {
    const { itemEndpointPattern } = this.props;
    const endpoint = itemEndpointPattern(id);

    Axios.get(endpoint).then(({ data }) => {
      const content = data.comment || data.post;
      const { posts } = this.state;
      const cleanedPosts = posts.map((post) => {
        if (post.id === id) return content;
        return post;
      });
      this.setState({
        posts: cleanedPosts,
      });
    });
  }

  handlePostDelete(id) {
    const { posts } = this.state;
    this.setState({
      posts: posts.filter((post) => post.id !== id),
    });
  }

  afterDeletePost(post) {
    const { afterDeletePost } = this.props;
    const { posts: currentPosts } = this.state;
    this.setState({
      posts: currentPosts.filter((eachPost) => (eachPost !== post)),
    });

    if (afterDeletePost) afterDeletePost(post);
  }

  afterPatchPost(patchedPost) {
    const { posts } = this.state;
    this.setState({
      posts: posts.map((post) => {
        if (post.id === patchedPost.id) return patchedPost;
        return post;
      }),
    });
  }

  doLoadMore() {
    const { getEndpoint } = this.props;
    const { nextPageUrl } = this.state;

    const url = nextPageUrl || getEndpoint;

    return Axios.get(url).then(({ data }) => {
      const { next } = data;
      const { posts: currentPosts } = this.state;

      const isComments = (data.comments !== undefined);
      let content;
      if (isComments) {
        content = data.comments.map(
          ({
            id,
            author,
            published,
            contentType,
            comment,
          }) => ({
            id,
            author,
            published,
            contentType,
            content: comment,
            comments: [],
          }),
        );
      } else {
        content = data.posts;
      }

      if (content === undefined) {
        throw new Error('Stream response missing content');
      }

      this.setState({
        posts: currentPosts.concat(content),
        nextPageUrl: next,
      });
    }).catch((error) => {
      // TODO error?
      console.log('Failed to load posts:');
      console.log(error);
    });
  }

  pushPostToTop(post) {
    const { posts } = this.state;
    this.setState({
      posts: [post, ...posts],
    });
  }

  pushPostToBottom(post) {
    const { posts } = this.state;
    this.setState({
      posts: [...posts, post],
    });
  }

  render() {
    const {
      PostComponent,
      itemEndpointPattern,
    } = this.props;
    const { posts, pending, nextPageUrl } = this.state;

    return (
      pending
        ? <div className="stream-placeholder"><Suspender /></div>
        : (
          <Stream
            PostComponent={PostComponent}
            afterDelete={this.afterDeletePost}
            afterPatch={this.afterPatchPost}
            itemEndpointPattern={itemEndpointPattern}
            posts={posts}
            hasMore={nextPageUrl !== undefined}
            loadMoreCallback={this.doLoadMore}
          />
        )
    );
  }
}

StreamLoader.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
  getEndpoint: PropTypes.string.isRequired,
  itemEndpointPattern: PropTypes.func.isRequired,
  afterDeletePost: PropTypes.func,
};

StreamLoader.defaultProps = {
  afterDeletePost: undefined,
};
