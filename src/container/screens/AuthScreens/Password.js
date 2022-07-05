import React, {useState, useEffect} from 'react';

import {useRoute} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';

import LoginLayout from '../../../components/LoginLayout';
import {useValidation} from '../../../hooks/useValidation';
import {handleUserLogin} from '../../../redux/auth/action';
import {REMEMBER_ME} from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import {Platform} from 'react-native';
import {queryAllRealmObject} from '../../../database/index';
import {MASTER_DATA} from '../../../database/webSetting/masterSchema';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import DeviceInfo from 'react-native-device-info';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {saveExistingPassword} from '../../../redux/setting/action';
import {strings} from '../../../lib/I18n';

const Password = () => {
  const [password, passErrMsg, handleValidation, setPassword] =
    useValidation('password');

  const [wrongAttemps, setWrongAttemps] = useState(0);
  const [wrongAttempsCount, setWrongAttempsCount] = useState(10);
  const [appLockTime, setappLockTime] = useState(3000);
  const [fcmToken, setfcmToken] = useState(null);
  const [manuFacturer, setmanuFacturer] = useState('');
  const [model, setmodel] = useState('');
  const [systemVersion, setsystemVersion] = useState('');
  const [deviceId, setdeviceId] = useState('');
  const [osName, setosName] = useState('');
  const [appVersion, setappVersion] = useState('');
  const token = useSelector((state) => state?.authReducer?.token);
  const existingPass = useSelector(
    (state) => state?.SettingReducer?.existingPassword,
  );

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.SystemSettings.filter(
          (obj) => obj?.SettingId === 8 || obj?.SettingId === 9,
        );
        if (result != undefined && result.length > 0) {
          setWrongAttempsCount(result[0]?.SettingValue);
          setappLockTime(result[1]?.SettingValue);
        }
      })
      .catch((error) => {});
  };

  const updateWrongAttempsCount = () => {
    setWrongAttemps((prevCount) => prevCount + 1);
  };

  const isLoading = useSelector((state) => state?.authReducer?.isLoading);

  const route = useRoute();
  const {email} = route.params;
  const dispatch = useDispatch();
  const [switchValue, setSwitchValue] = useState(false);

  const toggleSwitchValue = () => {
    setSwitchValue(!switchValue);
  };
  const callBack = () => {
    updateWrongAttempsCount();
  };

  const handleRememberMe = () => {
    dispatch({type: REMEMBER_ME, payload: switchValue});
  };

  const saveCredentials = async () => {
    if (switchValue) {
      try {
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify({email, password}),
        );
        await AsyncStorage.setItem(
          'rememberMe',
          JSON.stringify(JSON.stringify(switchValue)),
        );
      } catch (error) {}
    } else {
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys.length > 0) {
        if (Platform.OS === 'android') {
          await AsyncStorage.clear();
        }
        if (Platform.OS === 'ios') {
          await AsyncStorage.multiRemove(asyncStorageKeys);
        }
      }
    }
    let obj = {email: email, password: password};
    let passArry = [...existingPass];
    passArry.push(obj);

    dispatch(saveExistingPassword(passArry));
  };

  useEffect(() => {
    DeviceInfo.getManufacturer().then((manufacturer) => {
      setmanuFacturer(manufacturer);
    });
    let modelName = DeviceInfo.getModel();
    setmodel(modelName);
    let systemVersions = DeviceInfo.getSystemVersion();
    let systemName = DeviceInfo.getSystemName();
    setosName(systemName);
    setsystemVersion(systemVersions);

    let deviceId = DeviceInfo.getDeviceId();
    setdeviceId(deviceId);
    let appVersion = DeviceInfo.getVersion();
    setappVersion(appVersion);
    getData();
  }, [DeviceInfo]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('fcmToken');

      if (value !== null) {
        setfcmToken(value);
      }
    } catch (e) {}
  };

  const handleActions = async () => {
    let today = new Date();
    let date =
      parseInt(today.getMonth() + 1) +
      '/' +
      today.getDate() +
      '/' +
      today.getFullYear();
    dispatch(
      handleUserLogin(
        {
          email: email,
          password: password,
          deviceToken: fcmToken,
          manuFacturerName: manuFacturer,
          modelName: model,
          osVersion: systemVersion,
          os: osName,
          LoginDate: date,
          appVersion: appVersion,
          deviceId: deviceId,
        },
        callBack,
        saveCredentials,
      ),
    );
    handleRememberMe();
  };

  useEffect(() => {
    isUserPresent();
  }, []);

  useEffect(() => {}, [wrongAttemps]);

  const isUserPresent = async () => {
    try {
      const userLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const data = JSON.parse(userLoggedIn);
      if (data) {
        const userData = await AsyncStorage.getItem('userData');
        const userCreds = JSON.parse(userData);
        setPassword(userCreds?.password);
        setSwitchValue(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    let clear;
    if (wrongAttemps >= 6) {
      clear = setTimeout(() => {
        setWrongAttemps(0);
      }, 30000);
    }
    return () => clearTimeout(clear);
  }, [wrongAttemps]);

  const handleSubmit = () => {
    if (wrongAttemps < parseInt(wrongAttempsCount)) {
      if (password != '') {
        handleActions();
      } else {
        updateWrongAttempsCount();
        FlashMessageComponent('reject', strings('flashmessage.Enter_Password'));
      }
    } else {
      FlashMessageComponent('reject', strings('flashmessage.App_is_locked'));
    }
  };

  const onFocusOut = (e) => {
    handleValidation(e.nativeEvent.text);
  };

  return (
    <>
      <LoginLayout
        value={password}
        type={'password'}
        onFocusOut={onFocusOut}
        action={handleSubmit}
        errMsg={passErrMsg}
        setValue={setPassword}
        toggleSwitch={toggleSwitchValue}
        rememberMe={switchValue}
      />
      <Loader visibility={isLoading} />
    </>
  );
};

export default Password;
