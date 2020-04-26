import { combineReducers } from 'redux';

import auth from './auth';
import record from './record';

export default combineReducers({
  auth,
  record
});
