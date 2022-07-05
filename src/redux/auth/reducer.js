import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  CHANGE_LANGUAGE,
  CHANGE_THEME,
  ASK_AGAIN,
  REMEMBER_ME,
  ENABLE_SECURITY,
  SET_LOADER_TRUE,
  SET_LOADER_FALSE,
  TOKEN_REFRESH,
  SET_INITIAL_NAVIGATION_FALSE,
  TOKEN_DECRYPTION,
  SHOW_LOGOUT_MODAL,
  HIDE_LOGOUT_MODAL,
  CHANGE_SCREEN,
  NEW_CURRENT_PASSWORD,
} from './types';

const initialState = {
  
  userInfo: {},
  isLoggedIn: false,
  error: null,
  isLoading: false,
  language: 'en',
  theme: {mode: 'Blue'},
  askForManageSecurity: true,
  rememberMe: false,
  enableSecurity: false,
  token: '',
  userCredentials: null,
  tokenDetails: {},
  initialNavigation: true,
  tokenDecryption: {},
  showLogoutModal: false,
  screen: 'Dashboard',
  arr: []
  
};

export const authReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case SET_LOADER_TRUE: {
      return {...state, isLoading: true};
    }
    case SET_LOADER_FALSE: {
      return {...state, isLoading: false};
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        userCredentials: action?.payload?.userCredentials,
        userInfo: action?.payload?.userInfo,
        error: null,
        isLoading: false,
        isLoggedIn: true,
        tokenDetails: action?.payload?.tokenData,
        token: action?.payload?.tokenData?.access_token,
      };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        userInfo: {},
        error: action.payload,
        isLoading: false,
        isLoggedIn: false,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        userInfo: {},
        error: null,
        isLoading: false,
        isLoggedIn: false,
        rememberMe: false,
        askForManageSecurity: true,
        enableSecurity: false,
        enablePushNotifications: false,
        token: '',
        userCredentials: null,
        tokenDetails: {},
        showLogoutModal: false,
      };
    }
    case TOKEN_REFRESH: {
      return {
        ...state,
        tokenDetails: action?.payload,
        token: action?.payload?.access_token,
      };
    }
    case CHANGE_LANGUAGE: {
      return {
        ...state,
        language: action?.payload,
      };
    }
    case CHANGE_SCREEN: {
      return {
        ...state,
        screen: action?.payload,
      };
    }
    case CHANGE_THEME: {
      return {
        ...state,
        theme: {mode: action?.payload},
      };
    }
    case ASK_AGAIN: {
      return {
        ...state,
        askForManageSecurity: action?.payload,
      };
    }
    case REMEMBER_ME: {
      return {
        ...state,
        rememberMe: action.payload,
      };
    }
    case ENABLE_SECURITY: {
      return {
        ...state,
        enableSecurity: action.payload,
      };
    }
    case SET_INITIAL_NAVIGATION_FALSE: {
      return {
        ...state,
        initialNavigation: false,
      };
    }
    case TOKEN_DECRYPTION: {
      return {
        ...state,
        tokenDecryption: action.payload,
      };
    }
    case SHOW_LOGOUT_MODAL: {
      return {
        ...state,
        showLogoutModal: true,
      };
    }
    case HIDE_LOGOUT_MODAL: {
      return {
        ...state,
        showLogoutModal: false,
      };
    }
    case NEW_CURRENT_PASSWORD :
    return { 
        ...state,
        arr: [...state.arr , action.payload]
      };
    
    default: {
      return state;
    }
  }
};
