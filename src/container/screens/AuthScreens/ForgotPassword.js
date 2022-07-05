import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet} from 'react-native';
import LoginLayout from '../../../components/LoginLayout';
import {useValidation} from '../../../hooks/useValidation';
import api from '../../../lib/api';
import ForgotPassConfirmationModal from './ForgotPassConfirmationModal';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import Header from '../../../components/header/index';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {Colors} from '../../../assets/styles/colors/colors';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import {strings} from '../../../lib/I18n';

const ForgotPassword = () => {
  const [email, emailErrMsg, handleValidation, setEmail] =
    useValidation('email');

  const navigation = useNavigation();

  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const useercheck = useSelector((state) => state?.authReducer?.userInfo);

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const onFocusOut = (e) => {
    handleValidation(e.nativeEvent.text);
  };
  const handleSubmit = () => {
    handleValidation(email);
    if (emailErrMsg == '' && email != '') {
      const data = {
        ChangePassword: 1,
        Email: email,
      };
      const handleCallback = {
        success: (data) => {
          dispatch({type: SET_LOADER_FALSE});

          data?.Data
            ? (setShowModal(true), dispatch({type: SET_LOADER_FALSE}))
            : FlashMessageComponent('reject', strings('email.check_email'));
        },
        error: (error) => {
          dispatch({type: SET_LOADER_FALSE});
        },
      };
      try {
        dispatch({type: SET_LOADER_TRUE});
        api.forgetPassword(data, handleCallback);
      } catch (error) {
        dispatch({type: SET_LOADER_FALSE});
      }
    } else {
      if (email == '') {
        FlashMessageComponent('reject', strings('email.enter_email'));
      } else {
        FlashMessageComponent('reject', `${emailErrMsg}`);
      }
    }
  };

  const handleModalBtn = () => {
    setShowModal(false);
    navigation.navigate('UserName');
  };

  return (
    <>
      <LoginLayout
        type={'forgotPassword'}
        action={handleSubmit}
        onFocusOut={onFocusOut}
        errMsg={emailErrMsg}
        setValue={setEmail}
        value={email}
      />
      <Loader visibility={isLoading} />
      <ForgotPassConfirmationModal
        visibility={showModal}
        handleModalBtn={handleModalBtn}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
  },
});
export default ForgotPassword;
