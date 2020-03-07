import React from 'react';

import { setup } from './testUtils';

import Profile from '../components/Profile';


/* Tests for components/Profile */

const mockUser = {
  id: 'example.user@example.net',
  displayName: 'Example User',
  friendCount: 0,
  followingCount: 1,
  followerCount: 12345,
};


const domTest = setup('Profile');


domTest(
  'renders information about the user',
  <Profile user={mockUser} />,
  ($) => {
    // User name
    expect($('h2.user-name').textContent)
      .toEqual('Example User');

    // User ID
    expect($('.user-id').textContent)
      .toEqual('example.user@example.net');

    // Avatar
    expect($('img.avatar').alt)
      .toEqual('example.user@example.net');

    // Friend count
    expect($('.friend-count').href)
      .toEqual('http://localhost/profile/example.user@example.net/friends');
    expect($('.friend-count .profile-value').textContent)
      .toEqual('0');

    // Following count
    expect($('.following-count').href)
      .toEqual('http://localhost/profile/example.user@example.net/following');
    expect($('.following-count .profile-value').textContent)
      .toEqual('1');

    // Follower count
    expect($('.follower-count').href)
      .toEqual('http://localhost/profile/example.user@example.net/followers');
    expect($('.follower-count .profile-value').textContent)
      .toEqual('12,345');
  }
);


domTest(
  'can render as a side panel',
  <Profile user={mockUser} panel />,
  ($) => {
    // Has class 'profile-panel', not 'profile'
    expect($('.profile-panel'))
      .toBeDefined();
    expect($('.profile'))
      .toBeNull();

    // No "posts" link
    expect($('.posts-link'))
      .toBeNull();

    // Header links to profile
    expect($('.profile-panel a').href)
      .toEqual('http://localhost/profile/example.user@example.net');
  }
);


domTest(
  'can render as a header',
  <Profile user={mockUser} />,
  ($) => {
    // Has class 'profile', not 'profile-panel'
    expect($('.profile-panel'))
      .toBeNull();
    expect($('.profile'))
      .toBeDefined();

    // Has "posts" link
    expect($('.posts-link').href)
      .toEqual('http://localhost/profile/example.user@example.net');

    // Header doesn't link to profile
    expect($('.profile-panel a'))
      .toBeNull();
  }
);
