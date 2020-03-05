import React from 'react';
import PropTypes from 'prop-types';

import SuspensefulSubmit from '../suspend/SuspensefulSubmit';
import { postShape } from '../shapes';

import './stream.css';


/* Stream is a list of posts.
 * The list of posts is displayed linearly.
 *
 * The PostComponent prop determines the component used to render each post.
 * Each instance will be passed the prop 'post' containing the post to render.
 */
export default class Stream extends React.Component {
  state = {
    pending: false,
  };

  constructor(props) {
    super(props);

    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleLoadMore(event) {
    event.preventDefault();
    const { loadMoreCallback } = this.props;
    this.setState({ pending: true });
    loadMoreCallback().then(() => {
      this.setState({ pending: false });
    });
  }

  render() {
    const { PostComponent, posts, hasMore } = this.props;
    const { pending } = this.state;
    return (
      <div className="stream">
        {posts.map((post) => <PostComponent key={post.id} post={post} />)}
        {
          hasMore && (
            <form className="load-more" onSubmit={this.handleLoadMore}>
              <SuspensefulSubmit
                label="Load more"
                suspended={pending}
              />
            </form>
          )
        }
      </div>
    );
  }
}

Stream.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
  posts: PropTypes.arrayOf(postShape).isRequired,
  hasMore: PropTypes.bool,
  loadMoreCallback: PropTypes.func.isRequired,
};

Stream.defaultProps = {
  hasMore: false,
};
