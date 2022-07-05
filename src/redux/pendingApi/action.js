import {
  PENDING_API,
  REMOVE_PENDING_API,
  SAVE_RES,
  NETWORK_CONNECTED,
  APP_CURRENT_STATE,
} from './types';

export const pendingApi = (data) => {
  return {
    type: PENDING_API,
    payload: data,
  };
};

export const removePendingApi = (val) => {
  return {
    type: REMOVE_PENDING_API,
    payload: val,
  };
};

export const networkConnectivity = (val) => {
  return {
    type: NETWORK_CONNECTED,
    payload: val,
  };
};

export const appCurrentState = (val) => {
  return {
    type: APP_CURRENT_STATE,
    payload: val,
  };
};
