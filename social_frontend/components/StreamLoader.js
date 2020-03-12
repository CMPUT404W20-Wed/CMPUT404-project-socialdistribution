import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Stream from './Stream';
import Suspender from './common/suspend/Suspender';
import { postShape } from '../util/shapes';

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
  }

  componentDidMount() {
    this.doLoadMore().then(
      () => { this.setState({ pending: false }); },
    );
  }

  afterDeletePost(post) {
    const { posts: currentPosts } = this.state;
    this.setState({
      posts: currentPosts.filter((eachPost) => (eachPost !== post)),
    });
  }

  afterPatchPost(post) {
    const { posts: currentPosts } = this.state;
    this.setState({
      posts: [...currentPosts, post],
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

  render() {
    const {
      pushedPosts,
      PostComponent,
      itemEndpointPattern,
      pushedPostsAtBottom,
    } = this.props;
    const { posts, pending, nextPageUrl } = this.state;

    const allPosts = pushedPostsAtBottom
      ? [...posts, ...pushedPosts]
      : [...pushedPosts, ...posts];

    return (
      pending
        ? <div className="stream-placeholder"><Suspender /></div>
        : (
          <Stream
            PostComponent={PostComponent}
            afterDelete={this.afterDeletePost}
            afterPatch={this.afterPatchPost}
            itemEndpointPattern={itemEndpointPattern}
            posts={allPosts}
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
  pushedPosts: PropTypes.arrayOf(postShape).isRequired,
  pushedPostsAtBottom: PropTypes.bool,
};

StreamLoader.defaultProps = {
  pushedPostsAtBottom: false,
};
