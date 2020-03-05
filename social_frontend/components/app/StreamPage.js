import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Stream from '../stream/Stream';
import Post from '../post/Post';
import Profile from '../profile/Profile';
import PostForm from '../postform/PostForm';
import Suspender from '../suspend/Suspender';
import { userShape, postShape } from '../shapes';

const demoPosts = [
  {
    id: '0',
    author: {
      id: 'author1@example.net',
      displayName: 'Author 1',
    },
    content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
    commentCount: 0,
  },
  {
    id: '1',
    author: {
      id: 'author2@example.net',
      displayName: 'Author 2',
    },
    content: 'So what I think is going on here is actually nothing in particular.',
    commentCount: 13,
  },
  {
    id: '2',
    author: {
      id: 'author3@example.net',
      displayName: 'Author 3',
    },
    content: 'Post 3',
    commentCount: 1,
  },
  {
    id: '3',
    author: {
      id: 'author4@example.net',
      displayName: 'Author 4',
    },
    content: 'Post 4',
    commentCount: 0,
  },
  {
    id: '4',
    author: {
      id: 'author5@example.net',
      displayName: 'Author 5',
    },
    content: 'Post 5',
    commentCount: 0,
  },
  {
    id: '5',
    author: {
      id: 'author1@example.net',
      displayName: 'Author 1',
    },
    content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
    commentCount: 5,
  },
  {
    id: '6',
    author: {
      id: 'author2@example.net',
      displayName: 'Author 2',
    },
    content: 'So what I think is going on here is actually nothing in particular. This post, by the way, has an ID of 6, but it\'s actually the seventh post on the page, because that\'s how indexing works.',
    commentCount: 0,
  },
  {
    id: '7',
    author: {
      id: 'author1@example.net',
      displayName: 'Author 1',
    },
    content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
    commentCount: 1012,
  },
];

/* Navigation bar for stream filters. */
const StreamFilterNav = () => (
  <nav className="stream-nav">
    <NavLink to="/" exact activeClassName="active">
      Everything
    </NavLink>
    <NavLink to="/following" activeClassName="active">
      Following
    </NavLink>
    <NavLink to="/related" activeClassName="active">
      Related
    </NavLink>
    <NavLink to="/friends" activeClassName="active">
      Friends
    </NavLink>
    <NavLink to="/personal" activeClassName="active">
      Personal
    </NavLink>
  </nav>
);


/* Page body, potentially containing a profile panel, post form, and stream.
 * This is an abstraction over all kinds of stream pages: browsing, profiles,
 * and possibly others.
 *
 * If profileId is set, displays profile page for that id
 * Otherwise if filter is set, display posts matching the filter
 */
export default class StreamPage extends React.Component {
  state = {
    posts: [],
    profile: null,
    postsPending: true,
  };

  constructor(props) {
    super(props);

    this.doLoadMore = this.doLoadMore.bind(this);
  }

  componentDidMount() {
    this.doLoadMore().then(
      () => { this.setState({ postsPending: false }); },
    );

    const { profileId } = this.props;
    if (profileId !== null) {
      this.doLoadProfile(profileId);
    }
  }

  doLoadMore() {
    // TODO loader placeholder
    return new Promise(
      (resolve) => {
        window.setTimeout(
          () => {
            const posts = demoPosts;
            const { posts: currentPosts } = this.state;
            this.setState({
              posts: currentPosts.concat(posts),
            });
            resolve();
          },
          1000,
        );
      },
    );
  }

  doLoadProfile(id) {
    // TODO loader placeholder
    return new Promise(
      (resolve) => {
        window.setTimeout(
          () => {
            this.setState({
              profile: {
                id,
                displayName: 'Profile User',
                friendCount: 4,
                followerCount: 12,
                followingCount: 1234,
              },
            });
            resolve();
          },
          1000,
        );
      },
    );
  }

  render() {
    const { sessionUser, profileId } = this.props;
    const { posts, postsPending, profile: loadedProfile } = this.state;

    const displayUser = profileId ? loadedProfile : sessionUser;

    // Specify "stream" type for posts in the stream.
    // (This sets their appearance appropriately)
    const StreamPost = ({ post }) => (
      <Post type="stream" post={post} sessionUser={sessionUser} />
    );

    StreamPost.propTypes = { post: postShape.isRequired };

    return (
      <main className="main">
        {
          (profileId !== null && loadedProfile === null)
            ? <div className="profile profile-placeholder"><Suspender /></div>
            : <Profile user={displayUser} panel={profileId === null} />
        }
        {
          profileId === null && (
            <>
              <PostForm />
              <StreamFilterNav />
            </>
          )
        }
        {
          postsPending
            ? <div className="stream-placeholder"><Suspender /></div>
            : (
              <Stream
                PostComponent={StreamPost}
                posts={posts}
                hasMore
                loadMoreCallback={this.doLoadMore}
              />
            )
        }
      </main>
    );
  }
}

StreamPage.propTypes = {
  /* filter: PropTypes.oneOf([
    'all',
    'related',
    'friends',
    'following',
    'personal',
    'profile',
  ]), */
  profileId: PropTypes.string,
  sessionUser: userShape.isRequired,
};

StreamPage.defaultProps = {
  /* filter: 'all', */
  profileId: null,
};
