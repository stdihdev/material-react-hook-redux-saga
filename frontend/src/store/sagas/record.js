/* eslint-disable no-unused-vars */
import { takeLatest } from 'redux-saga/effects';
import { GET_RECORDS, POST_RECORD, PUT_RECORD, DELETE_RECORD, EXPORT_RECORDS } from '../constants';
import apiCall from '../api/apiCall';

const getRecords = apiCall({
  type: GET_RECORDS,
  method: 'get',
  path: '/records/'
});

const exportRecords = apiCall({
  type: EXPORT_RECORDS,
  method: 'get',
  path: '/records/export'
});

const postRecord = apiCall({
  type: POST_RECORD,
  method: 'post',
  path: '/records/'
});

const putRecord = apiCall({
  type: PUT_RECORD,
  method: 'put',
  path: (payload) => `/records/${payload.id}/`
});

const deleteRecord = apiCall({
  type: DELETE_RECORD,
  method: 'delete',
  path: (payload) => `/records/${payload.id}/`
});

export default function* rootSaga () {
  yield takeLatest(GET_RECORDS, getRecords);
  yield takeLatest(POST_RECORD, postRecord);
  yield takeLatest(DELETE_RECORD, deleteRecord);
  yield takeLatest(PUT_RECORD, putRecord);
  yield takeLatest(EXPORT_RECORDS, exportRecords);
}