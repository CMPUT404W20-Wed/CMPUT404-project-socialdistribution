import React from 'react';
import PropTypes from 'prop-types';


const Friend = ({
  user,
  actionLabel,
  status,
  actionCallback,
}) => {
  const { id, displayName } = user;

  return (
    <div className="user-card">
      <img alt={id} />
      <div className="user-name">{displayName}</div>
      {
        actionCallback && (
          <button type="button" onClick={() => actionCallback(user, status)}>
            {actionLabel}
          </button>
        )
      }
    </div>
  );
};

Friend.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string,
  }).isRequired,
  actionLabel: PropTypes.string,
  actionCallback: PropTypes.func,
  status: PropTypes.oneOf([
    'friend',
    'follower',
    'following',
  ]).isRequired,
};

Friend.defaultProps = {
  actionLabel: null,
  actionCallback: null,
};


const FriendList = ({
  mode,
  isOwn,
  members,
  actionCallback,
}) => {
  let actionLabel;
  let status;

  if (mode === 'friends') {
    status = 'friend';
    actionLabel = 'Unfriend';
  } else if (mode === 'followers') {
    status = 'follower';
    actionLabel = 'Friend';
  } else if (mode === 'following') {
    status = 'following';
    actionLabel = 'Unfollow';
  }

  return (
    <div className="user-list">
      {
        members.map((member) => (
          <Friend
            key={member.id}
            user={member}
            status={status}
            actionLabel={actionLabel}
            actionCallback={isOwn ? actionCallback : null}
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
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string,
  })).isRequired,
  actionCallback: PropTypes.func,
};

FriendList.defaultProps = {
  actionCallback: null,
};


export default FriendList;
