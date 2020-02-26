import React from 'react';
import {
  BrowserRouter as Router, // can also use HashRouter
  Route,
  Switch,
  NavLink,
} from 'react-router-dom';

import StreamPage from './StreamPage';

// TODO remove the component definition here, move to own folders
const test1 = () => (<div>Hello World from test1</div>);
const test2 = () => (<div>Hello World from test2</div>);
const test3 = () => (<div>Hello World from test3</div>);

const Header = () => (
  <header>
    <NavLink to="/" exact activeClassName="header-btn-active" className="header-btn">
      Home
    </NavLink>
    <NavLink to="/test1" activeClassName="header-btn-active" className="header-btn">
      Test1
    </NavLink>
    <NavLink to="/test2" activeClassName="header-btn-active" className="header-btn">
      Test2
    </NavLink>
    <NavLink to="/test3" exact activeClassName="header-btn-active" className="header-btn">
      Test3
    </NavLink>
  </header>
);

const App = () => (
  <Router>
    <Header />
    <Switch>
      <Route path="/" exact>
        <StreamPage />
      </Route>
      <Route path="/test1" component={test1} />
      <Route path="/test2" component={test2} />
      <Route path="/test3" component={test3} />
    </Switch>
  </Router>
);

export default App;
