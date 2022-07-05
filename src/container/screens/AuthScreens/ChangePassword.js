import {useNavigation} from '@react-navigation/core';
import React, {useState, useEffect} from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {BackgroundCP} from '../../../assets/img/index';
import {Colors} from '../../../assets/styles/colors/colors';
import PairButton from '../../../components/Button/pairBtn';
import Header from '../../../components/header/index';
import MainHoc from '../../../components/Hoc/index';
import {Input} from '../../../components/Input/index';
import {Text} from '../../../components/Text';
import {useColors} from '../../../hooks/useColors';
import api from '../../../lib/api';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import {policySwitch} from '../../../assets/jsonData';
import {LogoutAction} from '../../../redux/auth/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {queryAllRealmObject} from '../../../database/index';
import {MASTER_DATA} from '../../../database/webSetting/masterSchema';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import {Getpassword} from '../../../redux/auth/action';

const Rule = [];

const ChangePassword = () => {
  const [newPassowrd, setNewPassword] = useState('');
  const [ConfirmPassowrd, setConfirmPassword] = useState('');
  const [policyToggle, setPolicyToggle] = useState(false);
  const [policyList, setPolicyList] = useState([]);
  const navigation = useNavigation();
  const {colors} = useColors();
  const token = useSelector((state) => state?.authReducer?.token);
  const decyptedTokenInfo = useSelector(
    (state) => state.authReducer?.tokenDecryption,
  );

  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const upPassword = useSelector((state) => state?.authReducer?.arr);
  const userCredentials = useSelector(
    (state) => state?.authReducer?.userCredentials,
  );
  const existingPass = useSelector(
    (state) => state?.SettingReducer?.existingPassword,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.SystemSettings.filter(
          (obj) =>
            (obj?.SettingId > 1 && obj?.SettingId <= 7) ||
            obj?.SettingId === 157,
        );
        if (result != undefined && result.length > 0) {
          const SortedData = [
            result[0],
            result[6],
            result[5],
            result[2],
            result[1],
            result[4],
            result[3],
          ];
          setPolicyList(SortedData);
        }
      })
      .catch((error) => {});
  };

  const onEditPass = (e) => {
    setNewPassword(e.nativeEvent.text);
  };
  const checkPassword = (newPassowrd) => {
    if (newPassowrd == userCredentials.password) {
      FlashMessageComponent('warning', strings('password.Different_Password'));
    } else {
      for (let j = 0; j < upPassword.length; j++) {
        if (newPassowrd == upPassword[j]) {
          FlashMessageComponent(
            'warning',
            strings('password.Different_Password'),
          );
        }
      }
    }
  };
  const onEditConPass = (e) => {
    setConfirmPassword(e.nativeEvent.text);
  };
  /* note change Password api calls  */

  const handleUpdatePasswordAPI = () => {
    const data = {
      CompanyId: userInfo?.CompanyId,
      Email: userCredentials?.userName,
      LoginId: userInfo?.sub,
      Password: newPassowrd,
      UserChangePassword: 1,
      UserResetPassword: 0,
    };
    const handleCallback = {
      success: (responseData) => {
        dispatch(Getpassword(newPassowrd));
        successHandler();
        FlashMessageComponent(
          'success',
          strings('password.Password_changed_successfully'),
        );
      },
      error: (responseError) =>
        FlashMessageComponent('reject', 'Something went wrong'),
    };
    try {
      api.changePssword(data, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {}
  };

  const successHandler = async () => {
    dispatch(LogoutAction());
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      }
      if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
  };
  const [validationArray, setValidationArray] = useState([
    false,
    false,
    false,
    false,
  ]);
  const validatePassword = (data) => {
    let newArray = [];

    if (data.match(`^(?=(?:.*?[A-Z]){${policyList[3].SettingValue}})`)) {
      newArray.push(true);
    } else {
      newArray.push(false);
    }

    if (data.match(`^(?=(?:.*?[a-z]){${policyList[4].SettingValue}})`)) {
      newArray.push(true);
    } else {
      newArray.push(false);
    }

    if (data.match(`^(?=(?:.*?[#?!@$%^&*-]){${policyList[5].SettingValue}})`)) {
      newArray.push(true);
    } else {
      newArray.push(false);
    }

    if (data.match(`^(?=(?:.*?[0-9]){${policyList[6].SettingValue}})`)) {
      newArray.push(true);
    } else {
      newArray.push(false);
    }
    setValidationArray(newArray);
    return newArray;
  };
  
  /* Validation function */

  const handleChangePassword = () => {
    if (newPassowrd != '' && ConfirmPassowrd != '') {
      if (
        newPassowrd != userCredentials.passwor &&
        newPassowrd.length >= policyList[0].SettingValue
      ) {
        const array = validatePassword(newPassowrd);
        const filteredArray = array.filter((i) => i == true);
        if (filteredArray.length >= policyList[2].SettingValue) {
          if (newPassowrd == ConfirmPassowrd) {
            const lastNPass = existingPass?.slice(-policyList[1].SettingValue);
            const val = lastNPass?.some((ele) => ele.password == newPassowrd);
            if (!val) {
              handleUpdatePasswordAPI();
            } else {
              let msg = `Must not reuse your last ${
                policyList[1].SettingValue > 1
                  ? `${policyList[1].SettingValue} passwords`
                  : `${policyList[1].SettingValue} password`
              }`;
              FlashMessageComponent('warning', msg);
            }
          } else {
            FlashMessageComponent(
              'warning',
              strings('password.Password_doesnot_match'),
            );
          }
        } else {
          FlashMessageComponent(
            'warning',
            strings('password.Invalid_Password'),
          );
        }
      } else {
        FlashMessageComponent('warning', strings('password.Invalid_Password'));
      }
    } else {
      if (newPassowrd == '') {
        FlashMessageComponent(
          'warning',
          strings('password.Please_enter_new_password'),
        );
      } else {
        FlashMessageComponent(
          'warning',
          strings('password.Please_enter_confirm_password'),
        );
      }
    }
  };
  const handleCancelBtn = () => {
    navigation.goBack();
  };

  const renderRow = (item) => {
    return (
      <View style={styles.renderrowContainer}>
        <Text>{'\u2022'}</Text>
        <Text style={styles.policyText} size={normalize(13)}>
          {policySwitch(item, I18nManager.isRTL)}
        </Text>
      </View>
    );
  };
  const policyText = () => {
    return (
      <View style={styles.policyTxtContainer}>
        {policyList.length > 0 &&
          policyList.map((item, index) => {
            return (
              <View
                style={{
                  ...styles.renderRowStyle,
                  marginLeft: index >= 3 ? normalize(20) : 0,
                }}
                key={index}>
                {renderRow(item)}
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={strings('cp.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
        leftIconDisable={
          decyptedTokenInfo?.IsChangePassword == '0' ? false : true
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <View style={styles.bodyWrapper}>
            <View style={styles.minicontainer}>
              <View style={styles.bannerWrap}>
                <BackgroundCP width={normalize(274)} height={normalize(245)} />
              </View>

              <View>
                <Input
                  placeholder={strings('cp.enter_password')}
                  onEndEditing={onEditPass}
                  secureTextEntry={true}
                  icon={'eye'}
                  label={strings('cp.new_password')}
                  labelStyles={styles.inputLabelStyle}
                  containerStyle={styles.inputContainer}
                  style={styles.textInput}
                  openEyeIconStyles={{color: colors?.PRIMARY_BACKGROUND_COLOR}}
                  onChangeText={(val) => {
                    setNewPassword(val), checkPassword(val);
                  }}
                />
                <Input
                  placeholder={strings('cp.enter_password')}
                  onEndEditing={onEditConPass}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  icon={'eye'}
                  label={strings('cp.confirm_password')}
                  containerStyle={styles.inputContainer}
                  style={styles.textInput}
                  labelStyles={styles.inputLabelStyle}
                  openEyeIconStyles={{color: colors?.PRIMARY_BACKGROUND_COLOR}}
                />
                <View style={styles.leftMargin}>
                  <View style={styles.policyContainer}>
                    <Text align={'flex-start'} size={textSizes.h11}>
                      {strings('cp.password_policy')}{' '}
                    </Text>
                    {policyToggle ? (
                      <Text
                        align={'flex-start'}
                        size={normalize(13)}
                        color={'darkblue'}
                        style={styles.alignCenter}
                        onPress={() => setPolicyToggle(false)}>
                        {strings('cp.hide_details')}
                      </Text>
                    ) : (
                      <Text
                        align={'flex-start'}
                        size={normalize(13)}
                        color={'darkblue'}
                        style={styles.alignCenter}
                        onPress={() => setPolicyToggle(true)}>
                        {strings('cp.show_details')}
                      </Text>
                    )}
                  </View>

                  {policyToggle && policyText()}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <PairButton
          title1={strings('pair_button.cancel')}
          title2={strings('cp.change_password')}
          onPressBtn2={handleChangePassword}
          onPressBtn1={handleCancelBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: normalize(15),
  },
  policyText: {
    flex: 1,
    paddingLeft: 5,
    color: Colors?.textParagragh,
    textAlign: 'left',
  },
  imgBanner: {
    width: '100%',
    height: '40%',
  },
  pairBtncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(15),
  },
  btnStyle: {
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: normalize(3),
    opacity: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: normalize(8),
    marginTop: normalize(10),
    borderColor: Colors.borderColor,
    height: normalize(35),
  },
  textInput: {
    fontSize: normalize(14),
    padding: normalize(5),
    paddingLeft: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 0.07,
    paddingVertical: normalize(20),
  },
  bannerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(40),
  },
  policyContainer: {
    flexDirection: 'row',
    marginTop: normalize(20),
    alignItems: 'center',
  },
  policyTxtContainer: {
    paddingVertical: normalize(15),
  },
  renderRowStyle: {
    marginTop: normalize(2),
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  minicontainer: {
    flex: 8,
  },
  inputLabelStyle: {
    marginLeft: normalize(3),
  },
  leftMargin: {
    marginLeft: normalize(5),
  },
  renderrowContainer: {
    flexDirection: 'row',
  },
  keyboardView: {
    flex: 1,
  },
  alignCenter: {
    alignSelf: 'center',
  },
});

export default MainHoc(ChangePassword);
