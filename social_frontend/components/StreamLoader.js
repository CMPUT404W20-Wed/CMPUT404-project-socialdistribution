import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import Stream from './Stream';
import Suspender from './common/suspend/Suspender';
import {
  streamEndpoint,
  userStreamEndpoint,
  profileEndpoint,
} from '../util/endpoints';

export default class StreamLoader extends React.Component {
  state = {
    posts: [],
    pending: true,
    nextPageUrl: undefined,
    error: false,
  };

  constructor(props) {
    super(props);

    this.doLoadMore = this.doLoadMore.bind(this);
  }

  componentDidMount() {
    this.doLoadMore().then(
      () => { this.setState({ pending: false }); },
    );

    const { profileId, filter } = this.props;
    this.endpointUrl = (filter === 'profile')
      ? userStreamEndpoint({ profileId })
      : streamEndpoint({ filter });
  }

  doLoadMore() {
    const { nextPageUrl } = this.state;

    const url = nextPageUrl || this.endpointUrl;

    this.setState({
      error: false,
    });

    return Axios.get(url).then(({ next, posts }) => {
      const { posts: currentPosts } = this.state;
      if (posts === undefined) {
        throw new Error('Stream response missing "posts"');
      }

      this.setState({
        posts: currentPosts.concat(posts),
        nextPageUrl: next,
      });
    }).catch(() => {
      this.setState({
        error: true,
      });
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
};
