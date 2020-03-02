import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Stream from '../stream/Stream';
import Profile from '../profile/Profile';
import PostForm from './PostForm';


/* Navigation bar for stream filters. */
const StreamFilterNav = () => (
  <nav className="stream-nav">
    <NavLink to="/stream/all" exact activeClassName="active">
      Everything
    </NavLink>
    <NavLink to="/stream/following" activeClassName="active">
      Following
    </NavLink>
    <NavLink to="/stream/related" activeClassName="active">
      Related
    </NavLink>
    <NavLink to="/stream/friends" activeClassName="active">
      Friends
    </NavLink>
    <NavLink to="/stream/personal" activeClassName="active">
      Personal
    </NavLink>
  </nav>
);


/* Page body, potentially containing a profile panel, post form, and stream.
 * This is an abstraction over all kinds of stream pages: browsing, profiles,
 * and possibly others.
 */
const StreamPage = ({ /* filter, */ profileId }) => (
  <main className="main">
    <Profile
      panel={profileId === null}
      userId={profileId === null ? 'demo.user@example.net' : profileId}
      userDisplayName="DemoUser"
      friendCount={10}
      followingCount={1}
      followerCount={1294}
    />
    {
      profileId === null
        ? (
          <>
            <PostForm />
            <StreamFilterNav />
          </>
        )
        : null
    }
    <Stream />
  </main>
);

StreamPage.propTypes = {
  // filter: PropTypes.string.isRequired,
  profileId: PropTypes.string,
};

StreamPage.defaultProps = {
  profileId: null,
};

export default StreamPage;
