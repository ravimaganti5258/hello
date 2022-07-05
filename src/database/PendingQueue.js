export const PENDING_API_QUEUE = 'PENDING_API_QUEUE';
export const PENDING_API = 'PENDING_API[]';


export const PendingApi = {
    name: PENDING_API,
    embedded: true,
    properties: {
      URl: 'string?',
      Payload: 'string?',
    },
  };


export const ApiQueue = {
    name: PENDING_API_QUEUE,
    properties: {
      id: 'int',
      PendingApi: {
        type: 'list',
        objectType: PENDING_API,
      },
     
  }
},
