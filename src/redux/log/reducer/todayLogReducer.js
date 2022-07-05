import {FAILURE, SUCCESS, REQUEST, RESPONSE, TODAY_LOG_SUCCESS} from '../type';

const initialState = {
  data: {},
  isLoading: false,
  error: null,
};

export const todayLogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST: {
      return {...state, isLoading: true};
    }
    case RESPONSE: {
      return {...state, isLoading: false};
    }
    case TODAY_LOG_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        data: action.payload,
      };
    }

    case FAILURE: {
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
