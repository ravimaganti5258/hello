import {SET_LOADER_TRUE, SET_LOADER_FALSE} from '../auth/types';
import {NOTES__FAILURE, NOTES_SUCCESS} from './types';

const initialState = {
  isLoading: false,
  data: [],
  error: '',
};

export const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    }
    case NOTES__FAILURE: {
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
