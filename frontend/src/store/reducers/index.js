import { combineReducers } from 'redux';

import auth from './auth';
import record from './record';
import snack from './snack';

export default combineReducers({
  auth,
  record,
  snack
});
