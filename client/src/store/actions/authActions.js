import axios from 'axios';

import {
  LOGIN_WITH_OAUTH_LOADING,
  LOGIN_WITH_OAUTH_SUCCESS,
  LOGIN_WITH_OAUTH_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_EMAIL_SUCCESS,
  LOGIN_WITH_EMAIL_FAIL,
  ME_LOADING,
  ME_SUCCESS,
  ME_FAIL,
  // RESEED_DATABASE_LOADING,
  // RESEED_DATABASE_SUCCESS,
  // RESEED_DATABASE_FAIL,
} from '../types';

export const loadMe = () => async (dispatch, getState) => {
  dispatch({ type: ME_LOADING });
  try {
    const response = await axios.get('/api/users/me');
    dispatch({
      type: ME_SUCCESS,
      payload: { me: response.data.me },
    });
  } catch (err) {
    dispatch({
      type: ME_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const loginUserWithEmail = (formData, history) => async (dispatch, getState) => {
  dispatch({ type: LOGIN_WITH_EMAIL_LOADING });
  try {
    const response = await axios.post('/auth/login', formData);

    dispatch({
      type: LOGIN_WITH_EMAIL_SUCCESS,
      payload: { me: response.data.me },
    });

    dispatch(loadMe());
    history.push('/');
  } catch (err) {
    dispatch({
      type: LOGIN_WITH_EMAIL_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const logInUserWithOauth = () => async (dispatch, getState) => {
  dispatch({ type: LOGIN_WITH_OAUTH_LOADING });

  try {
    const response = await axios.get('/api/users/me');

    dispatch({
      type: LOGIN_WITH_OAUTH_SUCCESS,
      payload: { me: response.data.me },
    });
  } catch (err) {
    dispatch({
      type: LOGIN_WITH_OAUTH_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

// Log user out
export const logOutUser = (history) => async (dispatch) => {
  try {
    // most likely not needed, except when testing react native
    deleteAllCookies();

    //just to log user logut on the server
    try {
      await axios.get('/auth/logout');
    } catch (err) {
      console.log(err);
    }

    dispatch({
      type: LOGOUT_SUCCESS,
    });
    if (history) history.push('/');
  } catch (err) {}
};

function deleteAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

// export const reseedDatabase = () => async (dispatch, getState) => {
//   dispatch({
//     type: RESEED_DATABASE_LOADING,
//   });
//   try {
//     await axios.get('/api/users/reseed');

//     dispatch({
//       type: RESEED_DATABASE_SUCCESS,
//     });
//     dispatch(logOutUser());
//     dispatch(getMessages());
//   } catch (err) {
//     dispatch({
//       type: RESEED_DATABASE_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

// export const attachTokenToHeaders = (getState) => {
//   const token = getState().auth.token;

//   const config = {
//     headers: {
//       'Content-type': 'application/json',
//     },
//   };

//   if (token) {
//     config.headers['x-auth-token'] = token;
//   }

//   return config;
// };

// export const attachTokenToHeadersWithFormData = (getState) => {
//   const token = getState().auth.token;

//   const config = {
//     headers: {
//       'Content-type': 'multipart/form-data',
//     },
//   };

//   if (token) {
//     config.headers['x-auth-token'] = token;
//   }

//   return config;
// };
