import axios from 'axios';

import {
  LOGOUT_SUCCESS,
  ME_LOADING,
  ME_SUCCESS,
  ME_FAIL,
  RELOAD_ME_LOADING,
  RELOAD_ME_SUCCESS,
  RELOAD_ME_FAIL,
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

export const reloadMe = () => async (dispatch, getState) => {
  dispatch({ type: RELOAD_ME_LOADING });
  try {
    const response = await axios.get('/api/users/me');
    dispatch({
      type: RELOAD_ME_SUCCESS,
      payload: { me: response.data.me },
    });
  } catch (err) {
    dispatch({
      type: RELOAD_ME_FAIL,
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
