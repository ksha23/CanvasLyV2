import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import assignmentReducer from './assignmentReducer';
import weatherReducer from './weatherReducer';

export default combineReducers({
  auth: authReducer,
  assignment: assignmentReducer,
  user: userReducer,
  users: usersReducer,
  weather: weatherReducer,
});
