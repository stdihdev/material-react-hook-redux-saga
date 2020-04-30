import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { GET_USERS, POST_USER, PUT_USER, DELETE_USER, GET_USER, SET_USER_PARAMS } from '../constants';

const initialState = {
  users: [],
  user: null,
  count: 0,
  params: {
    page: 0,
    rowsPerPage: 10
  },
  error: ''
};

// Actions
export const getUsers = createAction(GET_USERS);
export const postUser = createAction(POST_USER);
export const putUser = createAction(PUT_USER);
export const deleteUser = createAction(DELETE_USER);
export const getUser = createAction(GET_USER);
export const setParams = createAction(SET_USER_PARAMS);

// Reducer
export default handleActions({
  [SET_USER_PARAMS] : (state, { payload }) => ({
    ...state,
    params: {
      ...state.params,
      ...payload
    }
  }),
  [Success(GET_USERS)]: (state, { payload }) => ({
    ...state,
    users: payload.users,
    count: payload.count,
    error: null
  }),
  [Fail(GET_USERS)]: (state, { payload }) => ({
    ...state,
    error: payload.data
  }),
  [Success(POST_USER)]: (state, { payload }) => ({
    ...state,
    user: payload,
    error: null
  }),
  [Fail(POST_USER)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data,
      user: null
    });
  },
  [Success(PUT_USER)]: (state, { payload }) => {
    return ({
      ...state,
      user: payload,
      error: null
    });
  },
  [Fail(PUT_USER)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  },
  [Success(GET_USER)]: (state, { payload }) => {
    return ({
      ...state,
      user: payload,
      error: null
    });
  },
  [Fail(GET_USER)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  },
  [Success(DELETE_USER)]: (state) => {
    return ({
      ...state,
      error: null
    });
  },
  [Fail(DELETE_USER)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  }
}, initialState);