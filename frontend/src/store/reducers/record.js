import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { GET_RECORDS, POST_RECORD, HIDE_SNACK, PUT_RECORD, DELETE_RECORD } from '../constants';

const initialState = {
  records: [],
  params: {
    count: 0,
    limit: 10,
    page: 1
  },
  error: ''
};

// Actions
export const getRecords = createAction(GET_RECORDS);
export const postRecord = createAction(POST_RECORD);
export const hideSnack = createAction(HIDE_SNACK);
export const putRecord = createAction(PUT_RECORD);
export const deleteRecord = createAction(DELETE_RECORD);

// Reducer
export default handleActions({
  [Success(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    records: payload.records,
    params: {
      ...state.params,
      ...payload.params
    },
    error: null
  }),
  [Fail(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    error: payload.data
  }),
  [Success(POST_RECORD)]: (state, { payload }) => ({
    ...state,
    records: [...state.records, payload],
    error: null
  }),
  [Fail(POST_RECORD)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  },
  [Success(PUT_RECORD)]: (state, { payload }) => {
    const updatedRecords = state.records.map(record => (
      record._id === payload._id ? payload : record));
    return ({
      ...state,
      records: updatedRecords,
      error: null
    });
  },
  [Fail(PUT_RECORD)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  },
  [Success(DELETE_RECORD)]: (state, { payload }) => {
    const updatedRecords = state.records.filter((record) => record._id !== payload.id);
    return ({
      ...state,
      records: updatedRecords,
      error: null
    });
  },
  [Fail(DELETE_RECORD)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  },
  [HIDE_SNACK]: (state) => ({
    ...state,
    error: ''
  })
}, initialState);