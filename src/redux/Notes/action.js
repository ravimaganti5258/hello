import {NOTES__FAILURE, NOTES_SUCCESS} from './types';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../auth/types';
import api from '../../lib/api';
import {Header} from '../../lib/buildHeader';
import { FlashMessageComponent } from '../../components/FlashMessge';
import { strings } from '../../lib/I18n';

export const insertNotesApiCallAction = (payload, token, callback, isConnected) => {
  let headers = Header(token);
  return (dispatch) => {
  const handleCallback = {
    success: (data) => {
      const msgCode = data?.Message?.MessageCode;
      dispatch({
        type: NOTES_SUCCESS,
        payload: payload,
      });
      callback ? payload : null;
      FlashMessageComponent(
        'success',
        strings(`Response_code.${msgCode}`),
      );
    },
    error: (error) => {
      const msgCode = error?.Message?.MessageCode;
      dispatch({
        type: NOTES__FAILURE,
        payload: payload,
      });
      callback ? payload : null;
      FlashMessageComponent(
        'warning',
        strings(`Response_code.${msgCode}`),
      );
    },
  };
  // if (isConnected) {
    try{
    api.insertTechNotes(payload, handleCallback, headers);
    }
   catch (error) {
      console.log({error});
    }
  } 
  // else {
  //   let obj = {
  //     id: 1,
  //     url: 'insertNotes',
  //     data: apiPayload,
  //   };
  //   dispatch(pendingApi([...stateInfo?.pendingApi, obj]));
  // }
// }
  // api.insetNotes(apiPayload, handleCallback, headers);
};
