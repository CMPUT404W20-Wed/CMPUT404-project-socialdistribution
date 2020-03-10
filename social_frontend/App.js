// TODO fix to play nice with ESLINT
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
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
import ModalSwitch from './components/common/modal/ModalSwitch';
import PopupMenu from './components/common/PopupMenu';
import { userShape } from './util/shapes';
import * as actions from './store/actions/auth';

import './styles/page.css';

/* User context menu; appears at right of header bar.
 * Contains Profile and Log Out links.
 */
const UserMenu = (props) => {
  const { id, username } = props;
  return (
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
          // TODO Call logout
          onClick={() => alert('WIP, manually delete cookies')}
        >
          Log out
        </button>
      </PopupMenu>
    </div>
  );
};

/* Global header; renders at the top of every page.
 * Renders a <UserMenu> only when the user is logged in;
 * in any case, also renders a home-link / app title.
 */
const Header = (props) => (
  <header className="header">
    <h1><Link to="/">App</Link></h1>
    {
      (props.isAuthenticated)
        ? <UserMenu {...props} />
        : null
    }
  </header>
);

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
      path="*"
      render={() => (
        <main className="centered-main">Invalid route!</main>
      )}
    />
  </ModalSwitch>
);

/* Top-level component.
 * Stores session information
 * (ie. the currently logged-in user ("session user")).
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
  // TODO call getUser Data ONLY WHEN NEEDED
  componentDidMount() {
    this.props.autoSignIn();
    this.props.getUserData();
  }

  // TODO DELETE
  componentDidUpdate() {
    console.log(this.props);
  }

  /* Attempt to login using the specified username and password.
   * Returns a Promise.
   * If login fails, the promise rejects; if login succeeds,
   * the promise resolves, but this also updates the current
   * session, which will probably unmount the component that
   * called this method before it can react to the result.
   * TODO Local stub
   */

  render() {
    return (
      <Router>
        <Header {...this.props} />
        {
          (this.props.isAuthenticated)
            ? <Main {...this.props} />
            : <LoginPage {...this.props} />
        }
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.token !== null,
  id: state.id,
  username: state.username,
});

const mapDispatchToProps = (dispatch) => ({
  autoSignIn: () => dispatch(actions.authCheckState()),
  getUserData: () => dispatch(actions.getUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
