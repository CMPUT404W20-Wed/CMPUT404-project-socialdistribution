import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { connect } from 'react-redux';

import FriendList from './FriendList';
import {
  mutualFriendsEndpoint,
  followingEndpoint,
  followersEndpoint,
  profileEndpoint,
  friendshipEndpoint,
  friendRequestEndpoint,
} from '../util/endpoints';


class FriendListLoader extends React.Component {
  state = {
    friends: [],
    friendProfiles: [],
  };

  constructor(props) {
    super(props);

    this.doFriendAction = this.doFriendAction.bind(this);
  }

  componentDidMount() {
    this.doLoadFriends();
  }

  doLoadFriends() {
    const { profileId, mode } = this.props;

    let endpoint;
    if (mode === 'friends') endpoint = mutualFriendsEndpoint;
    else if (mode === 'following') endpoint = followingEndpoint;
    else if (mode === 'followers') endpoint = followersEndpoint;

    Axios.get(endpoint(profileId)).then(
      ({ data: { authors: friends } }) => {
        const parsedFriends = friends.map(
          (url) => url.split('/').slice(-1)[0],
        );

        this.setState({ friends: parsedFriends });

        parsedFriends.map((friendId) => (
          Axios.get(profileEndpoint(friendId)).then(
            ({ data }) => {
              const { friendProfiles } = this.state;
              this.setState({
                friendProfiles: {
                  ...friendProfiles,
                  [friendId]: data,
                },
              });
            },
          )
        ));
      },
    ).catch((error) => {
      // TODO
      console.log('Failed to load friends list:');
      console.log(error);
    });
  }

  doFriendAction(friend, status) {
    const { currentUserId, currentUserName } = this.props;
    const {
      id: friendId,
      host,
      displayName,
      url,
    } = friend;

    if (status === 'stranger' || status === 'follower') {
      const body = {
        query: 'friendrequest',
        author: {
          id: currentUserId,
          host: document.location.origin,
          displayName: currentUserName,
          url: document.location.origin + profileEndpoint(currentUserId),
        },
        friend: {
          friendId,
          host,
          displayName,
          url,
        },
      };

      Axios.post(friendRequestEndpoint(friendId), body).then(() => {
        const { friends } = this.state;
        this.setState({
          friends: friends.filter((x) => x !== friendId),
        });
      });
    } else if (status === 'following' || status === 'friend') {
      Axios.delete(friendshipEndpoint(currentUserId, friendId)).then(() => {
        const { friends } = this.state;
        this.setState({
          friends: friends.filter((x) => x !== friendId),
        });
      });
    }
  }

  render() {
    const { currentUserId, profileId, mode } = this.props;
    const { friends, friendProfiles } = this.state;
    const mappedFriends = friends.map(
      (friendId) => (
        { ...friendProfiles[friendId], id: friendId } ?? { id: friendId }),
    );

    return (
      <FriendList
        mode={mode}
        members={mappedFriends}
        isOwn={currentUserId === profileId}
        actionCallback={this.doFriendAction}
      />
    );
  }
}

FriendListLoader.propTypes = {
  currentUserId: PropTypes.string,
  currentUserName: PropTypes.string,
  profileId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf([
    'friends',
    'following',
    'followers',
  ]).isRequired,
};

FriendListLoader.defaultProps = {
  currentUserId: null,
  currentUserName: null,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
  currentUserName: state.username,
});

export default connect(mapStateToProps)(FriendListLoader);
