import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../store/actions/auth';
import SuspensefulSubmit from '../components/common/suspend/SuspensefulSubmit';

import '../styles/login.css';

class EditProfileFormM extends React.Component {
  state = {
    enteredUsername: '',
    enteredPassword1: '',
    enteredPassword2: '',
    github: '',
  };

  constructor(props) {
    super(props);

    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handlePassword1FieldChange = this.handlePassword1FieldChange.bind(this);
    this.handlePassword2FieldChange = this.handlePassword2FieldChange.bind(this);
    this.handleGitHubFieldChange = this.handleGitHubFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { username, github } = this.props;
    this.setState({
      enteredUsername: username,
      github,
    });
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

  handleGitHubFieldChange(event) {
    const github = event.target.value;

    this.setState({ github });
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
      github,
    } = this.state;
    const { onEdit, id } = this.props;

    return onEdit(id, enteredUsername, enteredPassword1, enteredPassword2, github);
  }

  render() {
    const {
      enteredUsername,
      enteredPassword1,
      enteredPassword2,
      github,
    } = this.state;

    const { id, errorMessage, loading } = this.props;

    if (id === null) return null;

    return (
      <div className="login-page-wrapper">
        <main className="login-page state-ready">
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input
              className="field"
              name="username"
              type="text"
              placeholder="Change Username"
              value={enteredUsername}
              onChange={this.handleUsernameFieldChange}
            />
            <input
              className="field"
              name="password1"
              type="password"
              placeholder="Change Password"
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
            <input
              className="field"
              name="github"
              type="text"
              placeholder="Add a GitHub URL"
              value={github}
              onChange={this.handleGitHubFieldChange}
            />
            {
              errorMessage
                && <div className="error">{errorMessage}</div>
            }
            <SuspensefulSubmit
              label="Edit Profile"
              suspended={loading}
            />
          </form>
          <Link to="/" className="signup-link">Cancel</Link>
        </main>
      </div>
    );
  }
}

EditProfileFormM.propTypes = {
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  id: PropTypes.string,
  username: PropTypes.string,
  github: PropTypes.string,
};

EditProfileFormM.defaultProps = {
  errorMessage: null,
  loading: false,
  id: null,
  username: '',
  github: '',
};

const mapStateToProps = ({
  loading,
  errorMessage,
  id,
  username,
  github,
}) => ({
  loading,
  errorMessage,
  id,
  username,
  github,
});

const mapDispatchToProps = (dispatch) => ({
  onEdit:
  (id, userName, password, password2, github) => dispatch(actions.editUser(
    id, userName, password, password2, github,
  )),
});

const EditProfileForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfileFormM);


const EditProfilePage = ({ id }) => (
  id ? <EditProfileForm key={id} /> : null
);

EditProfilePage.propTypes = {
  id: PropTypes.string,
};

EditProfilePage.defaultProps = {
  id: null,
};

const mapStateToPropsForPage = ({
  id,
}) => ({
  id,
});

export default connect(mapStateToPropsForPage)(EditProfilePage);
