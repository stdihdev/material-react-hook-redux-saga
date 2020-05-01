/* eslint-disable no-unused-vars */
import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { SIGNIN, SIGNOUT, SIGNUP, UPDATE_PROFILE } from '../constants';

// Actions

export const signin = createAction(SIGNIN);
export const signup = createAction(SIGNUP);
export const updateProfile = createAction(UPDATE_PROFILE);
export const signout = createAction(SIGNIN, () => {
  localStorage.removeItem('time_management_info');
  window.location.href = '/login';
});

const getInitialState = () => {
  let authInfo = JSON.parse(localStorage.getItem('time_management_info') || null);
  return authInfo ? {
    token: authInfo.token,
    me: authInfo.info,
    status: '',
    error: null
  } : {
    token: null,
    me: null,
    status: '',
    error: null
  };
};

// Reducer
export default handleActions({
  [Success(SIGNIN)]: (state, { payload }) => ({
    ...state,
    token: payload.token,
    status:'SUCCESS',
    me: payload.info
  }),

  [Fail(SIGNIN)]: (state, { payload }) => ({
    ...state,
    token: null,
    status: 'FAIL',
    me: null,
    error: payload
  }),

  [Success(SIGNUP)]: (state, { payload }) => ({
    ...state,
    status: 'SUCCESS',
    error: null
  }),

  [Fail(SIGNUP)]: (state, { payload }) => ({
    ...state,
    token: null,
    status: 'FAIL',
    me: null,
    error: payload
  }),

  [Success(UPDATE_PROFILE)]: (state, { payload }) => ({
    ...state,
    token: payload.token,
    status:'SUCCESS',
    me: payload.info
  }),

  [Fail(UPDATE_PROFILE)]: (state, { payload }) => ({
    ...state,
    status: 'FAIL',
    error: payload
  }),

  [SIGNOUT]: (state, { payload }) => ({
    ...state,
    token: null,
    status: SIGNOUT,
    me: null,
    error: null
  })
}, getInitialState());
