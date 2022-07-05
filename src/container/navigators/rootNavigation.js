import AsyncStorage from '@react-native-async-storage/async-storage';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import {
  blueTheme,
  greenTheme,
  orangeTheme,
  redTheme,
} from '../../assets/styles/colors/themeColors';
import I18n from '../../lib/I18n';
import { ASK_AGAIN, ENABLE_SECURITY, REMEMBER_ME } from '../../redux/auth/types';
import Drawer from './Drawer';
import AuthStack from './Stack/AuthStack';

import { removePendingApi } from '../../redux/pendingApi/action';
import { sharedApiCall } from '../../lib/sharedApi';
import { useNetInfo } from '../../hooks/useNetInfo';
// import {useAppState} from '../../hooks/useAppState';

enableScreens();

const RootNavigation = () => {
  const theme = useSelector((state) => state.SettingReducer.theme);
  //const language = useSelector((state) => state.authReducer.language);
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const token = useSelector((state) => state?.authReducer?.token);
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const [crrLanguage, setCrrLanguage] = useState('');
  const { isConnected, isInternetReachable } = useNetInfo();
  // const {appStateVisible} = useAppState();
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('Language').then((res) => {
      I18n.locale = res;
      if (I18n?.locale === 'ar') {
        I18nManager.forceRTL(true);
      } else {
        I18nManager.forceRTL(false);
      }
      setCrrLanguage(res);
    });
  }, []);

  useEffect(() => {
    isUserPresent();
  }, []);

  const callback = () => { };

  const isUserPresent = async () => {
    try {
      const userLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const data = JSON.parse(userLoggedIn);

      if (data) {
        const enableSecurityValue = await AsyncStorage.getItem(
          'enableSecurity',
        );
        const enableSecurity = JSON.parse(enableSecurityValue);
        dispatch({ type: ENABLE_SECURITY, payload: enableSecurity });
        const askAgainValue = await AsyncStorage.getItem('askAgain');
        const askAgain = JSON.parse(askAgainValue);
        const rememberMeValue = await AsyncStorage.getItem('rememberMe');
        const rememberMe = JSON.parse(rememberMeValue);
        dispatch({ type: ASK_AGAIN, payload: askAgain });
        dispatch({ type: REMEMBER_ME, payload: rememberMe });
      }
      SplashScreen.hide();
    } catch (error) {
      SplashScreen.hide();
    }
  };

  const handlecb = () => {
    const remaingApi = stateInfo?.pendingApi.shift();
    dispatch(removePendingApi([remaingApi]));
  };

  useEffect(() => {
    if (stateInfo?.pendingApi.length > 0 && isConnected) {
      // (stateInfo, token, handlecb);
    }
  }, [isConnected, stateInfo]);

  const Blue = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...blueTheme,
    },
  };

  const Red = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...redTheme,
    },
  };

  const Green = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...greenTheme,
    },
  };

  const Orange = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...orangeTheme,
    },
  };

  const getTheme = () => {
    switch (theme?.mode) {
      case 'Blue': {
        return Blue;
      }
      case 'Red': {
        return Red;
      }
      case 'Green': {
        return Green;
      }
      case 'Orange': {
        return Orange;
      }
      default:
        break;
    }
  };

  const themeMode = getTheme();

  return (
    <NavigationContainer theme={themeMode}>
      {isLoggedIn ? <Drawer /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigation;
