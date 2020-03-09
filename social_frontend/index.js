import React from 'react';
import ReactDOM from 'react-dom';
import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './App';
import reducer from './store/reducers/auth';

const composeEnhances = compose;

const store = createStore(reducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
