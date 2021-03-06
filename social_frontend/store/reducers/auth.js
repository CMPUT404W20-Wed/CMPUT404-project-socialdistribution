import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';

/**
 * Reducer portion of Redux
 * Set state that have to accessed globally
 *
 * Redux tutorial followed
 * https://www.youtube.com/watch?v=BxzO2M7QcZw
 * Author: JustDjango
 * https://www.justdjango.com/
 */

const initState = {
  authenticated: false,
  errorMessage: null,
  loading: false,
  id: null,
  username: null,
  github: null,
};

const authStart = (state) => (
  updateObject(state, {
    errorMessage: null,
    loading: true,
  })
);


const authSuccess = (state) => (
  updateObject(state, {
    authenticated: true,
    errorMessage: null,
    loading: false,
  })
);

const authFail = (state, action) => (
  updateObject(state, {
    errorMessage: action.errorMessage,
    loading: false,
  })
);

const authLogout = (state) => (
  updateObject(state, {
    authenticated: false,
    id: null,
    username: null,
    github: null,
  })
);

const setUserData = (state, action) => (
  updateObject(state, {
    id: action.id,
    username: action.username,
    github: action.github,
  })
);

const editStart = (state) => (
  updateObject(state, {
    errorMessage: null,
    loading: true,
  })
);

const editSuccess = (state) => (
  updateObject(state, {
    errorMessage: null,
    loading: false,
  })
);

const editFail = (state, action) => (
  updateObject(state, {
    errorMessage: action.errorMessage,
    loading: false,
  })
);

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_USER:
      return setUserData(state, action);
    case actionTypes.EDIT_START:
      return editStart(state, action);
    case actionTypes.EDIT_SUCCESS:
      return editSuccess(state, action);
    case actionTypes.EDIT_FAIL:
      return editFail(state, action);
    default:
      return state;
  }
};

export default reducer;
