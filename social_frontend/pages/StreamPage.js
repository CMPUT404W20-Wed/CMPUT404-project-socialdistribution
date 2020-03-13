import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Post from '../components/post/Post';
import StreamLoader from '../components/StreamLoader';
import Profile from '../components/Profile';
import Editor from '../components/Editor';
import {
  streamEndpoint,
  submitPostEndpoint,
  userStreamEndpoint,
  singlePostEndpoint,
} from '../util/endpoints';


const filterToQueryMap = {
  all: 'public',
  following: 'following',
  related: 'foaf',
  friends: 'friends',
  personal: 'private',
};


/* Navigation bar for stream filters. */
const StreamFilterNav = () => (
  <nav className="stream-nav">
    <NavLink to="/" exact activeClassName="active">
      Public
    </NavLink>
    {/* <NavLink to="/following" activeClassName="active">
      Following
    </NavLink> */}
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
class StreamPage extends React.Component {
  state = {
    pushedPosts: [],
  };

  constructor(props) {
    super(props);

    this.afterSubmitPost = this.afterSubmitPost.bind(this);
  }

  afterSubmitPost(post) {
    const { pushedPosts: currentPushedPosts } = this.state;
    this.setState({
      pushedPosts: [post, ...currentPushedPosts],
    });
  }

  render() {
    const { currentUserId, profileId, filter } = this.props;
    const { pushedPosts } = this.state;

    const displayUserId = profileId || currentUserId;

    // Specify "stream" type for posts in the stream.
    // (This sets their appearance appropriately)
    const StreamPost = (props) => (
      /* (This is meant to be a transparent wrapper.) */
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <Post type="stream" {...props} />
    );

    const endpoint = (filter === 'profile')
      ? userStreamEndpoint(profileId)
      : streamEndpoint(filterToQueryMap[filter]);

    return (
      <main className="main">
        <Profile
          key={displayUserId}
          id={displayUserId}
          panel={profileId === null}
        />
        {
          profileId === null && (
            <>
              <Editor
                endpoint={submitPostEndpoint()}
                submittedCallback={this.afterSubmitPost}
              />
              <StreamFilterNav />
            </>
          )
        }
        <StreamLoader
          key={filter}
          pushedPosts={pushedPosts}
          getEndpoint={endpoint}
          itemEndpointPattern={singlePostEndpoint}
          PostComponent={StreamPost}
        />
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
  currentUserId: PropTypes.string,
  profileId: PropTypes.string,
};

StreamPage.defaultProps = {
  filter: 'all',
  currentUserId: null,
  profileId: null,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
});

export default connect(mapStateToProps)(StreamPage);
