import {
  SUCCESS,
  FAILURE,
  REQUEST,
  RESPONSE,
  CHECK_OUT_SUCCESS,
  TODAY_LOG_SUCCESS,
} from '../type';
import api from '../../../lib/api';
import {buildHeader, Header} from '../../../lib/buildHeader';
import {FlashMessageComponent} from '../../../components/FlashMessge';

export const handleTodayLog = (data, setMessage, callback) => {
  let endPoint = `?CompanyId=${data.CompanyId}&TechId=${data.TechId}`;
  let headers = Header(data?.token);
  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        setMessage('No Logs Found For Today');
        dispatch({type: TODAY_LOG_SUCCESS, payload: data});
      },
      error: (error) => {
        dispatch({type: RESPONSE});
        setMessage('No Logs Found For Today');
        // FlashMessageComponent(
        //   'reject',
        //   error?.error_description
        //     ? error?.error_description
        //     : 'something went wrong',
        // );
      },
    };
    // dispatch({type: REQUEST});
    try {
      api.todayLog('', handleCallback, headers, endPoint);
    } catch (error) {
      FlashMessageComponent('reject', 'Account Not Found');
      setMessage('No Logs Found For Today');
      // dispatch({type: RESPONSE});
    }
  };
};
