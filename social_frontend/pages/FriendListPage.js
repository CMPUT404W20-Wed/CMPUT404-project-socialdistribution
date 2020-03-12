import React from 'react';
import PropTypes from 'prop-types';

import Profile from '../components/Profile';
import FriendListLoader from '../components/FriendListLoader';

import '../styles/friendlist.css';


const FriendListPage = ({ profileId, mode }) => (
  <main className="main">
    <Profile id={profileId} />
    <FriendListLoader
      key={`${profileId}/${mode}`}
      profileId={profileId}
      mode={mode}
    />
  </main>
);

FriendListPage.propTypes = {
  profileId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf([
    'friends',
    'following',
    'followers',
  ]).isRequired,
};

export default FriendListPage;
