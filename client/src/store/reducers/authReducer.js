import {
  LOGOUT_SUCCESS,
  ME_LOADING,
  ME_SUCCESS,
  ME_FAIL,
  RELOAD_ME_LOADING,
  RELOAD_ME_SUCCESS,
  RELOAD_ME_FAIL,
} from '../types';

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  me: null,
  error: null,
  appLoaded: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ME_LOADING:
      return {
        ...state,
        isLoading: true,
        appLoaded: false,
        error: null,
      };
    case ME_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        me: payload.me,
        error: null,
        appLoaded: true,
      };
    case ME_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        me: null,
        error: null,
        appLoaded: true,
      };
    case RELOAD_ME_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case RELOAD_ME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        me: payload.me,
        error: null,
        isAuthenticated: true,
        appLoaded: true,
      };
    case RELOAD_ME_FAIL:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        me: null,
        error: "Can't reload user",
        appLoaded: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        me: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
