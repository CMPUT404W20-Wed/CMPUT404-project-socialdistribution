import React from 'react';

import Stream from '../stream/Stream';
import ProfilePanel from './ProfilePanel';
import PostForm from './PostForm';


// Page body containing stream and profile block.
const StreamPage = () => (
  <main className="main">
    <ProfilePanel user="DemoUserID" />
    <PostForm />
    <Stream />
  </main>
);

export default StreamPage;
