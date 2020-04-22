/* eslint-disable no-unused-vars */
import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { LOGIN, LOGOUT, SIGNUP } from '../constant';
// ------------------------------------
// Actions
// ------------------------------------

export const login = createAction(LOGIN);
export const logout = createAction(LOGIN, () => {
  localStorage.removeItem('time_management_info');
});
export const signup = createAction(SIGNUP);

const getInitialState = () => {
  let authRestore = JSON.parse(localStorage.getItem('time_management_info') || null);
  return authRestore ? {
    token: authRestore.token,
    me: authRestore.info,
    status: 'INIT',
    error: null
  } : {
    token: null,
    me: null,
    status: 'INIT',
    error: null
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [Success(LOGIN)]: (state, { payload }) => ({
    ...state,
    token: payload.token,
    status: Success(LOGIN),
    me: payload.info
  }),

  [Fail(LOGIN)]: (state, { payload }) => ({
    ...state,
    token: null,
    status: Fail(LOGIN),
    me: null,
    error: payload
  }),

  [Success(SIGNUP)]: (state, { payload }) => ({
    ...state,
    status: Success(SIGNUP),
    error: null
  }),

  [Fail(SIGNUP)]: (state, { payload }) => ({
    ...state,
    token: null,
    status: Fail(SIGNUP),
    me: null,
    error: payload
  }),

  [LOGOUT]: (state, { payload }) => ({
    ...state,
    token: null,
    status: LOGOUT,
    me: null,
    error: null
  })
}, getInitialState());
