import { MASTER_SUCCESS, FAILURE_RESPONSE, REQUEST, RESPONSE } from '../log/type';
import api from '../../lib/api';
import { buildHeader, Header } from '../../lib/buildHeader';

export const fetchMasterData = (data, callback) => {
  let endPoint = `?LoginId=${data.LoginId}&CompanyId=${data.CompanyId}&workCategoryId=0&WorkTypeId=0`;
  let headers = Header(data?.token);
  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        dispatch({ type: MASTER_SUCCESS, payload: data });
        callback ? callback(data) : null;
      },
      error: (error) => {
        console.log({ error });
      },
    };
    dispatch({ type: REQUEST });
    try {
      api.masterData([1], handleCallback, headers, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };
};
