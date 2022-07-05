import {
  LOGIN_SUCCESS,
  LOGOUT,
  CHANGE_LANGUAGE,
  CHANGE_THEME,
  SET_LOADER_TRUE,
  SET_LOADER_FALSE,
  TOKEN_REFRESH,
  TOKEN_DECRYPTION,
  CHANGE_SCREEN,
  NEW_CURRENT_PASSWORD,
} from './types';
import I18n from '../../lib/I18n';
import api from '../../lib/api';
import {decryptToken} from '../../util/helper';
import {FlashMessageComponent} from '../../components/FlashMessge';
import DeviceInfo from 'react-native-device-info';
import {strings} from '../../lib/I18n';

const tokenDecryprtion = (token) => {
  try {
    return decryptToken(token);
  } catch (e) {}
};

export const getUserInfo = (userName, password, tokenData, saveCredentials) => {
  const userCredentials = {
    userName,
    password,
  };
  const userInfoConstant = `client_id=roclient&client_secret=secret&grant_type=password&username=${userName}&password=${password}&scope=dataEventRecords%20offline_access%20openid&SourceSystemId=2`;
  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {userCredentials, userInfo: data, tokenData: tokenData},
        });
        dispatch({type: SET_LOADER_FALSE});
        saveCredentials();
      },
      error: (error) => {
        dispatch({type: SET_LOADER_FALSE});
      },
    };
    try {
      api.userInfo(userInfoConstant, handleCallback, {
        Authorization: `Bearer ${tokenData?.access_token}`,
      });
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };
};

export const handleUserLogin = (data, callback, saveCredentials) => {
  const userName = data?.email;
  const password = data?.password;
  const TechId = 1;
  const SourceSystemId = 1;
  const LoginDate = data?.LoginDate;
  const DeviceID = data?.deviceId;
  const OSVersion = data?.osVersion;
  const Model = data?.modelName;
  const Manufacturer = data?.manuFacturerName;
  const DeviceToken = data?.deviceToken;
  const OS = data?.os;
  const AppVersion = data?.appVersion;

  const userLoginData = `client_id=roclient&client_secret=secret&grant_type=password&username=${userName}&password=${password}&scope=dataEventRecords%20offline_access%20openid&SourceSystemId=2&TechId=${TechId}&LoginDate=${LoginDate}&DeviceID=${DeviceID}&OSVersion=${OSVersion}&Model=${Model}&Manufacturer=${Manufacturer}&DeviceToken=${DeviceToken}&OS=${OS}&AppVersion=${AppVersion}`;
  // const userLoginData = `client_id=roclient&client_secret=secret&grant_type=password&username=${userName}&password=${password}&scope=dataEventRecords%20offline_access%20openid&SourceSystemId=2`;
  return (dispatch) => {
    const handleCallback = {
      success: (data) => {
       
        dispatch(getUserInfo(userName, password, data, saveCredentials));
        dispatch({
          type: TOKEN_DECRYPTION,
          payload: tokenDecryprtion(data?.access_token),
        });
      },
      error: (error) => {
       if(error?.error_description == 'Invalid username or password.'){
        FlashMessageComponent('reject', strings('password.Invalidpassword'));
       
       }else{
        FlashMessageComponent(
          'reject',
          error?.error_description || 'Something went wrong!',
        );
       }
        dispatch({type: SET_LOADER_FALSE});
        callback ? callback() : null;
      },
    };
    dispatch({type: SET_LOADER_TRUE});
    try {
      api.loginUser(userLoginData, handleCallback);
    } catch (error) {
      FlashMessageComponent('reject', 'Account Not Found');

      dispatch({type: SET_LOADER_FALSE});
      callback ? callback() : null;
    }
  };
};

export const handleRefreshToken = (userCredentials, callback) => {
  return (dispatch) => {
    try {
      const userName = userCredentials?.userName;
      const password = userCredentials?.password;
      const handleCallback = {
        success: (tokenRefreshData) => {
          dispatch({type: TOKEN_REFRESH, payload: tokenRefreshData});
        },
        error: (tokenRefreshError) => {},
      };
      const userLoginData = `client_id=roclient&client_secret=secret&grant_type=password&username=${userName}&password=${password}&scope=dataEventRecords%20offline_access%20openid&SourceSystemId=2`;
      api.loginUser(userLoginData, handleCallback);
    } catch (error) {}
  };
};

export const LogoutAction = () => {
  return {
    type: LOGOUT,
  };
};

export const changeTheme = (themeMode) => {
  return {
    type: CHANGE_THEME,
    payload: themeMode,
  };
};

export const Getpassword = (data) => {
  return {
    type: NEW_CURRENT_PASSWORD,
    payload:data,
    
    
  };
};
export const handleLanguageChange = (language, cb) => {
  I18n.locale = language;
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({type: CHANGE_LANGUAGE, payload: language});
      resolve('resolved');
    })
      .then(() => cb())
      .catch(() => {});
  };
};

export const handleDefaultPage = (screen, cb) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({type: CHANGE_SCREEN, payload: screen});
      resolve('resolved');
    })
      .then(() => cb())
      .catch(() => {});
  };
};
