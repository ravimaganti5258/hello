import React, {useState} from 'react';

import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {Colors} from '../../assets/styles/colors/colors';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {useColors} from '../../hooks/useColors';
import Button from '../Button';
import {Input} from '../Input';
import Switch from '../Switch';
import {Text} from '../Text';
import {
  ForgotPassword,
  FsmGridIcon,
  Samsung,
  BackgroundCP,
  BanerFP,
} from '../../assets/img';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {string} from 'prop-types';
import {strings} from '../../lib/I18n';

const LoginLayout = ({
  type,
  action,
  onFocusOut,
  value,
  errMsg,
  setValue,
  toggleSwitch,
  rememberMe,
}) => {
  const navigation = useNavigation();
  const {colors} = useColors();

  const handleNotYourAccount = async () => {
    try {
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys.length > 0) {
        if (Platform.OS === 'android') {
          await AsyncStorage.clear();
        }
        if (Platform.OS === 'ios') {
          await AsyncStorage.multiRemove(asyncStorageKeys);
        }
      }
      navigation.navigate('UserName');
    } catch (error) {}
  };

  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
          <SafeAreaView style={[styles.safeAreaContainer]}>
            {type !== 'forgotPassword' ? (
              <>
                <View
                  style={[
                    styles.loginConatiner,
                    {
                      paddingTop:
                        Platform.OS === 'ios'
                          ? 0
                          : type === 'password'
                          ? 0
                          : normalize(40),
                    },
                  ]}>
                  {type == 'password' ? (
                    <Samsung />
                  ) : (
                    <FsmGridIcon
                      height={normalize(53)}
                      width={normalize(213)}
                    />
                  )}
                  <View style={styles.marginTop}>
                    <Text
                      size={textSizes.h7}
                      fontFamily={fontFamily.bold}
                      align={'flex-start'}
                      color={colors.PRIMARY_BACKGROUND_COLOR}>
                      {strings('login.hello')}
                    </Text>
                    {/* {type == 'password' ? (
                    <Text
                    size={textSizes.h7}
                    color={Colors.secondryBlack}
                    style={styles.loginTxt}>
                    {strings('login.text_login')}
                  </Text>
                  ) : ( */}
                    <>
                    <Text
                      size={textSizes.h7}
                      color={Colors.secondryBlack}
                      style={styles.loginTxt}>
                      {strings('login.text_login')}
                    </Text>
                    <Text
                      size={textSizes.h7}
                      color={Colors.secondryBlack}
                      align={'flex-start'}>
                      {strings('login.text_account')}
                    </Text>
                    </>
                  {/* )} */}
{/*                     
                    {type == 'password' ? (
                    null
                  ) : (
                    <Text
                      size={textSizes.h7}
                      color={Colors.secondryBlack}
                      align={'flex-start'}>
                      {strings('login.text_account')}
                    </Text>
                  )}
                     */}
                  </View>
                  {/* <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      > */}
                  <Input
                    placeholder={
                      type == 'password'
                        ? strings('login.password')
                        : strings('login.user_name')
                    }
                    style={{
                      ...styles.inputStyles,
                      fontFamily: fontFamily.regular,
                    }}
                    placeHolderStyles={{
                      ...styles.inputStyles,
                      fontFamily: fontFamily.italic,
                    }}
                    value={value}
                    onEndEditing={onFocusOut}
                    onChangeText={setValue}
                    secureTextEntry={type == 'password' ? true : false}
                    icon={type == 'password' ? 'eye' : undefined}
                  />
                  <Button
                    title={
                      type == 'password'
                        ? strings('login.sign_in')
                        : strings('login.next')
                    }
                    style={styles.btnStyles}
                    backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    txtColor={'white'}
                    width={'100%'}
                    fontSize={textSizes.h10}
                    onClick={action}
                    txtStyle={styles.btnTxtStyles}
                  />
                  <View style={{marginVertical: normalize(15)}}>
                    {type == 'password' ? (
                      <View style={styles.switchContainerStyles}>
                        <Switch
                          value={rememberMe}
                          onChange={toggleSwitch}
                          trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
                        />
                        <Text
                          size={textSizes.h11}
                          style={{marginLeft: normalize(6)}}>
                          {strings('login.remember')}
                        </Text>
                      </View>
                    ) : (
                      <Text align={'flex-start'} size={textSizes.h11}></Text>
                    )}
                  </View>
                  {/* </KeyboardAvoidingView> */}
                </View>
                <View
                  style={{
                    flex: 0.35,
                    justifyContent: 'space-around',
                  }}>
                  <View style={styles.bottomContainer}>
                    <Text
                      align={'flex-start'}
                      color={colors?.PRIMARY_BACKGROUND_COLOR}
                      size={textSizes.h12}
                      onPress={() => navigation.navigate('ForgotPassword')}
                      fontFamily={fontFamily.semiBold}>
                      {strings('login.forgot_password')}
                    </Text>
                    {type == 'password' ? (
                      <Text
                        align={'flex-start'}
                        color={colors?.PRIMARY_BACKGROUND_COLOR}
                        size={textSizes.h12}
                        onPress={handleNotYourAccount}
                        fontFamily={fontFamily.semiBold}>
                        {strings('login.not_your_account')}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.marginTop}>
                    {type != 'password' ? (
                      <Text
                        align={'flex-start'}
                        color={Colors.darkGray2}
                        size={textSizes.h12}>
                        {strings('login.by_continue')}{' '}
                        <Text
                          size={textSizes.h12}
                          color={colors?.PRIMARY_BACKGROUND_COLOR}
                          fontFamily={fontFamily.semiBold}
                          onPress={() =>
                            navigation.navigate('PrivacyPolicy', {
                              header: false
                            })
                          }>
                          {' '}
                          {strings('login.privacy')}{' '}
                        </Text>
                      </Text>
                    ) : (
                      <Text align={'flex-start'} size={textSizes.h12}></Text>
                    )}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.forgotPassContainer}>
                <View style={styles.forgotPassSubContainer}>
                  <View style={{alignSelf: 'center'}}>
                    <BanerFP width={normalize(275)} height={normalize(256)} />
                  </View>
                  <View>
                    <Text
                      size={textSizes.h6}
                      align={'flex-start'}
                      fontFamily={fontFamily.bold}
                      color={Colors.darkestBlue}>
                      {strings('login.forgot_password')}
                    </Text>
                    <Text
                      size={textSizes.h9}
                      align={'flex-start'}
                      style={{marginVertical: normalize(10)}}
                      color={Colors.secondryBlack}>
                      {strings('login.reset')}
                    </Text>
                  </View>
                  <View>
                    {/* <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.container}> */}
                    <Input
                      placeholder={strings('login.email_placeholder')}
                      style={[
                        styles.inputStyles,
                        {fontFamily: fontFamily.regular},
                      ]}
                      placeHolderStyles={[
                        styles.inputStyles,
                        {fontFamily: fontFamily.italic},
                      ]}
                      value={value}
                      onEndEditing={onFocusOut}
                      onChangeText={setValue}
                    />
                    {/* </KeyboardAvoidingView> */}
                    <Button
                      title={strings('login.reset_password')}
                      style={styles.btnStyles}
                      backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
                      txtColor={Colors.white}
                      width={'100%'}
                      onClick={action}
                      fontSize={textSizes.h10}
                      txtStyle={styles.btnTxtStyles}
                    />
                  </View>
                </View>
              </View>
            )}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    marginHorizontal: normalize(45),
  },
  loginConatiner: {
    flex: 0.25,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  loginTxt: {
    marginVertical: normalize(4),
    alignSelf: 'flex-start',
  },
  btnStyles: {
    borderRadius: 0,
    alignSelf: 'center',
    marginTop: normalize(20),
    height: normalize(49),
    
  },
  inputStyles: {
    fontSize: normalize(15),
    width: '100%',
    alignSelf: 'center',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    
  },
  footerContainer: {
    flex: 0.4,
    justifyContent: 'flex-end',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  forgotPass: {
    flex: 0.3,
    justifyContent: 'center',
    marginBottom: normalize(10),
  },
  switchContainer: {
    marginTop: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyTxtContainer: {
    flex: 0.2,
    justifyContent: 'center',
  },
  btnTxtStyles: {
    fontFamily: fontFamily.bold,
   
    
  },
  forgotPassContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingVertical: normalize(10),
  },
  forgotPassTxtStyles: {
    fontStyle: 'italic',
    marginBottom: normalize(7),
  },
  forgotPassSubContainer: {
    flex: 0.6,
    justifyContent: 'space-around',
  },
  switchContainerStyles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(30),
  },
  marginTop: {
    marginTop: normalize(40),
  },
  scrollViewContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: Colors?.white,
  },
});
