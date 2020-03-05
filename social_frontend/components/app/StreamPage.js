import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Stream from '../stream/Stream';
import Post from '../post/Post';
import Profile from '../profile/Profile';
import PostForm from './PostForm';
import { userShape, postShape } from '../shapes';


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
 */
const StreamPage = ({ /* filter, */ profileId, sessionUser }) => {
  const displayUser = sessionUser; // TODO user from profileId || sessionUser
  const StreamPost = ({ post }) => (
    <Post type="stream" post={post} sessionUser={sessionUser} />
  );

  StreamPost.propTypes = { post: postShape.isRequired };

  return (
    <main className="main">
      <Profile user={displayUser} panel={profileId === null} />
      {
        profileId === null && (
          <>
            <PostForm />
            <StreamFilterNav />
          </>
        )
      }
      <Stream sessionUser={sessionUser} PostComponent={StreamPost} />
    </main>
  );
};

StreamPage.propTypes = {
  // filter: PropTypes.string.isRequired,
  profileId: PropTypes.string,
  sessionUser: userShape.isRequired,
};

StreamPage.defaultProps = {
  profileId: null,
};

export default StreamPage;
