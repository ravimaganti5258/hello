import {
  FAILURE,
  SUCCESS,
  REQUEST,
  RESPONSE,
  CHECK_OUT_SUCCESS,
  CHECK_REQUEST,
  CHECK_RESPONSE,
  CHECK_IN_SUCCESS,
} from '../type';

const initialState = {
  userData: {},
  isLoading: false,
  ischeckIn: false,
  isCheckOut: false,
  error: null,
};

export const logReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_REQUEST: {
      return { ...state, isLoading: true };
    }
    case CHECK_RESPONSE: {
      return { ...state, isLoading: false };
    }
    case SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        userData: action.payload,
      };
    }
    case CHECK_IN_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        userData: action.payload,
        ischeckIn: true,
        isCheckOut: false,
      };
    }
    case CHECK_OUT_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        userData: action.payload,
        ischeckIn: false,
        isCheckOut: true,
      };
    }
    case FAILURE: {
      return {
        ...state,
        userData: {},
        error: action.payload,
        isLoading: false,
        isLoggedIn: false,
      };
    }
    default: {
      return state;
    }
  }
};
