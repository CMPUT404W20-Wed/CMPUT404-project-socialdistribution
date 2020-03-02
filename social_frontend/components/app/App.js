import React from 'react';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Redirect,
} from 'react-router-dom';

import StreamPage from './StreamPage';
import PostPage from '../post/PostPage';
import ModalSwitch from '../modal/ModalSwitch';

import './page.css';


/* Global header; renders at the top of every page.
 * Currently contains nothing interesting.
 */
const Header = () => (
  <header className="header">
    <h1>App</h1>
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
