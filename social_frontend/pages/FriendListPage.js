import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Profile from '../components/Profile';
import FriendList from '../components/FriendList';


import '../styles/friendlist.css';


const demoFriends = [
  {
    id: 'aaaaaa',
    displayName: 'Friend A',
  },
  {
    id: 'bbbbbb',
    displayName: 'Friend B',
  },
];


const FriendListPage = ({ currentUserId, profileId, mode }) => (
  <main className="main">
    <Profile id={currentUserId} />
    <FriendList
      mode={mode}
      members={demoFriends}
      isOwn={currentUserId === profileId}
    />
  </main>
);

FriendListPage.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf([
    'friends',
    'following',
    'followers',
  ]).isRequired,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
});

export default connect(mapStateToProps)(FriendListPage);
