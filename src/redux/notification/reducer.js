import {SET_LOADER_TRUE, SET_LOADER_FALSE} from '../auth/types';
import {FAILURE, SUCCESS} from './type';

const initialState = {
  isLoading: false,
  data: [],
  error: '',
};

export const notificationListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    }
    case FAILURE: {
      return {
        ...state,
        data: [],
        error: action.payload,
        isLoading: false,
      };
    }

    default: {
      return state;
    }
  }
};
