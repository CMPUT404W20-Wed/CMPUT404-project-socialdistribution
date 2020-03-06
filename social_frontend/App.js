import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Link,
} from 'react-router-dom';

import StreamPage from './pages/StreamPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import ModalSwitch from './components/common/modal/ModalSwitch';
import PopupMenu from './components/common/PopupMenu';
import { userShape } from './util/shapes';

import './styles/page.css';


// TODO This should be set by Django
window.pageSession = { user: null };


/* User context menu; appears at right of header bar.
 * Contains Profile and Log Out links.
 */
const UserMenu = ({ user, logoutCallback }) => {
  const { id, displayName } = user;
  return (
    <div className="current-user">
      <PopupMenu
        handle={(
          <>
            <div className="current-user-name">{displayName}</div>
            <img className="current-user-avatar" alt={id} />
          </>
        )}
      >
        <Link
          to={`/profile/${id}`}
          onClick={(event) => { event.target.blur(); }}
        >
          Profile
        </Link>
        <button
          type="button"
          onClick={() => { logoutCallback(); }}
        >
          Log out
        </button>
      </PopupMenu>
    </div>
  );
};

UserMenu.propTypes = {
  user: userShape.isRequired,
  logoutCallback: PropTypes.func.isRequired,
};


/* Global header; renders at the top of every page.
 * Renders a <UserMenu> only when the user is logged in;
 * in any case, also renders a home-link / app title.
 */
const Header = ({ sessionUser, logoutCallback }) => (
  <header className="header">
    <h1><Link to="/">App</Link></h1>
    {
      (sessionUser !== null)
        ? <UserMenu user={sessionUser} logoutCallback={logoutCallback} />
        : null
    }
  </header>
);

Header.propTypes = {
  sessionUser: userShape,
  logoutCallback: PropTypes.func.isRequired,
};

Header.defaultProps = {
  sessionUser: null,
};


/* Subsidiary top-level component containing most pages.
 * Everything here assumes the user is logged in; <App> should already have
 * handled the case where the user is not logged in.
 * <App> also provides a header; this component only contains "on-page" UI.
 *
 * Routing logic is implemented here:
 * | /            -- "home" stream view, shows everything
 * | /friends     -- stream of posts from the session user's friends
 * | /following   -- stream of posts from users the session user follows
 * | /related     -- stream of posts from the session user's friends-of-friends
 * | /personal    -- stream of posts explicitly shared with the session user
 * | /post/###    -- individual post view
 * | /profile/###           -- profile view
 * | /profile/###/friends   -- list of friends
 * | /profile/###/following -- list of users the specified user follows
 * | /profile/###/followers -- list of users following the specified user
 */
const Main = ({ sessionUser }) => (
  <ModalSwitch>
    <Route
      path={[
        '/',
        '/following',
        '/related',
        '/friends',
        '/personal',
      ]}
      exact
    >
      <Route
        path={[
          '/:filter',
          '/',
        ]}
        render={({ match: { params: { filter, page } } }) => (
          <StreamPage
            key={filter}
            filter={filter}
            page={page}
            sessionUser={sessionUser}
          />
        )}
      />
    </Route>
    <Route
      path="/post/:id"
      exact
      render={
        ({ match: { params: { id } } }) => (
          <PostPage postId={id} sessionUser={sessionUser} />
        )
      }
    />
    <Route
      path="/profile/:id"
      exact
      render={
        ({ match: { params: { id } } }) => (
          <StreamPage
            key={id}
            filter="profile"
            profileId={id}
            sessionUser={sessionUser}
          />
        )
      }
    />
    <Route
      path="*"
      render={() => (
        <main className="centered-main">Invalid route!</main>
      )}
    />
  </ModalSwitch>
);

Main.propTypes = {
  sessionUser: userShape.isRequired,
};


/* Top-level component.
 * Stores session information
 * (ie. the currently logged-in user ("session user")).
 *
 * This component is directly responsible for everything that exists
 * independenly of whether the user is logged in.
 *
 * If the user is not logged in they will be presented with a login screen
 * at whatever URL they visit. (There is no explicit login URL.)
 *
 * Delegates to <Main> once the user is logged in, which implements
 * most page logic.
 */
export default class App extends React.Component {
  state = {
    /* The current session. */
    session: window.pageSession,
  };

  constructor(props) {
    super(props);

    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }

  /* Attempt to login using the specified username and password.
   * Returns a Promise.
   * If login fails, the promise rejects; if login succeeds,
   * the promise resolves, but this also updates the current
   * session, which will probably unmount the component that
   * called this method before it can react to the result.
   * TODO Local stub
   */
  doLogin(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          if (username === password) {
            this.setState({
              session: {
                // Demo session data
                user: {
                  id: `${username}@example.net`,
                  displayName: username,
                  friendCount: 1,
                  followingCount: 10,
                  followerCount: 1401,
                },
              },
            });
            resolve();
          } else {
            reject(new Error('Incorrect username or password.'));
          }
        },
        1000,
      );
    });
  }

  /* Logs out the current user.
   * Returns a Promise.
   * If logout fails (which can really only be the server's fault), the
   * promise rejects; if login succeeds, the promise resolves, but this
   * also updates the current session, which will probably unmount the
   * component that called this method before it can react to the result.
   * TODO Local stub
   */
  doLogout() {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          this.setState({ session: { user: null } });
          resolve();
        },
        1000,
      );
    });
  }

  render() {
    const { session } = this.state;
    const { user } = session;
    return (
      <Router>
        <Header sessionUser={user} logoutCallback={this.doLogout} />
        {
          (user === null)
            ? <LoginPage loginCallback={this.doLogin} />
            : <Main sessionUser={user} />
        }
      </Router>
    );
  }
}
