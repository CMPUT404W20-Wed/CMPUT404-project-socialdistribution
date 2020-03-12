import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { connect } from 'react-redux';

import FriendList from './FriendList';
import {
  mutualFriendsEndpoint,
  followingEndpoint,
  followersEndpoint,
} from '../util/endpoints';


class FriendListLoader extends React.Component {
  state = {
    friends: [],
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
        if (friends !== undefined) {
          this.setState({ friends });
        }
      },
    ).catch((error) => {
      // TODO
      console.log('Failed to load friends list:');
      console.log(error);
    });
  }

  doFriendAction(friend) {
    // TODO
    console.log(this, friend);
  }

  render() {
    const { currentUserId, profileId, mode } = this.props;
    const { friends } = this.state;
    return (
      <FriendList
        mode={mode}
        members={friends}
        isOwn={currentUserId === profileId}
        actionCallback={this.doFriendAction}
      />
    );
  }
}

FriendListLoader.propTypes = {
  currentUserId: PropTypes.string,
  profileId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf([
    'friends',
    'following',
    'followers',
  ]).isRequired,
};

FriendListLoader.defaultProps = {
  currentUserId: null,
};

const mapStateToProps = (state) => ({
  currentUserId: state.id,
});

export default connect(mapStateToProps)(FriendListLoader);
