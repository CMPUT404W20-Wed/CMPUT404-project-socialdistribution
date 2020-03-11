import React from 'react';
import PropTypes from 'prop-types';

import { userShape } from '../util/shapes';


const Friend = ({ user, actionLabel, onAction }) => {
  const { id, displayName } = user;
  return (
    <div className="user-card">
      <img alt={id} />
      <div className="user-name">{displayName}</div>
      {
        actionLabel && (
          <button type="button" onClick={() => onAction(user)}>
            {actionLabel}
          </button>
        )
      }
    </div>
  );
};

Friend.propTypes = {
  user: userShape.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

Friend.defaultProps = {
  actionLabel: null,
  onAction: null,
};


const FriendList = ({
  mode,
  isOwn,
  members,
  onAction,
}) => {
  let actionLabel;
  if (mode === 'friends') actionLabel = 'Unfriend';
  else if (mode === 'followers') actionLabel = 'Friend';
  else if (mode === 'following') actionLabel = 'Unfollow';
  return (
    <div className="user-list">
      {
        members.map((member) => (
          <Friend
            key={member.id}
            user={member}
            actionLabel={actionLabel}
            onAction={isOwn ? onAction : null}
          />
        ))
      }
    </div>
  );
};

FriendList.propTypes = {
  mode: PropTypes.oneOf([
    'friends',
    'following',
    'followers',
  ]).isRequired,
  isOwn: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(userShape).isRequired,
  onAction: PropTypes.func,
};

FriendList.defaultProps = {
  onAction: null,
};


export default FriendList;
