import axios from 'axios';
import * as actionTypes from './actionTypes';


/**
 * Actions portion of redux
 * Functions that change global states
 *
 * Redux tutorial followed
 * https://www.youtube.com/watch?v=BxzO2M7QcZw
 * Author: JustDjango
 * https://www.justdjango.com/
 */

export const authStart = () => ({
  type: actionTypes.AUTH_START,
});

export const authSuccess = (token) => ({
  type: actionTypes.AUTH_SUCCESS,
  token,
});

export const authFail = (errorMessage) => ({
  type: actionTypes.AUTH_FAIL,
  errorMessage,
});

export const logout = () => ({
  type: actionTypes.AUTH_LOGOUT,
});

export const doLogout = () => (
  (dispatch) => {
    axios.post('/rest-auth/logout/').then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      dispatch(logout());
    }).catch((err) => {
      Error(err);
    });
  }
);

/**
 * Expiration time set to 1hour, can change it later
 * @param {*} expirationTime
 */
export const checkAuthTimeout = (expirationTime) => (
  (dispatch) => {
    setTimeout(() => {
      dispatch(doLogout());
    }, expirationTime * 1000);
  }
);

export const authLogin = (username, password) => (
  (dispatch) => {
    dispatch(authStart());
    axios.post('/rest-auth/login/', {
      username,
      password,
    }).then((res) => {
      const token = res.data.key;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate);
      dispatch(authSuccess(token));
      dispatch(checkAuthTimeout(3600));
    }).catch((err) => {
      dispatch(authFail(err.message));
    });
  }
);

export const authSignup = (username, password1, password2) => (
  (dispatch) => {
    dispatch(authStart());
    axios.post('/rest-auth/registration/', {
      username,
      password1,
      password2,
    }).then(() => {
      dispatch(authSuccess(null));
    }).catch((err) => {
      dispatch(authFail(err.message));
    });
  }
);

export const authCheckState = () => (
  (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(doLogout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(doLogout());
      } else {
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
);

export const setUserData = (id, username) => ({
  type: actionTypes.SET_USER,
  id,
  username,
});

export const getUser = () => (
  (dispatch) => {
    axios.get('/rest-auth/user/').then((res) => (
      dispatch(setUserData(res.data.pk, res.data.username))
    )).catch((err) => {
      Error(err);
    });
  }
);


/**
 * EDIT PROFILE REDUCER
 *
 *
 *
 */

export const editStart = () => ({
  type: actionTypes.EDIT_START,
});

export const editSuccess = (token) => ({
  type: actionTypes.EDIT_SUCCESS,
  token,
});

export const editFail = (errorMessage) => ({
  type: actionTypes.EDIT_FAIL,
  errorMessage,
});

export const editUser = (id, username, password, password2) => (
  (dispatch) => {
    dispatch(editStart);
    if (password === password2) {
      axios.put(`/author/${id}/`, {
        username,
        password,
      }).then((res) => {
        dispatch(editSuccess);
        console.log(res);
      }).catch((err) => {
        dispatch(editFail(err.message));
      });
    } else {
      dispatch(editFail("passwords don't match"));
    }
  }
);
