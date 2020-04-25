/* eslint-disable no-unused-vars */
import { takeLatest } from 'redux-saga/effects';
import { SIGNIN, SIGNUP } from '../constant';
import apiCall from '../api/apiCall';

const signin = apiCall({
  type: SIGNIN,
  method: 'post',
  path: () => '/auth/login/',
  success: (res, action) => {
    localStorage.setItem('time_management_info', JSON.stringify(res.data));
  }
});

const signup = apiCall({
  type: SIGNUP,
  method: 'post',
  path: () => '/auth/signup/',
  success: () => {
    localStorage.removeItem('time_management_info');
  }
});

export default function* rootSaga () {
  yield takeLatest(SIGNIN, signin);
  yield takeLatest(SIGNUP, signup);
}
