
// TODO remove trailing slashes

export const streamEndpoint = (filter) => (
  `/api/author/posts/?filter=${filter}`
);

export const userStreamEndpoint = (author) => (
  `/api/author/${author}/posts/`
);

export const profileEndpoint = (user) => `/api/author/${user}/`;

export const submitPostEndpoint = () => '/api/author/posts/';

export const singlePostEndpoint = (post) => `/api/posts/${post}/`;

export const commentsEndpoint = (post) => `/api/posts/${post}/comments/`;

export const submitCommentEndpoint = (post) => `/api/posts/${post}/comments/`;

export const singleCommentEndpoint = (post, comment) => (
  `/api/posts/${post}/comments/${comment}`
);

export const followingEndpoint = (user) => `/api/author/${user}/following/`;

export const mutualFriendsEndpoint = (user) => (
  `/api/author/${user}/friends/`
);

export const followersEndpoint = (user) => (
  `/api/author/${user}/followers/`
);

export const friendRequestEndpoint = () => (
  '/api/friendrequest/'
);

export const friendshipEndpoint = (follower, target) => (
  `/api/author/${follower}/friends/${target}/`
);

export const userSearchEndpoint = (query) => (
  `/api/user-search?q=${query}`
);

export const imageAbsoluteURL = (origin, id, ext) => (
  `${origin}/api/media/${id}.${ext}`
);

export const imagePortalEndpoint = (url) => (
  `/api/media-redirect/${window.encodeURIComponent(url)}`
);

export const loginEndpoint = () => (
  '/api/login/'
);

export const registerEndpoint = () => (
  '/api/register/'
);

export const logoutEndpoint = () => (
  '/api/logout/'
);

export const loggedInUserEndpoint = () => (
  '/api/login/'
);

export const triggerGithubEndpoint = (id) => (
  `/api/author/${id}/github/`
);
