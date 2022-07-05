import React, {useEffect} from 'react';

import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginLayout from '../../../components/LoginLayout';
import {useValidation} from '../../../hooks/useValidation';
import Loader from '../../../components/Loader';
import {
  ASK_AGAIN,
  ENABLE_SECURITY,
  REMEMBER_ME,
  SET_INITIAL_NAVIGATION_FALSE,
} from '../../../redux/auth/types';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import {strings} from '../../../lib/I18n';

const UserName = () => {
  const [email, emailErrMsg, handleValidation, setEmail] =
    useValidation('email');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const initialNavigation = useSelector(
    (state) => state?.authReducer?.initialNavigation,
  );

  const handleSubmit = () => {
    handleValidation(email);
    if (emailErrMsg == '' && email != '') {
      navigation.navigate('Password', {email: email});
      dispatch({type: SET_INITIAL_NAVIGATION_FALSE});
    } else {
      if (emailErrMsg != '' && email != '') {
        FlashMessageComponent(
          'reject',
          strings('flashmessage.Invalid_username'),
           900,true, 
        );
      } else if (email == '') {
        FlashMessageComponent(
          'reject',
          strings('flashmessage.Enter_User_Name'),
          900,true,
        );
      }
    }
  };

  const onFocusOut = (e) => {
    handleValidation(e.nativeEvent.text);
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        try {
          const userLoggedIn = await AsyncStorage.getItem('isLoggedIn');
          const data = JSON.parse(userLoggedIn);
          if (data) {
            const userData = await AsyncStorage.getItem('userData');
            const userCreds = JSON.parse(userData);
            setEmail(userCreds?.email);
            const enableSecurityValue = await AsyncStorage.getItem(
              'enableSecurity',
            );
            const enableSecurity = JSON.parse(enableSecurityValue);
            dispatch({type: ENABLE_SECURITY, payload: enableSecurity});
            const askAgainValue = await AsyncStorage.getItem('askAgain');
            const askAgain = JSON.parse(askAgainValue);
            const rememberMeValue = await AsyncStorage.getItem('rememberMe');
            const rememberMe = JSON.parse(rememberMeValue);
            dispatch({type: ASK_AGAIN, payload: askAgain});
            dispatch({type: REMEMBER_ME, payload: rememberMe});
          }
        } catch (error) {}
      };
      getUser();
    }, []),
  );

  useEffect(() => {
    isUserPresent();
  }, []);

  const isUserPresent = async () => {
    try {
      const userLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const data = JSON.parse(userLoggedIn);
      if (data) {
        const userData = await AsyncStorage.getItem('userData');
        const userCreds = JSON.parse(userData);
        initialNavigation
          ? (navigation.navigate('Password', {email: userCreds?.email}),
            dispatch({type: SET_INITIAL_NAVIGATION_FALSE}))
          : null;
        setEmail(userCreds?.email);
      }
    } catch (error) {}
  };

  return (
    <>
      <LoginLayout
        value={email}
        action={handleSubmit}
        onFocusOut={onFocusOut}
        errMsg={emailErrMsg}
        setValue={setEmail}
      />
      <Loader visibility={isLoading} />
    </>
  );
};

export default UserName;
