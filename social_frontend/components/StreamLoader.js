import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Stream from './Stream';
import Suspender from './common/suspend/Suspender';

export default class StreamLoader extends React.Component {
  state = {
    posts: [],
    pending: true,
    nextPageUrl: undefined,
  };

  constructor(props) {
    super(props);

    this.doLoadMore = this.doLoadMore.bind(this);
  }

  componentDidMount() {
    this.doLoadMore().then(
      () => { this.setState({ pending: false }); },
    );
  }

  doLoadMore() {
    const { endpoint } = this.props;
    const { nextPageUrl } = this.state;

    const url = nextPageUrl || endpoint;

    return Axios.get(url).then(({ next, posts }) => {
      const { posts: currentPosts } = this.state;
      if (posts === undefined) {
        throw new Error('Stream response missing "posts"');
      }

      this.setState({
        posts: currentPosts.concat(posts),
        nextPageUrl: next,
      });
    }).catch((error) => {
      // TODO error?
      console.log('Failed to load posts:');
      console.log(error);
    });
  }

  render() {
    const { PostComponent } = this.props;
    const { posts, pending, nextPageUrl } = this.state;

    return (
      pending
        ? <div className="stream-placeholder"><Suspender /></div>
        : (
          <Stream
            PostComponent={PostComponent}
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
  endpoint: PropTypes.string.isRequired,
};
