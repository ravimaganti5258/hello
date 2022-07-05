import {
  PENDING_API,
  SAVE_RES,
  REMOVE_PENDING_API,
  NETWORK_CONNECTED,
  APP_CURRENT_STATE,
} from './types';

const initialState = {
  pendingApi: [],
  connected: true,
  appCurrentState: '',
};

export const backgroungApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case PENDING_API: {
      return {...state, pendingApi: action.payload};
    }
    case SAVE_RES: {
      return {...state};
    }
    case REMOVE_PENDING_API: {
      return {
        ...state,
        pendingApi: action.payload,
      };
    }
    case NETWORK_CONNECTED: {
      return {
        ...state,
        connected: action.payload,
      };
    }
    case APP_CURRENT_STATE: {
      return {
        ...state,
        appCurrentState: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
