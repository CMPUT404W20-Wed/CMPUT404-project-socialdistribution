import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';

import App from './App';

Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = 'X-CSRFToken';
ReactDOM.render(<App />, document.getElementById('root'));
