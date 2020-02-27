import React from 'react';

import Stream from '../stream/Stream';
import ProfilePanel from './ProfilePanel';
import PostForm from './PostForm';


/* Page body, potentially containing a profile panel, post form, and stream.
 * This is an abstraction over all kinds of stream pages: browsing, profiles,
 * and possibly others.
 */
const StreamPage = () => (
  <main className="main">
    <ProfilePanel user="DemoUserID" />
    <PostForm />
    <Stream />
  </main>
);

export default StreamPage;
