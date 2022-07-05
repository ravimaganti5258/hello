import axios from 'axios';
import Instance from './axiosInstance';

export const request = async (
  featureURL,
  callback,
  data,
  secureRequest,
  endUrl = '',
) => {
  let response;
  let url;
  if (endUrl) {
    url = `${featureURL.url}/${endUrl}`;
  } else {
    url = featureURL.url;
  }
  console.groupCollapsed('API REQUEST');
  console.log({featureURL});
  console.log({secureRequest});
  console.log({data});
  console.log({endUrl});
  console.log({url});
  console.groupEnd();

  try {
    if (featureURL.type == 'GET') {
      response = await Instance.get(url, {
        headers: secureRequest,
      });
    } else if ('POST|PATCH|PUT'.includes(featureURL.type)) {
      response = await Instance[featureURL.type.toLocaleLowerCase()](
        url,
        data,
        {
          headers: secureRequest,
        },
      );
    } else if ('DELETE'.includes(featureURL.type)) {
      response = await Instance.delete(url, {
        headers: secureRequest,
      });
    }
    if (callback.complete) {
      callback.complete();
    }
    console.log('response====>', response);
    if (response.status == 200) {
      callback.success(response.data);
    } else {
      callback.error(response.data);
    }
  } catch (error) {
    if (callback.complete) {
      callback.complete();
    }

    if (error.response) {
      callback.error(error.response.data);
    } else {
      callback.error(error);
    }
  }
};
