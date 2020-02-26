import React from 'react';

import Stream from '../stream/Stream';
import ProfilePanel from './ProfilePanel';


// Page body containing stream and profile block.
const StreamPage = () => (
  <main className="main">
    <ProfilePanel user="DemoUserID" />
    <Stream />
  </main>
);

export default StreamPage;
