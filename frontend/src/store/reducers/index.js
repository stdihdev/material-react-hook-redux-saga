import { combineReducers } from 'redux';

import auth from './auth';
import record from './record';
import user from './user';
import snack from './snack';

export default combineReducers({
  auth,
  record,
  user,
  snack
});
