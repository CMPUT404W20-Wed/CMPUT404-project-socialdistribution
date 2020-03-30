import axios from 'axios';
import * as actionTypes from './actionTypes';

import {
  loginEndpoint,
  logoutEndpoint,
  loggedInUserEndpoint,
} from '../../util/endpoints';

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

export const authSuccess = () => ({
  type: actionTypes.AUTH_SUCCESS,
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
    axios.post(logoutEndpoint()).then(() => {
      localStorage.removeItem('authenticated');
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
    axios.post(loginEndpoint(), {
      username,
      password,
    }).then(() => {
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem('authenticated', true);
      localStorage.setItem('expirationDate', expirationDate);
      dispatch(authSuccess());
      dispatch(checkAuthTimeout(3600));
    }).catch((err) => {
      dispatch(authFail(err.response.data ?? err.message));
    });
  }
);

export const authCheckState = () => (
  (dispatch) => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      dispatch(doLogout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(doLogout());
      } else {
        dispatch(authSuccess());
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
    axios.get(loggedInUserEndpoint()).then((res) => (
      dispatch(setUserData(res.data.id, res.data.username))
    )).catch((err) => {
      Error(err);
    });
  }
);
