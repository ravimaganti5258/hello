import {
    FAILURE,
    SUCCESS,
    REQUEST,
    RESPONSE,
    JOB_RESPONSE,
    JOB_REJECT,
    INCEDENTSDATA
  } from '../log/type';
  
  const initialState = {
    data: {},
     isLoading: false,
    error: null,
  };
  
  export const IncidentsDataReducer = (state = initialState, action) => {
    switch (action.type) {
      case REQUEST: {
        return {...state, isLoading: true};
      }
      case RESPONSE: {
        return {...state, isLoading: false};
      }
      case INCEDENTSDATA: {
        return {
          ...state,
          error: null,
          isLoading: false,
          data: action.payload,
        };
      }
  
    
      default: {
        return state;
      }
    }
  };
  