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

export const authFail = (error) => ({
  type: actionTypes.AUTH_FAIL,
  error,
});

export const logout = () => ({
  type: actionTypes.AUTH_LOGOUT,
});

export const doLogout = () => (
  (dispatch) => {
    axios.post('/rest-auth/logout/').then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      dispatch(logout())
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
      dispatch(authFail(err));
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
    }).catch((err) => {
      dispatch(authFail(err));
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
