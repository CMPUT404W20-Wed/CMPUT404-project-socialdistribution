import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../store/actions/auth';
import SuspensefulSubmit from '../components/common/suspend/SuspensefulSubmit';

import '../styles/login.css';


/* Page displaying a login form. */
class LoginPage extends React.Component {
  state = {
    enteredUsername: '',
    enteredPassword: '',
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

  /**
   * Calls the reducer to login,
   * Will automatically re-render the page
   * @param {*} event
   */

  handleSubmit(event) {
    event.preventDefault();

    const { enteredUsername, enteredPassword } = this.state;
    const { onAuth } = this.props;

    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          try {
            onAuth(enteredUsername, enteredPassword);
            resolve();
          } catch (error) {
            reject(new Error(error));
          }
        },
        1000,
      );
    });
  }

  render() {
    const {
      enteredUsername,
      enteredPassword,
    } = this.state;

    const { error, loading } = this.props;

    let errorMessage = null;

    if (error) {
      errorMessage = <p>{error.message}</p>;
    }

    const enableSubmit = enteredUsername.length > 0
      && enteredPassword.length > 0;

    return (
      <div className="login-page-wrapper">
        <main className="login-page state-ready">
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
              suspended={loading}
            />
          </form>
          <Link to="/signup" className="signup-link">Request account</Link>
        </main>
      </div>
    );
  }
}

LoginPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object,
  loading: PropTypes.bool,
  onAuth: PropTypes.func.isRequired,
};

LoginPage.defaultProps = {
  error: null,
  loading: false,
};

const mapStateToProps = (state) => ({
  loading: state.loading,
  error: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  onAuth: (userName, password) => dispatch(actions.authLogin(userName, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
