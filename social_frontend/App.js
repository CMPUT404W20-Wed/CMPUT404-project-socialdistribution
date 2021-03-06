import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Link,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPaperclip,
  faEyeSlash,
  faEye,
  faHeading,
} from '@fortawesome/free-solid-svg-icons';
import {
  faMarkdown,
} from '@fortawesome/free-brands-svg-icons';

import StreamPage from './pages/StreamPage';
import PostPage from './pages/PostPage';
import EditProfilePage from './pages/EditProfilePage';
import LoginPage from './pages/LoginPage';
import FriendListPage from './pages/FriendListPage';
import RegistrationPage from './pages/RegistrationPage';
import ModalSwitch from './components/common/modal/ModalSwitch';
import PopupMenu from './components/common/PopupMenu';
import * as actions from './store/actions/auth';

import './styles/page.css';


library.add(
  faPaperclip,
  faMarkdown,
  faEyeSlash,
  faEye,
  faHeading,
);

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
      {/* TODO */}
      <Link
        to={`/edit/${id}`}
        onClick={(event) => { event.target.blur(); }}
      >
        Edit Profile
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
  headerTitle,
}) => (
  <header className="header">
    <h1 className="margin-left"><Link className="link" to="/">{headerTitle}</Link></h1>
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
  headerTitle: PropTypes.string,
};

Header.defaultProps = {
  isAuthenticated: false,
  id: null,
  username: null,
  doLogout: undefined,
  headerTitle: 'this.node.app',
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
        '/public',
        '/following',
        '/related',
        '/friends',
        '/personal',
        '/private',
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
          <PostPage key={id} id={id} />
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
      path="/edit/:id"
      exact
      render={
        ({ match: { params: { id } } }) => (
          <EditProfilePage
            profileId={id}
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

const AuthRoute = () => (
  <Switch>
    <Route path="/signup" exact>
      <RegistrationPage />
    </Route>
    <Route path="/">
      <LoginPage />
    </Route>
  </Switch>
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

    /**
     * Creates a random title for webpage just for kicks
     */
    const generateTitle = () => {
      const titles = ['this', 'node', 'app'];

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const getRandomInt = (max) => (
        Math.floor(Math.random() * Math.floor(max))
      );

      const headerTitle = `${titles[getRandomInt(3)]}.${titles[getRandomInt(3)]}.${titles[getRandomInt(3)]}`;
      return headerTitle;
    };
    const title = generateTitle();

    return (
      <Router>
        <Header
          isAuthenticated={isAuthenticated}
          id={id}
          username={username}
          doLogout={doLogout}
          headerTitle={title}
        />
        {
          (isAuthenticated)
            ? <Main />
            : <AuthRoute />
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
  isAuthenticated: state.authenticated,
  id: state.id,
  username: state.username,
});

const mapDispatchToProps = (dispatch) => ({
  doLogout: () => dispatch(actions.doLogout()),
  autoSignIn: () => dispatch(actions.authCheckState()),
  getUserData: () => dispatch(actions.getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
