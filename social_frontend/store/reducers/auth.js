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
  })
);

const setUserData = (state, action) => (
  updateObject(state, {
    id: action.id,
    username: action.username,
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
    default:
      return state;
  }
};

export default reducer;
