import { FAILURE, SUCCESS } from './type';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../auth/types';
import api from '../../lib/api';

export const fetchNotificationList = (data, callback) => {

  let apiPayload = {
    CompanyId: data?.CompanyId,
    TechId: data?.TechId,
    FromDate: data?.FromDate,
    ToDate: data?.ToDate,
  };

  let token = data?.token;

  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        dispatch({
          type: SUCCESS,
          payload: data,
        });
        callback ? callback(data) : null;
      },
      error: (error) => {
        dispatch({
          type: FAILURE,
          payload: error,
        });

        dispatch({ type: SET_LOADER_FALSE });
      },
    };
    dispatch({ type: SET_LOADER_TRUE });
    api.GetUserNotifications(apiPayload, handleCallback, {
      Authorization: `Bearer ${token}`,
    });
  };
};
