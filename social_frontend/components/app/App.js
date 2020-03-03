import React from 'react';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Redirect,
  Link,
} from 'react-router-dom';

import StreamPage from './StreamPage';
import PostPage from '../post/PostPage';
import LoginPage from './LoginPage';
import ModalSwitch from '../modal/ModalSwitch';
import PopupMenu from '../menu/PopupMenu';

import './page.css';


/* Global header; renders at the top of every page.
 * Contains links pertaining to the logged-in user.
 * TODO Log out link doesn't actually log out yet, it just goes to /login
 */
const Header = () => (
  <header className="header">
    <h1>App</h1>
    <div className="current-user">
      <PopupMenu
        handle={(
          <>
            <div className="current-user-name">DemoUser</div>
            <img className="current-user-avatar" alt="demo.user@example.net" />
          </>
        )}
      >
        <Link
          to="/profile/demo.user@example.net"
          onClick={(event) => { event.target.blur(); }}
        >
          Profile
        </Link>
        <Link
          to="/login"
          onClick={(event) => { event.target.blur(); }}
        >
          Log out
        </Link>
      </PopupMenu>
    </div>
  </header>
);


/* Top-level component.
 * Routing logic is implemented here:
 * | /         -- "home" stream view
 * | /post/### -- individual post view
 */
const App = () => (
  <Router>
    <Header />
    <ModalSwitch>
      <Route path="/" exact>
        <Redirect to="/stream/all" />
      </Route>
      <Route path="/login" exact component={LoginPage} />
      <Route
        path="/stream/:filter"
        exact
        render={({ filter }) => <StreamPage filter={filter} />}
      />
      <Route
        path="/post/:id"
        exact
        render={({ match: { params: { id } } }) => <PostPage postId={id} />}
      />
      <Route
        path="/profile/:id"
        exact
        render={({ match: { params: { id } } }) => (
          <StreamPage filter="profile" profileId={id} />
        )}
      />
      <Route
        path="*"
        render={() => <main className="centered-main">Invalid route!</main>}
      />
    </ModalSwitch>
  </Router>
);

export default App;
