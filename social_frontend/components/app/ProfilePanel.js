import React from 'react';

import PropTypes from 'prop-types';

import './profilepanel.css';


/* Floating profile panel that appears to the left on the "home" view. */
const ProfilePanel = ({ user }) => (
  <aside className="profile">
    <header className="profile-header">
      <img className="avatar" alt={user} />
      <h2 className="user-name">{user}</h2>
    </header>
    <div className="placeholder">
      Placeholder
    </div>
  </aside>
);

ProfilePanel.propTypes = {
  user: PropTypes.string.isRequired,
};

export default ProfilePanel;
