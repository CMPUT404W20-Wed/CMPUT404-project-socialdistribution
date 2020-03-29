import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SuspensefulSubmit from '../components/common/suspend/SuspensefulSubmit';
import { registerEndpoint } from '../util/endpoints';

import '../styles/login.css';


/* Page displaying a login form. */
class RegistrationPage extends React.Component {
  state = {
    enteredUsername: '',
    enteredPassword1: '',
    enteredPassword2: '',
    errorMessage: null,
    loading: false,
  };

  constructor(props) {
    super(props);

    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handlePassword1FieldChange = this.handlePassword1FieldChange.bind(this);
    this.handlePassword2FieldChange = this.handlePassword2FieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameFieldChange(event) {
    const enteredUsername = event.target.value;

    this.setState({
      enteredUsername,
    });
  }

  handlePassword1FieldChange(event) {
    const enteredPassword1 = event.target.value;

    this.setState({
      enteredPassword1,
    });
  }

  handlePassword2FieldChange(event) {
    const enteredPassword2 = event.target.value;

    this.setState({
      enteredPassword2,
    });
  }

  /**
   * Calls the reducer to login,
   * Will automatically re-render the page
   * @param {*} event
   */

  handleSubmit(event) {
    event.preventDefault();

    const {
      enteredUsername,
      enteredPassword1,
    } = this.state;
    const { history } = this.props;

    this.setState({
      loading: true,
    });

    Axios.post(registerEndpoint(), {
      username: enteredUsername,
      password: enteredPassword1,
    }).then(() => {
      history.push('/');
    }).catch((e) => {
      this.setState({
        errorMessage: e.message,
        loading: false,
      });
    });
  }

  render() {
    const {
      enteredUsername,
      enteredPassword1,
      enteredPassword2,
      errorMessage,
      loading,
    } = this.state;

    const enableSubmit = enteredUsername.length > 0
      && enteredPassword1.length > 0 && enteredPassword2.length
      && enteredPassword1 === enteredPassword2;

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
              name="password1"
              type="password"
              placeholder="Password"
              value={enteredPassword1}
              onChange={this.handlePassword1FieldChange}
            />
            <input
              className="field"
              name="password2"
              type="password"
              placeholder="Verify Password"
              value={enteredPassword2}
              onChange={this.handlePassword2FieldChange}
            />
            {
              errorMessage
                && <div className="error">{errorMessage}</div>
            }
            <SuspensefulSubmit
              label="Request Account"
              disabled={!enableSubmit}
              suspended={loading}
            />
          </form>
          <Link to="/" className="signup-link">Login Instead</Link>
        </main>
      </div>
    );
  }
}

RegistrationPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ loading, errorMessage }) => ({
  loading,
  errorMessage,
});

export default connect(mapStateToProps)(withRouter(RegistrationPage));
