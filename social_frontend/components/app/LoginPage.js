import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import SuspensefulSubmit from '../submit/SuspensefulSubmit';

import './login.css';


function doLogin(/* username, password */) {
  // TODO stub
  return new Promise((resolve, reject) => {
    setTimeout(
      () => reject(new Error('Incorrect username or password.')),
      1000,
    );
  });
}


export default class LoginPage extends React.Component {
  state = {
    enteredUsername: '',
    enteredPassword: '',
    loginState: 'ready',
    errorMessage: null,
  };

  constructor(props) {
    super(props);

    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameFieldChange(event) {
    const enteredUsername = event.target.value;

    this.setState({
      enteredUsername,
    });
  }

  handlePasswordFieldChange(event) {
    const enteredPassword = event.target.value;

    this.setState({
      enteredPassword,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { enteredUsername, enteredPassword } = this.state;

    this.setState({
      loginState: 'pending',
      errorMessage: null,
    });

    doLogin(enteredUsername, enteredPassword).then(
      () => {
        this.setState({
          loginState: 'success',
        });
      },
      (error) => {
        this.setState({
          loginState: 'error',
          errorMessage: error.message,
        });
      },
    );
  }

  render() {
    const {
      enteredUsername,
      enteredPassword,
      loginState,
      errorMessage,
    } = this.state;
    const enableSubmit = enteredUsername.length > 0
      && enteredPassword.length > 0
      && loginState !== 'pending';
    if (loginState === 'success') return <Redirect to="/" />;
    return (
      <div className="login-page-wrapper">
        <main className={`login-page state-${loginState}`}>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input
              className="field"
              name="username"
              type="text"
              placeholder="Username"
              value={enteredUsername}
              onChange={this.handleUsernameFieldChange}
            />
            <input
              className="field"
              name="password"
              type="password"
              placeholder="Password"
              value={enteredPassword}
              onChange={this.handlePasswordFieldChange}
            />
            {
              errorMessage
                ? <div className="error">{errorMessage}</div>
                : null
            }
            <SuspensefulSubmit
              label="Log in"
              disabled={!enableSubmit}
              suspended={loginState === 'pending'}
            />
          </form>
          <Link to="/signup" className="signup-link">Request account</Link>
        </main>
      </div>
    );
  }
}
