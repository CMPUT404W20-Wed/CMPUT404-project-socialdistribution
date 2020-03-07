import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SuspensefulSubmit from '../components/common/suspend/SuspensefulSubmit';

import '../styles/login.css';


/* Page displaying a login form. */
export default class LoginPage extends React.Component {
  state = {
    /* Current value of the username and password fields. */
    enteredUsername: '',
    enteredPassword: '',

    /* Status of the form:
     *   'ready' => not submitted
     * 'pending' => request sent, no response yet
     *   'error' => server rejected login
     */
    loginState: 'ready',

    /* Error message to display on the form;
     * should generally be null unless loginState is 'error'
     */
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
    const { loginCallback } = this.props;

    this.setState({
      loginState: 'pending',
      errorMessage: null,
    });

    // don't need a then() since a successful login
    // will redirect the user away from this component
    loginCallback(enteredUsername, enteredPassword).catch(
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
      && enteredPassword.length > 0;

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
                && <div className="error">{errorMessage}</div>
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

LoginPage.propTypes = {
  loginCallback: PropTypes.func.isRequired,
};
