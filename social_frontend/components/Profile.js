import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Suspender from './common/suspend/Suspender';
import safeFormat from '../util/safeFormat';
import aidToUuid from '../util/aidToUuid';
import { listen, removeListener } from '../util/broadcast';
import {
  profileEndpoint,
  friendRequestEndpoint,
  friendshipEndpoint,
} from '../util/endpoints';

import '../styles/profile.css';


/* Profile view: displays information and links related to a user.
 *
 * If the panel prop is set, appears as a floating side panel.
 * If the panel prop is unset, appears as a header.
 */
class Profile extends React.Component {
  state = {
    profile: null,
  };

  constructor(props) {
    super(props);

    this.doFriendAction = this.doFriendAction.bind(this);
    this.handleProfileDirty = this.handleProfileDirty.bind(this);
  }

  componentDidMount() {
    const { id } = this.props;
    if (id !== null) this.doLoadProfile(id);

    this.listener = listen('profileDirty', this.handleProfileDirty);
  }

  componentWillUnmount() {
    removeListener('profileDirty', this.listener);
  }

  handleProfileDirty(dirtyId) {
    const { id } = this.props;
    if (id === dirtyId) this.doLoadProfile(id);
  }

  doLoadProfile(id) {
    return Axios.get(profileEndpoint(id)).then(({ data: profile }) => {
      this.setState({
        profile: {
          id: aidToUuid(profile.id),
          ...profile,
        },
      });
    }).catch((error) => {
      // TODO error?
      console.log('Failed to load profile:');
      console.log(error);
    });
  }

  doFriendAction(status) {
    const { id, currentUserId, currentUserName } = this.props;

    if (status === 'stranger' || status === 'follower') {
      const {
        profile: {
          host,
          displayName,
          url,
        },
      } = this.state;
      const body = {
        query: 'friendrequest',
        author: {
          id: currentUserId,
          host: document.location.origin,
          displayName: currentUserName,
          url: document.location.origin + profileEndpoint(currentUserId),
        },
        friend: {
          id,
          host,
          displayName,
          url,
        },
      };

      Axios.post(friendRequestEndpoint(id), body).then(() => {
        this.doLoadProfile(id);
      });
    } else if (status === 'following' || status === 'friend') {
      Axios.delete(friendshipEndpoint(currentUserId, id)).then(() => {
        this.doLoadProfile(id);
      });
    }
  }

  render() {
    const { id, panel, currentUserId } = this.props;
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
      friends,
      following,
      followers,
    } = profile;

    // TODO this can probably be done better
    const friendIds = friends.map(({ id: fid }) => aidToUuid(fid));

    let friendLabel;
    let friendActionLabel;
    let friendClass;
    if (friendIds && friendIds.indexOf(currentUserId) >= 0) {
      friendLabel = 'Friend';
      friendActionLabel = 'Unfriend';
      friendClass = 'friend';
    } else if (following && following.indexOf(currentUserId) >= 0) {
      friendLabel = 'Follower';
      friendActionLabel = 'Friend';
      friendClass = 'follower';
    } else if (followers && followers.indexOf(currentUserId) >= 0) {
      friendLabel = 'Following';
      friendActionLabel = 'Unfollow';
      friendClass = 'following';
    } else {
      friendLabel = 'Follow';
      friendActionLabel = 'Follow';
      friendClass = 'stranger';
    }

    const HeaderMaybeLink = panel
      ? Link
      : ({ children }) => <>{children}</>;

    return (
      <aside className={className}>
        <header className="profile-header">
          <HeaderMaybeLink to={`/profile/${id}`}>
            <img className="avatar" alt={id} />
            <h2 className="user-name">{displayName}</h2>
            {/* <div className="user-id">{id}</div> */}
          </HeaderMaybeLink>
          {
            !(panel || id === currentUserId) && (
              <button
                type="button"
                title={friendActionLabel}
                className={`friend-action ${friendClass}`}
                onClick={() => this.doFriendAction(friendClass)}
              >
                {friendLabel}
              </button>
            )
          }
        </header>
        <nav className="profile-nav">
          {
            panel
              ? null
              : (
                <NavLink
                  exact
                  to={`/profile/${id}`}
                  className="profile-link profile-stat"
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
              {safeFormat(friends && friends.length)}
            </div>
          </NavLink>
          <NavLink
            to={`/profile/${id}/following`}
            className="profile-link profile-stat"
            activeClassName="selected"
          >
            Following
            <div className="profile-value">
              {safeFormat(following && following.length)}
            </div>
          </NavLink>
          <NavLink
            to={`/profile/${id}/followers`}
            className="profile-link profile-stat"
            activeClassName="selected"
          >
            Followers
            <div className="profile-value">
              {safeFormat(followers && followers.length)}
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
  currentUserId: PropTypes.string,
  currentUserName: PropTypes.string,
};

Profile.defaultProps = {
  panel: false,
  id: null,
  currentUserId: null,
  currentUserName: null,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
  currentUserName: state.username,
});

export default connect(mapStateToProps)(Profile);
