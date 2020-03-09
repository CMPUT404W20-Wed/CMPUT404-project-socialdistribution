
export const streamEndpoint = () => '/api/author/posts';

export const userStreamEndpoint = ({ author }) => (
  `/api/author/${author}/posts`
);

export const profileEndpoint = ({ user }) => `/api/author/${user}`;

// TODO should this be `/api/author/posts`?
export const submitPostEndpoint = () => '/api/posts/';
