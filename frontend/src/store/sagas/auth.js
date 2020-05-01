/* eslint-disable no-unused-vars */
import { takeLatest } from 'redux-saga/effects';
import { SIGNIN, SIGNUP, UPDATE_PROFILE } from '../constants';
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

const updateProfile = apiCall({
  type: UPDATE_PROFILE,
  method: 'post',
  path: () => '/auth/update/',
  success: (res, action) => {
    localStorage.setItem('time_management_info', JSON.stringify(res.data));
  }
});

export default function* rootSaga () {
  yield takeLatest(SIGNIN, signin);
  yield takeLatest(SIGNUP, signup);
  yield takeLatest(UPDATE_PROFILE, updateProfile);
}
