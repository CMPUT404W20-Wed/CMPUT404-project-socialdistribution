import React from 'react';

import Stream from '../stream/Stream';

// TODO placeholder for profile block.
const Profile = () => <div className="profile">Profile</div>;


// Page body containing stream and profile block.
const StreamPage = () => (
  <main className="main">
    <Profile />
    <Stream />
  </main>
);

export default StreamPage;
