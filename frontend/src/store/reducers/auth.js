/* eslint-disable no-unused-vars */
import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { SIGNIN, SIGNOUT, SIGNUP, SET_HOURS } from '../constants';

// Actions

export const signin = createAction(SIGNIN);
export const signup = createAction(SIGNUP);
export const setHours = createAction(SET_HOURS);
export const signout = createAction(SIGNIN, () => {
  localStorage.removeItem('time_management_info');
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

  [Success(SET_HOURS)]: (state, { payload }) => ({
    ...state,
    token: payload.token,
    status:'SUCCESS',
    me: payload.info
  }),

  [Fail(SET_HOURS)]: (state, { payload }) => ({
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
