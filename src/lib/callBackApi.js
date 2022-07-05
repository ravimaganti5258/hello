import api from './api';
import {Header} from './buildHeader';

export const fetchNotesOnline = (apiPayload, token, endpoint, callback) => {
  const cb = {
    success: (data) => {
      console.log('response data', {data});
      callback(data);
    },
    error: (error) => {
      console.log({error});
      callback('');
    },
  };
  let headers = Header(token);
  api?.GetNotesOnline(apiPayload, cb, headers, endpoint);
};

//get part list CallBack

export const fetchPartRequestList = (apiPayload, token, endpoint, callback) => {
  const cb = {
    success: (data) => {
      callback(data);
    },
    error: (error) => {
      console.log({error});
      callback('');
    },
  };
  let headers = Header(token);
  api?.GetPartRequestOnline(apiPayload, cb, headers, endpoint);
};

export const fetchCustomFeildsOnline = (
  apiPayload,
  token,
  endpoint,
  callback,
) => {
  const cb = {
    success: (data) => {
      console.log('response data', {data});
      callback(data);
    },
    error: (error) => {
      console.log({error});
      callback('');
    },
  };
  let headers = Header(token);
  api?.GetCustomFeildsMobileOnline(apiPayload, cb, headers, endpoint);
};


export const fetchAllAttachmentOnline = (
  apiPayload,
  token,
  endpoint,
  callback,
) => {
  const cb = {
    success: (data) => {
      console.log('response data', {data});
      callback(data);
    },
    error: (error) => {
      console.log({error});
      callback('');
    },
  };
  let headers = Header(token);
  api?.GetAllAttachmentOnline(apiPayload, cb, headers, endpoint);
};
export const fetchWoJobOnline = (apiPayload, token, callback) => {
    try {
    const cb = {
      success: (res) => {
        callback(res)
      },
      error: (errors) => {
        console.log({errors});
      },
    };
    const header = Header(token);
    api?.GetWoJobsOnline(apiPayload, cb, header);
  } catch (error) {
    console.log({error});
      }
  };

export const fetchProjectDetails = (apiPayload, token, endPoint, callback) => {
try {
  const cb = {
    success: (res) => {
      console.log('projectdetails response data', {res});
      callback(res)
    },
    error: (error) => {
      console.log({error});
    },
  };
  const header = Header(token);
  api?.GetProjectDetailsOnline(apiPayload, cb, header, endPoint);
} catch (error) {
  console.log({error});
    }
};

export const fetchCustomerDetails = (apiPayload, token, endPoint, callback) => {
  try {
  const cb = {
    success: (res) => {
      callback(res)
    },
    error: (error) => {
      console.log({error});
    },
  };
  const header = Header(token);
  api?.GetCustomerContactOnline(apiPayload, cb, header, endPoint);
} catch (error) {
  console.log({error});
    }
};

export const fetchCompleteReason = (apiPayload, token, endPoint, callback) => {
  try {
    const cb = {
      success: (res) => {
      callback(res)
      },
      error: (error) => {
        console.log({error});
      },
    };
    const header = Header(token);
    api?.GetCompletedStausReasonOnline(apiPayload, cb, header, endPoint);
  } catch (error) {
    console.log({error});
      }
  };

  export const fetchTechnicianDetail = (apiPayload, token, callback) => {
    try {
    const cb = {
      success: (res) => {
        callback(res)
      },
      error: (errors) => {
        console.log({errors});
      },
    };
    const header = Header(token);
    api?.GetTechnicianDetailsOnline(apiPayload, cb, header);
  } catch (error) {
    console.log({error});
      }
  };
  