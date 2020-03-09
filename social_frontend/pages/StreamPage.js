import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Axios from 'axios';

import Stream from '../components/Stream';
import Post from '../components/post/Post';
import Profile from '../components/Profile';
import Editor from '../components/Editor';
import Suspender from '../components/common/suspend/Suspender';
import { userShape, postShape } from '../util/shapes';
import {
  streamEndpoint,
  userStreamEndpoint,
  profileEndpoint,
} from '../util/endpoints';


/* Navigation bar for stream filters. */
const StreamFilterNav = () => (
  <nav className="stream-nav">
    <NavLink to="/" exact activeClassName="active">
      Everything
    </NavLink>
    <NavLink to="/following" activeClassName="active">
      Following
    </NavLink>
    <NavLink to="/related" activeClassName="active">
      Related
    </NavLink>
    <NavLink to="/friends" activeClassName="active">
      Friends
    </NavLink>
    <NavLink to="/personal" activeClassName="active">
      Personal
    </NavLink>
  </nav>
);


/* Page body, potentially containing a profile panel, post form, and stream.
 * This is an abstraction over all kinds of stream pages: browsing, profiles,
 * and possibly others.
 *
 * If profileId is set, displays profile page for that id
 * Otherwise if filter is set, display posts matching the filter
 */
export default class StreamPage extends React.Component {
  state = {
    posts: [],
    nextPageUrl: undefined,
    profile: null,
    postsPending: true,
    error: false,
    profileError: false,
  };

  constructor(props) {
    super(props);

    this.doLoadMore = this.doLoadMore.bind(this);
  }

  componentDidMount() {
    const { profileId, filter } = this.props;
    this.endpointUrl = (filter === 'profile')
      ? userStreamEndpoint({ profileId })
      : streamEndpoint({ filter });

    this.doLoadMore().then(
      () => { this.setState({ postsPending: false }); },
    );

    if (profileId !== null) {
      this.doLoadProfile(profileId);
    }
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

  doLoadProfile(id) {
    const url = profileEndpoint(id);

    this.setState({
      profileError: false,
    });

    return Axios.get(url).then((profile) => {
      this.setState({ profile });
    }).catch(() => {
      this.setState({
        profileError: true,
      });
    });
  }

  handleSubmitPost(post) {
    const { posts: currentPosts } = this.state;

    this.setState({
      posts: [post].concat(currentPosts),
    });
  }

  render() {
    const { sessionUser, profileId } = this.props;
    const {
      posts,
      postsPending,
      nextPageUrl,
      error,
      profileError,
      profile: loadedProfile,
    } = this.state;

    const displayUser = profileId ? loadedProfile : sessionUser;

    // Specify "stream" type for posts in the stream.
    // (This sets their appearance appropriately)
    const StreamPost = ({ post }) => (
      <Post type="stream" post={post} sessionUser={sessionUser} />
    );

    StreamPost.propTypes = { post: postShape.isRequired };

    return (
      <main className="main">
        {
          (profileId !== null && loadedProfile === null)
            ? <div className="profile profile-placeholder"><Suspender /></div>
            : (
              <Profile
                user={displayUser}
                panel={profileId === null}
                isError={profileError}
              />
            )
        }
        {
          profileId === null && (
            <>
              <Editor submittedCallback={this.handleSubmitPost} />
              <StreamFilterNav />
            </>
          )
        }
        {
          postsPending
            ? <div className="stream-placeholder"><Suspender /></div>
            : (
              <Stream
                PostComponent={StreamPost}
                posts={posts}
                hasMore={nextPageUrl !== undefined}
                hasError={error}
                loadMoreCallback={this.doLoadMore}
              />
            )
        }
      </main>
    );
  }
}

StreamPage.propTypes = {
  filter: PropTypes.oneOf([
    'all',
    'related',
    'friends',
    'following',
    'personal',
    'profile',
  ]),
  profileId: PropTypes.string,
  sessionUser: userShape.isRequired,
};

StreamPage.defaultProps = {
  filter: 'all',
  profileId: null,
};
