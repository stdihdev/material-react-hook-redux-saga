import { all } from 'redux-saga/effects';
import auth from './auth';
import record from './record';

export default function* rootSaga () {
  yield all([
    auth(),
    record()
  ]);
}
