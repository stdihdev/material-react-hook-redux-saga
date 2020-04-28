import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { GET_USERS, POST_USER, PUT_USER, DELETE_USER, GET_USER } from '../constants';

const initialState = {
  users: [],
  user: null,
  params: {
    count: 0,
    limit: 10,
    page: 1
  },
  error: ''
};

// Actions
export const getUsers = createAction(GET_USERS);
export const postUser = createAction(POST_USER);
export const putUser = createAction(PUT_USER);
export const deleteUser = createAction(DELETE_USER);
export const getUser = createAction(GET_USER);

// Reducer
export default handleActions({
  [Success(GET_USERS)]: (state, { payload }) => ({
    ...state,
    users: payload.users,
    params: {
      ...state.params,
      ...payload.params
    },
    error: null
  }),
  [Fail(GET_USERS)]: (state, { payload }) => ({
    ...state,
    error: payload.data
  }),
  [Success(POST_USER)]: (state, { payload }) => ({
    ...state,
    users: [...state.users, payload],
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
  [Success(DELETE_USER)]: (state, { payload }) => {
    const updatedUsers = state.users.filter((user) => user._id !== payload.id);
    console.log(updatedUsers, payload)
    return ({
      ...state,
      users: updatedUsers,
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