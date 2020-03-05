import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Link,
} from 'react-router-dom';

import StreamPage from './StreamPage';
import PostPage from './PostPage';
import LoginPage from './LoginPage';
import ModalSwitch from '../modal/ModalSwitch';
import PopupMenu from '../menu/PopupMenu';
import { userShape } from '../shapes';

import './page.css';

// TODO This should be set by Django
window.pageSession = { user: null };


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
 * Contains links pertaining to the logged-in user.
 * TODO Log out link doesn't actually log out yet, it just goes to /login
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


/* Top-level component.
 * Routing logic is implemented here:
 * | /         -- "home" stream view
 * | /post/### -- individual post view
 */
export default class App extends React.Component {
  state = {
    session: window.pageSession,
  };

  constructor(props) {
    super(props);

    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }

  doLogin(username, password) {
    // TODO demo
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          if (username === password) {
            this.setState({
              session: {
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

  doLogout() {
    // TODO demo
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
            : (
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
                  render={({ match }) => (
                    <StreamPage filter={match} sessionUser={user} />
                  )}
                />
                <Route
                  path="/post/:id"
                  exact
                  render={
                    ({ match: { params: { id } } }) => (
                      <PostPage postId={id} sessionUser={user} />
                    )
                  }
                />
                <Route
                  path="/profile/:id"
                  exact
                  render={
                    ({ match: { params: { id } } }) => (
                      <StreamPage
                        filter="profile"
                        profileId={id}
                        sessionUser={user}
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
            )
        }
      </Router>
    );
  }
}
