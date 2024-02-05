import axios from 'axios';

import {
  GET_CANVAS_ASSIGNMENTS_LOADING,
  GET_CANVAS_ASSIGNMENTS_SUCCESS,
  GET_CANVAS_ASSIGNMENTS_FAIL,
  CREATE_CANVAS_ASSIGNMENT_LOADING,
  CREATE_CANVAS_ASSIGNMENT_SUCCESS,
  CREATE_CANVAS_ASSIGNMENT_FAIL,
  COMPLETE_CANVAS_ASSIGNMENT_LOADING,
  COMPLETE_CANVAS_ASSIGNMENT_SUCCESS,
  COMPLETE_CANVAS_ASSIGNMENT_FAIL,
  UPDATE_CANVAS_ASSIGNMENT_LOADING,
  UPDATE_CANVAS_ASSIGNMENT_SUCCESS,
  UPDATE_CANVAS_ASSIGNMENT_FAIL,
  CONFIRM_CANVAS_ASSIGNMENT_LOADING,
  CONFIRM_CANVAS_ASSIGNMENT_SUCCESS,
  CONFIRM_CANVAS_ASSIGNMENT_FAIL,
} from '../types';

export const test = () => {
  console.log('test');
};

export const getCanvasAssignments = () => async (dispatch, getState) => {
  dispatch({
    type: GET_CANVAS_ASSIGNMENTS_LOADING,
  });
  try {
    const response = await axios.get('/api/canvas/assignments');

    const user = getState().auth.me;
    const weights = user.weights;

    dispatch({
      type: GET_CANVAS_ASSIGNMENTS_SUCCESS,
      payload: { assignments: response.data.assignments, weights: weights },
    });
  } catch (err) {
    dispatch({
      type: GET_CANVAS_ASSIGNMENTS_FAIL,
      payload: { error: err?.response.data },
    });
  }
};

export const refreshCanvasAssignments = () => async (dispatch, getState) => {
  try {
    const response = await axios.get('/api/canvas/assignments');

    const user = getState().auth.me;
    const weights = user.weights;

    dispatch({
      type: GET_CANVAS_ASSIGNMENTS_SUCCESS,
      payload: { assignments: response.data.assignments, weights: weights },
    });
  } catch (err) {
    dispatch({
      type: GET_CANVAS_ASSIGNMENTS_FAIL,
      payload: { error: err?.response?.data },
    });
  }
};

// export const addCanvasAssignment = (data) => async (dispatch, getState) => {
//   dispatch({
//     type: ADD_CANVAS_ASSIGNMENT_LOADING,
//     payload: { me: { ...getState().auth.me } },
//   });
//   try {
//     const response = await axios.post('/api/canvas/add', data.formData);
//     dispatch({
//       type: ADD_CANVAS_ASSIGNMENT_SUCCESS,
//       payload: { assignment: response.data, weights: getState().auth.me.weights },
//     });
//   } catch (err) {
//     dispatch({
//       type: ADD_ASSIGNMENT_FAIL,
//       payload: { error: err?.response?.data.assignment || err.assignment },
//     });
//   }
// };

// UPDATED: really is complete/uncomplete assignment
export const completeCanvasAssignment = (id) => async (dispatch, getState) => {
  dispatch({
    type: COMPLETE_CANVAS_ASSIGNMENT_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/canvas/complete/${id}`);

    dispatch({
      type: COMPLETE_CANVAS_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: COMPLETE_CANVAS_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment },
    });
  }
};

// UPDATED
export const confirmComplete = (id) => async (dispatch, getState) => {
  dispatch({
    type: CONFIRM_CANVAS_ASSIGNMENT_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/assignments/confirm/${id}`);

    dispatch({
      type: CONFIRM_CANVAS_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: CONFIRM_CANVAS_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment, id },
    });
  }
};

// UPDATED
export const updateCanvasAssignment = (id, formData) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_CANVAS_ASSIGNMENT_LOADING,
    payload: { id },
  });
  try {
    const response = await axios.put(`/api/canvas/updateAssignment/${id}`, formData);

    dispatch({
      type: UPDATE_CANVAS_ASSIGNMENT_SUCCESS,
      payload: { assignment: response.data, weights: getState().auth.me.weights },
    });
  } catch (err) {
    dispatch({
      type: UPDATE_CANVAS_ASSIGNMENT_FAIL,
      payload: { error: err?.response?.data.assignment || err.assignment, id },
    });
  }
};

// export const clearAssignmentError = (id) => ({
//   type: CLEAR_ASSIGNMENT_ERROR,
//   payload: { id },
// });
