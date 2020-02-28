import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './profilepanel.css';


/* Floating profile panel that appears to the left on the "home" view. */
const ProfilePanel = ({
  userDisplayName,
  userId,
  friendCount,
  followingCount,
  followerCount,
}) => (
  <aside className="profile">
    <header className="profile-header">
      <img className="avatar" alt={userId} />
      <h2 className="user-name">{userDisplayName}</h2>
      <div className="user-id">{userId}</div>
    </header>
    <Link to="/friends" className="profile-stat">
      Friends
      <div className="profile-value">
        {friendCount.toLocaleString()}
      </div>
    </Link>
    <Link to="/following" className="profile-stat">
      Following
      <div className="profile-value">
        {followingCount.toLocaleString()}
      </div>
    </Link>
    <Link to="/followers" className="profile-stat">
      Followers
      <div className="profile-value">
        {followerCount.toLocaleString()}
      </div>
    </Link>
  </aside>
);

ProfilePanel.propTypes = {
  userDisplayName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  friendCount: PropTypes.number.isRequired,
  followingCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
};

export default ProfilePanel;
