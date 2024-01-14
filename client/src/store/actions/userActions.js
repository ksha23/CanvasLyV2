import axios from 'axios';
import { reloadMe } from './authActions';

import {
  GET_PROFILE_LOADING,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  EDIT_USER_LOADING,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAIL,
} from '../types';

export const editUser = (id, formData, history) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_USER_LOADING,
  });
  try {
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axios.put(`/api/users/${id}`, formData, options);

    dispatch({
      type: EDIT_USER_SUCCESS,
      payload: { user: response.data.user },
    });
    // edited him self, reload me
    // if (getState().auth.me?.id === response.data.user.id) dispatch(loadMe());
    if (getState().auth.me?.id === response.data.user.id) {
      dispatch(getProfile(response.data.user.username, history));
      dispatch(reloadMe());
    }
    history.push(`/${response.data.user.username}`);
  } catch (err) {
    dispatch({
      type: EDIT_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getProfile = (username, history) => async (dispatch, getState) => {
  dispatch({
    type: GET_PROFILE_LOADING,
  });
  try {
    const response = await axios.get(`/api/users/${username}`);

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: { profile: response.data.user },
    });
  } catch (err) {
    console.error(err);
    if (err?.response.status === 404) {
      history.push('/notfound');
    }
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};
