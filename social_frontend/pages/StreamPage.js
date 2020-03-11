import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Post from '../components/post/Post';
import StreamLoader from '../components/StreamLoader';
import Profile from '../components/Profile';
import Editor from '../components/Editor';
import { postShape } from '../util/shapes';
import {
  streamEndpoint,
  userStreamEndpoint,
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
const StreamPage = ({ currentUserId, profileId, filter }) => {
  const displayUserId = profileId || currentUserId;

  // Specify "stream" type for posts in the stream.
  // (This sets their appearance appropriately)
  const StreamPost = ({ post }) => (
    <Post type="stream" post={post} />
  );

  StreamPost.propTypes = { post: postShape.isRequired };

  const endpoint = (filter === 'profile')
    ? userStreamEndpoint(profileId)
    : streamEndpoint(filter);

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
            <Editor />
            <StreamFilterNav />
          </>
        )
      }
      <StreamLoader
        key={filter}
        endpoint={endpoint}
        PostComponent={StreamPost}
      />
    </main>
  );
};

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
