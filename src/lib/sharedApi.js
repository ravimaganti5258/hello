import api from './api';
import {Header} from './buildHeader';

export const sharedApiCall = (apiRequest, token, callback) => {
  const cb = {
    success: (data) => {
      console.log('response data',{data});
      callback();
    },
    error: (error) => {
      console.log({error});
    },
  };
  let headers = Header(token);
  console.log('apiRequest',{apiRequest});
  
  apiRequest?.pendingApi.map((item,index) => {
    switch (item?.url) {
      case 'insertNotes':
        api?.insetNotes(item.data, cb, headers);
        break;
      case 'saveDaynamicCheckListDetails':
        api?.saveDaynamicCheckListDetails(item.data, cb, headers);
        break;

      default:
        break;
    }
  });
};
