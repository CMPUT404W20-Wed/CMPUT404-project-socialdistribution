import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Link,
} from 'react-router-dom';
import { connect } from 'react-redux';

import StreamPage from './pages/StreamPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import FriendListPage from './pages/FriendListPage';
import ModalSwitch from './components/common/modal/ModalSwitch';
import PopupMenu from './components/common/PopupMenu';
import * as actions from './store/actions/auth';

import './styles/page.css';

/* User context menu; appears at right of header bar.
 * Contains Profile and Log Out links.
 */
const UserMenu = ({ id, username, doLogout }) => (
  <div className="current-user">
    <PopupMenu
      handle={(
        <>
          <div className="current-user-name">{username}</div>
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
        onClick={() => doLogout()}
      >
        Log out
      </button>
    </PopupMenu>
  </div>
);

UserMenu.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  doLogout: PropTypes.func,
};

UserMenu.defaultProps = {
  id: null,
  username: null,
  doLogout: undefined,
};

/* Global header; renders at the top of every page.
 * Renders a <UserMenu> only when the user is logged in;
 * in any case, also renders a home-link / app title.
 */
const Header = ({
  isAuthenticated,
  id,
  username,
  doLogout,
}) => (
  <header className="header">
    <h1><Link to="/">App</Link></h1>
    {
      (isAuthenticated)
        ? <UserMenu id={id} username={username} doLogout={doLogout} />
        : null
    }
  </header>
);

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  id: PropTypes.string,
  username: PropTypes.string,
  doLogout: PropTypes.func,
};

Header.defaultProps = {
  isAuthenticated: false,
  id: null,
  username: null,
  doLogout: undefined,
};


/* Subsidiary top-level component containing most pages.
 * Everything here assumes the user is logged in; <App> should already have
 * handled the case where the user is not logged in.
 * <App> also provides a header; this component only contains "on-page" UI.
 *
 * Make sure to check that url is not being used by api/urls.py, or social_backend/urls.py
 *
 * * Routing logic is implemented here:
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
const Main = () => (
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
            filter={filter}
            page={page}
          />
        )}
      />
    </Route>
    <Route
      path="/post/:id"
      exact
      render={
        ({ match: { params: { id } } }) => (
          <PostPage postId={id} />
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
          />
        )
      }
    />
    <Route
      exact
      path={[
        '/profile/:id/friends',
        '/profile/:id/followers',
        '/profile/:id/following',
      ]}
    >
      <Route
        path="/profile/:id/:mode"
        render={
          ({ match: { params: { id, mode } } }) => (
            <FriendListPage profileId={id} mode={mode} />
          )
        }
      />
    </Route>
    <Route
      path="*"
      render={() => (
        <main className="centered-main">Invalid route!</main>
      )}
    />
  </ModalSwitch>
);

/* Top-level component.
 * Gets session information
 *
 * This component is directly responsible for everything that exists
 * independently of whether the user is logged in.
 *
 * If the user is not logged in they will be presented with a login screen
 * at whatever URL they visit. (There is no explicit login URL.)
 *
 * Delegates to <Main> once the user is logged in, which implements
 * most page logic.
 */
class App extends React.Component {
  /**
   * Will verify that token hasn't expired and still exists every time
   * component is reloaded. Will logout if not
   */
  componentDidMount() {
    const { autoSignIn } = this.props;
    autoSignIn();
  }

  /**
   * If the user is verified and user data doesn't exist in props
   * will use redux to get the info
   */
  componentDidUpdate() {
    const {
      isAuthenticated,
      id,
      username,
      getUserData,
    } = this.props;

    if (isAuthenticated && !id && !username) {
      getUserData();
    }
  }

  render() {
    const {
      isAuthenticated,
      id,
      username,
      doLogout,
    } = this.props;

    return (
      <Router>
        <Header isAuthenticated={isAuthenticated} id={id} username={username} doLogout={doLogout} />
        {
          (isAuthenticated)
            ? <Main />
            : <LoginPage />
        }
      </Router>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  id: PropTypes.string,
  username: PropTypes.string,
  getUserData: PropTypes.func.isRequired,
  autoSignIn: PropTypes.func.isRequired,
  doLogout: PropTypes.func.isRequired,
};

App.defaultProps = {
  id: null,
  username: null,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.token !== null,
  id: state.id,
  username: state.username,
});

const mapDispatchToProps = (dispatch) => ({
  doLogout: () => dispatch(actions.logout()),
  autoSignIn: () => dispatch(actions.authCheckState()),
  getUserData: () => dispatch(actions.getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
