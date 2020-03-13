import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../store/actions/auth';
import SuspensefulSubmit from '../components/common/suspend/SuspensefulSubmit';

import '../styles/login.css';


/* Page displaying a login form. */
class RegistrationPage extends React.Component {
  state = {
    enteredUsername: '',
    enteredPassword1: '',
    enteredPassword2: '',
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
      enteredPassword2,
    } = this.state;
    const { onRegister, history } = this.props;

    const rst = onRegister(
      enteredUsername,
      enteredPassword1,
      enteredPassword2,
    );
    history.push('/');
    return rst;
  }

  render() {
    const {
      enteredUsername,
      enteredPassword1,
      enteredPassword2,
    } = this.state;

    const { errorMessage, loading } = this.props;

    const enableSubmit = enteredUsername.length > 0
      && enteredPassword1.length > 0 && enteredPassword2.length;

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
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
  onRegister: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

RegistrationPage.defaultProps = {
  errorMessage: null,
  loading: false,
};

const mapStateToProps = ({ loading, errorMessage }) => ({
  loading,
  errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  onRegister:
  (userName, password1, password2) => dispatch(actions.authSignup(userName, password1, password2)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RegistrationPage));
