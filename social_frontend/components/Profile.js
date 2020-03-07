import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

import { userShape } from '../util/shapes';

import '../styles/profile.css';


/* Profile view: displays information and links related to a user.
 *
 * If the panel prop is set, appears as a floating side panel.
 * If the panel prop is unset, appears as a header.
 */
const Profile = ({
  panel,
  user: {
    id,
    displayName,
    friendCount,
    followingCount,
    followerCount,
  },
}) => {
  const HeaderMaybeLink = panel
    ? Link
    : ({ children }) => <>{children}</>;
  return (
    <aside className={panel ? 'profile-panel' : 'profile'}>
      <header className="profile-header">
        <HeaderMaybeLink to={`/profile/${id}`}>
          <img className="avatar" alt={id} />
          <h2 className="user-name">{displayName}</h2>
          <div className="user-id">{id}</div>
        </HeaderMaybeLink>
      </header>
      <nav className="profile-nav">
        {
          panel
            ? null
            : (
              <NavLink
                to={`/profile/${id}`}
                className="profile-link"
                activeClassName="selected"
              >
                Posts
              </NavLink>
            )
        }
        <NavLink
          to={`/profile/${id}/friends`}
          className="profile-link profile-stat"
          activeClassName="selected"
        >
          Friends
          <div className="profile-value">
            {friendCount.toLocaleString()}
          </div>
        </NavLink>
        <NavLink
          to={`/profile/${id}/following`}
          className="profile-link profile-stat"
          activeClassName="selected"
        >
          Following
          <div className="profile-value">
            {followingCount.toLocaleString()}
          </div>
        </NavLink>
        <NavLink
          to={`/profile/${id}/followers`}
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
  user: userShape.isRequired,
};

Profile.defaultProps = {
  panel: false,
};

export default Profile;
