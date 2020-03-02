import React from 'react';
import { Link } from 'react-router-dom';

import './login.css';


export default class LoginPage extends React.Component {
  state = {
    enteredUsername: '',
    enteredPassword: '',
  };

  constructor(props) {
    super(props);

    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this);
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

  render() {
    const { enteredUsername, enteredPassword } = this.state;
    return (
      <div className="login-page-wrapper">
        <main className="login-page">
          <form className="login-form">
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
            <input
              type="submit"
              value="Log in"
              disabled={!(enteredUsername.length && enteredPassword.length)}
            />
          </form>
          <Link to="/signup" className="signup-link">Request account</Link>
        </main>
      </div>
    );
  }
}
