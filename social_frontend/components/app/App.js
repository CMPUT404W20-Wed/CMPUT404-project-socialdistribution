import React from 'react';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
} from 'react-router-dom';

import StreamPage from './StreamPage';
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
        <StreamPage />
      </Route>
      <Route path="/post/">
        <h1>post</h1>
      </Route>
    </ModalSwitch>
  </Router>
);

export default App;
