import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import assignmentReducer from './assignmentReducer';

export default combineReducers({
  auth: authReducer,
  assignment: assignmentReducer,
  user: userReducer,
  users: usersReducer,
});
