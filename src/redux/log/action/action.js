import {
  SUCCESS,
  FAILURE,
  REQUEST,
  RESPONSE,
  CHECK_OUT_SUCCESS,
  TODAY_LOG_SUCCESS,
  CHECK_REQUEST,
  CHECK_RESPONSE,
  CHECK_IN_SUCCESS,
} from '../type';
import api from '../../../lib/api';
import { buildHeader, Header } from '../../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../auth/types';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { CHECK_IN } from '../../../lib/api/requestTypes';

export const handleCheckIn = (data, callback) => {
  let headers = Header(data?.token);
  const Data = {
    MobUserLogId: data?.MobUserLogId,
    CompanyId: data?.CompanyId,
    TechId: data?.TechId,
  };

  return (dispatch) => {
    const handleCallback = {
      success: (data) => {

        dispatch({ type: CHECK_IN_SUCCESS, payload: data })
        // dispatch({type: SUCCESS, payload: data});
        setTimeout(() => {
          dispatch({ type: CHECK_RESPONSE });
        }, 5000);
      },
      error: (error) => {
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : 'something went wrong',
        );
        setTimeout(() => {
          dispatch({ type: CHECK_RESPONSE });
        }, 5000);
      },
    };

    try {
      dispatch({ type: CHECK_REQUEST });
      api.checkIn(Data, handleCallback, headers);
    } catch (error) {
      FlashMessageComponent('reject', 'Account Not Found');
      dispatch({ type: CHECK_RESPONSE });
    }
  };
};

export const handleCheckOut = (data, callback) => {
  let headers = Header(data?.token);
  const Data = {
    MobUserLogId: data?.MobUserLogId,
    CompanyId: data?.CompanyId,
    TechId: data?.TechId,
  };

  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        dispatch({ type: CHECK_OUT_SUCCESS, payload: data });
        setTimeout(() => {
          dispatch({ type: CHECK_RESPONSE });
        }, 5000);
      },
      error: (error) => {
        console.log({ error }),
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : 'something went wrong',
          );
        dispatch({ type: CHECK_RESPONSE });
      },
    };

    try {
      dispatch({ type: CHECK_REQUEST });
      api.checkOut(Data, handleCallback, headers);
    } catch (error) {
      FlashMessageComponent('reject', 'Account Not Found');
      dispatch({ type: CHECK_RESPONSE });
    }
  };
};

export const handleTodayLog = (data, setMessage, callback) => {
  let endPoint = `?CompanyId=${data.CompanyId}&TechId=${data.TechId}`;
  let headers = Header(data?.token);
  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        dispatch({ type: TODAY_LOG_SUCCESS, payload: data });
      },
      error: (error) => {
        setMessage('No Logs Found For Today');
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : 'something went wrong',
        );
      },
    };
    dispatch({ type: REQUEST });
    try {
      api.todayLog('', handleCallback, headers, endPoint);
    } catch (error) {
      setMessage('No Logs Found For Today');
      FlashMessageComponent('reject', 'Account Not Found');
    }
  };
};
