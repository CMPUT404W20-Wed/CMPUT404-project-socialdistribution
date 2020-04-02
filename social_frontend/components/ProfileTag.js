import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { profileEndpoint } from '../util/endpoints';
import aidToUuid from '../util/aidToUuid';

export default class ProfileTag extends React.Component {
  state = {
    profile: null,
  };

  componentDidMount() {
    const { id } = this.props;
    if (id !== null) this.doLoadProfile(id);
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

  render() {
    const { id } = this.props;
    const { profile } = this.state;
    const displayName = profile?.displayName;

    return (
      <div className="user-tag">
        <img className="avatar" alt={id} />
        <div className="user-tag-name">{displayName}</div>
      </div>
    );
  }
}
