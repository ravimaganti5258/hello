import {
    MASTER_SUCCESS,
    FAILURE_RESPONSE,
    REQUEST,
    RESPONSE,
    INCEDENTSDATA,
  } from '../log/type';
  
  export const saveIncidentsDetails = (data) => {
    return {
      type: INCEDENTSDATA,
      payload: data,
    };
  };