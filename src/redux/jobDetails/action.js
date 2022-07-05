import {FlashMessageComponent} from '../../components/FlashMessge';
import api from '../../lib/api';
import {
  MASTER_SUCCESS,
  FAILURE_RESPONSE,
  REQUEST,
  RESPONSE,
  JOB_RESPONSE,
} from '../log/type';

export const saveJobDetails = (data) => {
  return {
    type: JOB_RESPONSE,
    payload: data,
  };
};

export const fetchJobDetails = (data, callback) => {
  let apiPaylaod = {
    TechId: data?.TechId,
    WojobId: data?.WojobId,
    CompanyId: data?.CompanyId,
    customFieldentity: data?.customFieldentity,
  };
  const handleCallback = {
    success: (data) => {
      

      saveJobDetails(data[0]);
      callback && callback(data);
    },
    error: (error) => {
      console.log({error});
    },
  };
  try {
    api.jobDetails(apiPaylaod, handleCallback, {
      Authorization: `Bearer ${data?.token}`,
    });
  } catch (error) {}
};
