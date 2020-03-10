import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

import Suspender from './common/suspend/Suspender';

import '../styles/profile.css';


/* Profile view: displays information and links related to a user.
 *
 * If the panel prop is set, appears as a floating side panel.
 * If the panel prop is unset, appears as a header.
 */
export default class Profile extends React.Component {
  state = {
    profile: null,
  };

  componentDidMount() {
    const { id } = this.props;
    this.doLoadProfile(id);
  }

  doLoadProfile(id) {
    // TODO loader placeholder
    return new Promise(
      (resolve) => {
        window.setTimeout(
          () => {
            this.setState({
              profile: {
                id,
                displayName: 'Profile User',
                friendCount: 4,
                followerCount: 12,
                followingCount: 1234,
              },
            });
            resolve();
          },
          1000,
        );
      },
    );
  }

  render() {
    const { id, panel } = this.props;
    const { profile } = this.state;

    const className = panel ? 'profile-panel' : 'profile';

    if (profile === null) {
      return (
        <div className={`${className} profile-placeholder`}>
          <Suspender />
        </div>
      );
    }

    const {
      displayName,
      friendCount,
      followingCount,
      followerCount,
    } = profile;

    const HeaderMaybeLink = panel
      ? Link
      : ({ children }) => <>{children}</>;
    return (
      <aside className={className}>
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
  }
}

Profile.propTypes = {
  panel: PropTypes.bool,
  id: PropTypes.string,
};

Profile.defaultProps = {
  panel: false,
  id: null,
};
