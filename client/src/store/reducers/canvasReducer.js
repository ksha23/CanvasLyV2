import { first } from 'lodash';
import {
  GET_CANVAS_ASSIGNMENTS_FAIL,
  GET_CANVAS_ASSIGNMENTS_LOADING,
  GET_CANVAS_ASSIGNMENTS_SUCCESS,
  CREATE_CANVAS_ASSIGNMENT_LOADING,
  CREATE_CANVAS_ASSIGNMENT_SUCCESS,
  CREATE_CANVAS_ASSIGNMENT_FAIL,
  COMPLETE_CANVAS_ASSIGNMENT_FAIL,
  COMPLETE_CANVAS_ASSIGNMENT_LOADING,
  COMPLETE_CANVAS_ASSIGNMENT_SUCCESS,
  UPDATE_CANVAS_ASSIGNMENT_FAIL,
  UPDATE_CANVAS_ASSIGNMENT_LOADING,
  UPDATE_CANVAS_ASSIGNMENT_SUCCESS,
} from '../types';

const initialState = {
  assignments: [],
  firstAssignment: null,
  isLoading: false,
  error: null,
};

const customSort = (dueDateWeight, typeWeight, difficultyWeight) => (a, b) => {
  const typeValues = {
    Other: 1,
    Assignment: 2,
    Quiz: 3,
    Project: 4,
    Exam: 5,
  };

  const dateA = new Date(a.dueDate);
  const dateB = new Date(b.dueDate);

  const currentDate = new Date();

  const daysBetweenA = (dateA - currentDate) / (1000 * 3600 * 24);
  const daysBetweenB = (dateB - currentDate) / (1000 * 3600 * 24);

  // plug into function 1/1.2^x
  const normalizedDueDateValueA = 1 / Math.pow(2, daysBetweenA);
  const normalizedDueDateValueB = 1 / Math.pow(2, daysBetweenB);

  const maxTypeValue = 5;
  const maxDifficultyValue = 5;

  const normalizedTypeValueA = typeValues[a.type] / maxTypeValue;
  const normalizedDifficultyValueA = a.difficulty / maxDifficultyValue;

  const normalizedTypeValueB = typeValues[b.type] / maxTypeValue;
  const normalizedDifficultyValueB = b.difficulty / maxDifficultyValue;

  const scoreA =
    dueDateWeight * normalizedDueDateValueA +
    typeWeight * normalizedTypeValueA +
    difficultyWeight * normalizedDifficultyValueA;

  const scoreB =
    dueDateWeight * normalizedDueDateValueB +
    typeWeight * normalizedTypeValueB +
    difficultyWeight * normalizedDifficultyValueB;

  if (scoreA < scoreB) {
    return 1;
  }
  if (scoreA > scoreB) {
    return -1;
  }
  return 0;
};

const getFirstAssignment = (assignments) => {
  // get first assignment that is not completed
  if (!assignments.length) return null;
  const firstAssignment = first(assignments.filter((a) => !a.completed));
  return firstAssignment;
};

const sortAssignments = (assignments, weights) => {
  const weight = weights;
  const dueDateWeight = weight[0];
  const difficultyWeight = weight[1];
  const typeWeight = weight[2];
  const sortedMessages = assignments.sort(customSort(dueDateWeight, typeWeight, difficultyWeight));
  return sortedMessages;
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

export default function (state = initialState, { type, payload }) {
  switch (type) {
    // GET ASSIGNMENTS
    case GET_CANVAS_ASSIGNMENTS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CANVAS_ASSIGNMENTS_SUCCESS:
      const sorted = sortAssignments(payload.assignments, payload.weights);
      return {
        ...state,
        isLoading: false,
        firstAssignment: getFirstAssignment(sorted),
        assignments: sorted,
      };
    case GET_CANVAS_ASSIGNMENTS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        assignments: initialState.assignments,
      };

    // ADD ASSIGNMENT
    case CREATE_CANVAS_ASSIGNMENT_LOADING:
      return {
        ...state,
        assignments: [
          {
            id: 0,
            text: 'Loading...',
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: { ...payload.me },
          },
          ...state.assignments,
        ],
      };
    case CREATE_CANVAS_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        assignments: sortAssignments([payload.assignment, ...state.assignments], payload.weights),
      };
    case CREATE_CANVAS_ASSIGNMENT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        assignments: initialState.assignments,
      };

    // COMPLETE ASSIGNMENT / EDIT ASSIGNMENT
    case COMPLETE_CANVAS_ASSIGNMENT_LOADING:
    case UPDATE_CANVAS_ASSIGNMENT_LOADING:
      return {
        ...state,
        assignments: state.assignments.map((m) => {
          if (m._id === payload.id) return { ...m, isLoading: true };
          return m;
        }),
      };
    case COMPLETE_CANVAS_ASSIGNMENT_SUCCESS:
    case UPDATE_CANVAS_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        assignments: sortAssignments(
          state.assignments.map((m) => {
            if (m._id === payload.assignment._id) return payload.assignment;
            return m;
          }),
          payload.weights,
        ),
      };
    case COMPLETE_CANVAS_ASSIGNMENT_FAIL:
    case UPDATE_CANVAS_ASSIGNMENT_FAIL:
      return {
        ...state,
        error: true,
        isLoading: false,
        assignments: state.assignments.map((m) => {
          if (m._id === payload.id) return { ...m, isLoading: false, error: payload.error };
          return m;
        }),
      };

    // CLEAR ASSIGNMENT ERROR
    // case CLEAR_ASSIGNMENT_ERROR:
    //   return {
    //     ...state,
    //     assignments: state.assignments.map((m) => {
    //       if (m.id === payload.id) return { ...m, isLoading: false, error: null };
    //       return m;
    //     }),
    //   };
    case 'RESET_ASSIGNMENT_REDUCER':
      return {
        initialState,
      };
    default:
      return state;
  }
}
