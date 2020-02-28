import React from 'react';
import { NavLink } from 'react-router-dom';

import Stream from '../stream/Stream';
import ProfilePanel from './ProfilePanel';
import PostForm from './PostForm';

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
const StreamPage = () => (
  <main className="main">
    <ProfilePanel
      userDisplayName="DemoUser"
      userId="demo.user@example.net"
      friendCount={10}
      followingCount={1}
      followerCount={1294}
    />
    <PostForm />
    <StreamFilterNav />
    <Stream />
  </main>
);

export default StreamPage;
