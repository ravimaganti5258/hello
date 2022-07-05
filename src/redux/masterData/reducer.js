import {
  FAILURE,
  MASTER_FAILURE,
  MASTER_SUCCESS,
  REQUEST,
  RESPONSE,
} from '../log/type';

const initialState = {
  data: {},
  isLoading: false,
  error: null,
};

export const masterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST: {
      return {...state, isLoading: true};
    }
    case RESPONSE: {
      return {...state, isLoading: false};
    }
    case MASTER_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        data: action.payload,
      };
    }

    case MASTER_FAILURE: {
      return {
        ...state,
        data: {},
        error: action.payload,
        isLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};
