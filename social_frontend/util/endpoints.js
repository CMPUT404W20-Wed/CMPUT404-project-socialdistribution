
// TODO remove trailing slashes

export const streamEndpoint = () => '/api/author/posts/';

export const userStreamEndpoint = (author) => (
  `/api/author/${author}/posts/`
);

export const profileEndpoint = (user) => `/api/author/${user}/`;

export const submitPostEndpoint = () => '/api/author/posts/';

export const singlePostEndpoint = (post) => `/api/posts/${post}/`;

export const commentsEndpoint = (post) => `/api/posts/${post}/comments/`;

export const submitCommentEndpoint = (post) => `/api/posts/${post}/comments/`;

export const singleCommentEndpoint = (post, comment) => (
  `/api/posts/${post}/comments/${comment}/`
);
