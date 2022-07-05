import {SET_LOADER_TRUE, SET_LOADER_FALSE} from '../auth/types';
import {JOB_LIST__FAILURE, JOB_LIST_SUCCESS} from './types';

const initialState = {
  isLoading: false,
  data: [],
  error: '',
};

export const jobListReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOB_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    }
    case JOB_LIST__FAILURE: {
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
