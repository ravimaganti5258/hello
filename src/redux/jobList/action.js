import {JOB_LIST__FAILURE, JOB_LIST_SUCCESS} from './types';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../auth/types';
import api from '../../lib/api';

export const fetchJobList = (data, callback) => {
  let apiPayload = {
    CompanyId: data?.CompanyId,
    MaxRoleGroupId: data?.MaxRoleGroupId,
    LoginVendorId: data?.LoginVendorId,
    LoginId: data?.LoginId,
    // ScheduleStartDate: '12/12/2021',
    // ScheduleEndDate: '01/30/2022',
  };

  let token = data?.token;

  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        dispatch({
          type: JOB_LIST_SUCCESS,
          payload: data,
        });
        callback ? callback(data) : null;
      },
      error: (error) => {
        dispatch({
          type: JOB_LIST__FAILURE,
          payload: error,
        });

        dispatch({type: SET_LOADER_FALSE});
      },
    };
    dispatch({type: SET_LOADER_TRUE});
    try {
      api.jobListing(apiPayload, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };
};
