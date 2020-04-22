/* eslint-disable no-unused-vars */
import { takeLatest } from 'redux-saga/effects';
import { LOGIN, SIGNUP } from '../constant';
import apiCall from '../api/apiCall';

const doLogin = apiCall({
  type: LOGIN,
  method: 'post',
  path: () => '/auth/login/',
  success: (res, action) => {
    localStorage.setItem('time_management_info', JSON.stringify(res.data));
  }
});

const doSignup = apiCall({
  type: SIGNUP,
  method: 'post',
  path: () => '/auth/register/',
  success: () => {
    localStorage.removeItem('time_management_info');
  }
});

export default function* rootSaga () {
  yield takeLatest(LOGIN, doLogin);
  yield takeLatest(SIGNUP, doSignup);
}
