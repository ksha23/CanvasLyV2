import axios from 'axios';

import {
  GET_ASSIGNMENTS_LOADING,
  GET_ASSIGNMENTS_SUCCESS,
  GET_ASSIGNMENTS_FAIL,
  ADD_ASSIGNMENT_LOADING,
  ADD_ASSIGNMENT_SUCCESS,
  ADD_ASSIGNMENT_FAIL,
  COMPLETE_ASSIGNMENT_LOADING,
  COMPLETE_ASSIGNMENT_SUCCESS,
  COMPLETE_ASSIGNMENT_FAIL,
  EDIT_ASSIGNMENT_LOADING,
  EDIT_ASSIGNMENT_SUCCESS,
  EDIT_ASSIGNMENT_FAIL,
  CLEAR_ASSIGNMENT_ERROR,
  SORT_ASSIGNMENTS,
} from '../types';

export const getAssignments = () => async (dispatch, getState) => {
  dispatch({
    type: GET_ASSIGNMENTS_LOADING,
  });
  try {
    const response = await axios.get('/api/calendars/events');

    const user = getState().auth.me;
    const weights = user.weights;

    dispatch({
      type: GET_ASSIGNMENTS_SUCCESS,
      payload: { assignments: response.data, weights: weights },
    });
  } catch (err) {
    dispatch({
      type: GET_ASSIGNMENTS_FAIL,
      payload: { error: err?.response.data },
    });
  }
};

export const refreshAssignments = () => async (dispatch, getState) => {
  try {
    const response = await axios.get('/api/calendars/events');

    const user = getState().auth.me;
    const weights = user.weights;

    dispatch({
      type: GET_ASSIGNMENTS_SUCCESS,
      payload: { assignments: response.data, weights: weights },
    });
  } catch (err) {
    dispatch({
      type: GET_ASSIGNMENTS_FAIL,
      payload: { error: err?.response?.data },
    });
  }
};

// UPDATED
export const addAssignment = (data) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ASSIGNMENT_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const response = await axios.post('/api/assignments/add', data.formData);
    dispatch({
      type: ADD_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: ADD_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment },
    });
  }
};

// UPDATED: really is complete/uncomplete assignment
export const completeAssignment = (id) => async (dispatch, getState) => {
  dispatch({
    type: COMPLETE_ASSIGNMENT_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/complete/${id}`);

    dispatch({
      type: COMPLETE_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: COMPLETE_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment },
    });
  }
};

// UPDATED
export const editAssignment = (id, formData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_ASSIGNMENT_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/update/${id}`, formData);

    dispatch({
      type: EDIT_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: EDIT_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment, id },
    });
  }
};

// UPDATED
export const confirmComplete = (id) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_ASSIGNMENT_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/confirm/${id}`);

    dispatch({
      type: EDIT_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: EDIT_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment, id },
    });
  }
};

export const clearAssignmentError = (id) => ({
  type: CLEAR_ASSIGNMENT_ERROR,
  payload: { id },
});
