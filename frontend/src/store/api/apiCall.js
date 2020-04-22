import { call, put } from 'redux-saga/effects';
import { get } from 'lodash';
import axios from 'axios';
import { Fail, Pending, Success } from './status';

const defaultHeaders = () => {
  const auth = localStorage.getItem('time_management_info');
  let headers = {
    'Content-Type': 'application/json'
  };

  if (auth) {
    const token = JSON.parse(auth).token;
    headers['Authorization'] = 'Bearer ' + token;
  }

  return headers;
};

export default ({
  type,
  method,
  path,
  headers,
  success
}) => function* (action) {
  const {
    body,
    params,
    success: successCallback
  } = (action.payload || {});

  try {
    yield put({
      type: Pending(type)
    });

    const options = {
      // eslint-disable-next-line no-undef
      url: process.env.REACT_APP_API_ROOT + '/' + (typeof path === 'function' ? path(action) : path),
      method: method.toLowerCase(),
      headers: Object.assign({}, defaultHeaders(), headers),
      data: body,
      params
    };
    const res = yield call(axios.request, options );

    yield put({
      type: Success(type),
      payload: res.data
    });

    successCallback && successCallback(res);
    success && success(res, action);

  } catch (err) {
    const errRes = get(err, 'response', err);

    yield put({
      type: Fail(type),
      payload: errRes
    });
  }
};
