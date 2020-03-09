import axios from 'axios';
import * as actionTypes from './actionTypes';


/**
 * Redux tutorial followed
 * https://www.youtube.com/watch?v=BxzO2M7QcZw&t=176s
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

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => (
  (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  }
);

export const authLogin = (username, password) => (
  (dispatch) => {
    dispatch(authStart());
    axios.post('http://127.0.0.1:8000/rest-auth/login/', {
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

export const authSignup = (username, email, password1, password2) => (
  (dispatch) => {
    dispatch(authStart());
    axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
      username,
      email,
      password1,
      password2,
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

export const authCheckState = () => (
  (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
);
