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

const initialState = {
  messages: [],
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

const sortMessage = (messages, weights) => {
  const weight = weights;
  const dueDateWeight = weight[0];
  const difficultyWeight = weight[1];
  const typeWeight = weight[2];
  const sortedMessages = messages.sort(customSort(dueDateWeight, typeWeight, difficultyWeight));
  return sortedMessages;
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GET_MESSAGES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_MESSAGE_LOADING:
      return {
        ...state,
        messages: [
          {
            id: 0,
            text: 'Loading...',
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: { ...payload.me },
          },
          ...state.messages,
        ],
      };
    case DELETE_MESSAGE_LOADING:
    case EDIT_MESSAGE_LOADING:
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m._id === payload.id) return { ...m, isLoading: true };
          return m;
        }),
      };
    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: sortMessage(payload.messages, payload.weights),
      };
    case ADD_MESSAGE_SUCCESS:
      // just need to add the new message to the messages array
      return {
        ...state,
        isLoading: false,
        messages: [payload.message, ...state.messages],
      };
    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m._id === payload.message._id) return payload.message;
          return m;
        }),
      };
    case EDIT_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: sortMessage(
          state.messages.map((m) => {
            if (m._id === payload.message._id) return payload.message;
            return m;
          }),
          payload.weights,
        ),
      };
    case DELETE_MESSAGE_FAIL:
    case EDIT_MESSAGE_FAIL:
      return {
        ...state,
        error: true,
        isLoading: false,
        messages: state.messages.map((m) => {
          if (m._id === payload.id) return { ...m, isLoading: false, error: payload.error };
          return m;
        }),
      };
    case GET_MESSAGES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_MESSAGE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        messages: state.messages.filter((m) => m.id !== 0),
      };
    case CLEAR_MESSAGE_ERROR:
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id === payload.id) return { ...m, isLoading: false, error: null };
          return m;
        }),
      };
    case 'RESET_MESSAGE_REDUCER':
      return {
        initialState,
      };
    default:
      return state;
  }
}
