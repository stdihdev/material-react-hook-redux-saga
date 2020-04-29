import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { GET_RECORDS, POST_RECORD, PUT_RECORD, DELETE_RECORD, SET_PARAMS, EXPORT_RECORDS } from '../constants';

const initialState = {
  records: [],
  record: null,
  exportResults: [],
  params: {
    from: null,
    to: null
  },
  error: ''
};

// Actions
export const getRecords = createAction(GET_RECORDS);
export const postRecord = createAction(POST_RECORD);
export const putRecord = createAction(PUT_RECORD);
export const deleteRecord = createAction(DELETE_RECORD);
export const setParams = createAction(SET_PARAMS);
export const exportRecords = createAction(EXPORT_RECORDS);

// Reducer
export default handleActions({
  [SET_PARAMS] : (state, { payload }) => ({
    ...state,
    params: {
      ...state.params,
      ...payload
    }
  }),
  [Success(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    records: payload.records,
    error: null
  }),
  [Fail(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    error: payload.data
  }),
  [Success(EXPORT_RECORDS)]: (state, { payload }) => ({
    ...state,
    exportResults: payload.records,
    error: null
  }),
  [Fail(EXPORT_RECORDS)]: (state, { payload }) => ({
    ...state,
    error: payload.data
  }),
  [Success(POST_RECORD)]: (state, { payload }) => {
    return ({
      ...state,
      record: payload,
      error: null
    });
  },
  [Fail(POST_RECORD)]: (state, { payload }) =>  {
    return ({
      ...state,
      error: payload.data
    });
  },
  [Success(PUT_RECORD)]: (state, { payload }) => {
    return ({
      ...state,
      record: payload,
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
  }
}, initialState);