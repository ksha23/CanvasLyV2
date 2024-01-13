import axios from 'axios';

import {
  GET_MESSAGES_LOADING,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  ADD_MESSAGE_LOADING,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  DELETE_MESSAGE_LOADING,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAIL,
  EDIT_MESSAGE_LOADING,
  EDIT_MESSAGE_SUCCESS,
  EDIT_MESSAGE_FAIL,
  CLEAR_MESSAGE_ERROR,
} from '../types';

// UPDATED
export const getMessages = () => async (dispatch, getState) => {
  dispatch({
    type: GET_MESSAGES_LOADING,
  });
  try {
    const response = await axios.get('/api/calendars/events');

    const user = getState().auth.me;
    const weights = user.weights;

    dispatch({
      type: GET_MESSAGES_SUCCESS,
      payload: { messages: response.data, weights: weights },
    });
  } catch (err) {
    dispatch({
      type: GET_MESSAGES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

// UPDATED
export const addMessage = (data) => async (dispatch, getState) => {
  dispatch({
    type: ADD_MESSAGE_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const response = await axios.post('/api/assignments/add', data.formData);
    dispatch({
      type: ADD_MESSAGE_SUCCESS,
      payload: { message: response.data },
    });
  } catch (err) {
    dispatch({
      type: ADD_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

// UPDATED: really is complete/uncomplete assignment
export const deleteMessage = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_MESSAGE_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/complete/${id}`);

    dispatch({
      type: DELETE_MESSAGE_SUCCESS,
      payload: { message: response.data },
    });
  } catch (err) {
    dispatch({
      type: DELETE_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

// UPDATED
export const editMessage = (id, formData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_MESSAGE_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/update/${id}`, formData);

    const user = getState().auth.me;
    const weights = user.weights;

    dispatch({
      type: EDIT_MESSAGE_SUCCESS,
      payload: { message: response.data, weights: weights },
    });
  } catch (err) {
    dispatch({
      type: EDIT_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

// UPDATED
export const confirmComplete = (id) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_MESSAGE_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/confirm/${id}`);

    dispatch({
      type: EDIT_MESSAGE_SUCCESS,
      payload: { message: response.data },
    });
  } catch (err) {
    dispatch({
      type: EDIT_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearMessageError = (id) => ({
  type: CLEAR_MESSAGE_ERROR,
  payload: { id },
});
