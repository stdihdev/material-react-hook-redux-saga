import { createAction, handleActions } from 'redux-actions';
import { Success, Fail } from '../api/status';
import { GET_RECORDS, POST_RECORD, PUT_RECORD, DELETE_RECORD, SET_RECORD_PARAMS, EXPORT_RECORDS } from '../constants';

const initialState = {
  records: [],
  record: null,
  exportResults: [],
  count: 0,
  params: {
    page: 0,
    rowsPerPage: 10,
    from: null,
    to: null,
    user: null
  },
  error: ''
};

// Actions
export const getRecords = createAction(GET_RECORDS);
export const postRecord = createAction(POST_RECORD);
export const putRecord = createAction(PUT_RECORD);
export const deleteRecord = createAction(DELETE_RECORD);
export const setParams = createAction(SET_RECORD_PARAMS);
export const exportRecords = createAction(EXPORT_RECORDS);

// Reducer
export default handleActions({
  [SET_RECORD_PARAMS] : (state, { payload }) => ({
    ...state,
    params: {
      ...state.params,
      ...payload
    }
  }),
  [Success(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    records: payload.records,
    count: payload.count,
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
  [Success(DELETE_RECORD)]: (state) => {
    return ({
      ...state,
      count: state.count - 1,
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