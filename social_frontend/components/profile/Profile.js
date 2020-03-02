import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

import './profile.css';


/* Floating profile panel that appears to the left on the "home" view. */
const Profile = ({
  panel,
  userId,
  userDisplayName,
  friendCount,
  followingCount,
  followerCount,
}) => {
  const HeaderMaybeLink = panel
    ? Link
    : ({ children }) => <>{children}</>;
  return (
    <aside className={panel ? 'profile-panel' : 'profile'}>
      <header className="profile-header">
        <HeaderMaybeLink to={`/profile/${userId}`}>
          <img className="avatar" alt={userId} />
          <h2 className="user-name">{userDisplayName}</h2>
          <div className="user-id">{userId}</div>
        </HeaderMaybeLink>
      </header>
      <nav className="profile-nav">
        {
          panel
            ? null
            : (
              <NavLink
                to={`/profile/${userId}`}
                className="profile-link"
                activeClassName="selected"
              >
                Posts
              </NavLink>
            )
        }
        <NavLink
          to={`/profile/${userId}/friends`}
          className="profile-link profile-stat"
          activeClassName="selected"
        >
          Friends
          <div className="profile-value">
            {friendCount.toLocaleString()}
          </div>
        </NavLink>
        <NavLink
          to={`/profile/${userId}/following`}
          className="profile-link profile-stat"
          activeClassName="selected"
        >
          Following
          <div className="profile-value">
            {followingCount.toLocaleString()}
          </div>
        </NavLink>
        <NavLink
          to={`/profile/${userId}/followers`}
          className="profile-link profile-stat"
          activeClassName="selected"
        >
          Followers
          <div className="profile-value">
            {followerCount.toLocaleString()}
          </div>
        </NavLink>
      </nav>
    </aside>
  );
};

Profile.propTypes = {
  panel: PropTypes.bool,
  userDisplayName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  friendCount: PropTypes.number.isRequired,
  followingCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
};

Profile.defaultProps = {
  panel: false,
};

export default Profile;
