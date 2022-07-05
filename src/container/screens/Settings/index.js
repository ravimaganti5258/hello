import React, { useEffect, useState } from 'react';
import { NativeModules, I18nManager } from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { Colors } from '../../../assets/styles/colors/colors';
import { Icon } from '../../../components/Icon';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { ANT_DESIGN, FEATHER, IONICONS } from '../../../util/iconTypes';
import { ASK_AGAIN, ENABLE_SECURITY } from '../../../redux/auth/types';
import { Text } from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import Switch from '../../../components/Switch';
import ListModal from './ListModal';
import BottomSheet from '../Dashboard/BottomSheet';
import {
  changeTheme,
  handleDefaultPage,
  handleLanguageChange,
} from '../../../redux/auth/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderComponent from '../../../components/header';
import MainHoc from '../../../components/Hoc';
import RNRestart from 'react-native-restart';
import { strings } from '../../../lib/I18n';
import DeviceInfo from 'react-native-device-info';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import { Header } from '../../../lib/buildHeader';
import api from '../../../lib/api';
import { setSearchBarVisibility } from '../../../redux/Profile/action';
import { changeAppTheme, changeHomePage, firstLogin, pushNotification } from '../../../redux/setting/action'
import { fetchLanguageListRelam } from '../../../database/webSetting';

const themeData = [
  {
    type: 'theme',
    name: 'Blue',
    color: Colors.blue,
  },
  {
    type: 'theme',
    name: 'Red',
    color: Colors.red,
  },
  {
    type: 'theme',
    name: 'Green',
    color: Colors.successGreen,
  },
  {
    type: 'theme',
    name: 'Orange',
    color: Colors.darkOrange,
  },
];

const languageData = [
  {
    type: 'language',
    displayName: 'English (United Kingdom)',
    name: 'English',
    languageCode: 'en',
  },
  {
    type: 'language',
    displayName: 'Arabic',
    name: 'Arabic',
    languageCode: 'ar',
  },
];
const defaultPage = [
  {
    type: 'screen',
    name: 'JobList',
    displayName: 'Job List View',
  },
  {
    type: 'screen',
    name: 'Dashboard',
    displayName: 'Dashboard',
  },
];

const HeaderContainer = ({
  text = strings('settings.Account_Settings'),
  iconName = 'user',
  iconType = FEATHER,
  iconSize = 18,
  textStyles,
  containerStyles,
}) => {
  return (
    <View style={[styles.headerContainer, containerStyles]}>
      <Icon type={iconType} name={iconName} size={normalize(iconSize)} />
      <Text
        style={{ marginLeft: normalize(5), ...textStyles }}
        fontFamily={fontFamily.semiBold}
        size={textSizes.h10}>
        {text}
      </Text>
    </View>
  );
};

const SwitchContainer = ({
  text = '',
  onChange,
  value,
  trackColor = Colors.blue,
  disabled = false,
  textStyles,
  containerStyles,
}) => {
  return (
    <View
      style={{
        ...styles.changePassContainer,
        paddingTop: normalize(5),
        ...containerStyles,
      }}>
      <Text style={{ width: '80%', ...textStyles,textAlign:'left' }} size={normalize(15)}>
        {text}
      </Text>
      <Switch
        value={value}
        onChange={onChange}
        trackColor={trackColor}
        disabled={disabled}
      />
    </View>
  );
};

const ForwardIcon = ({ color = Colors.blue }) => {
  return (
    <Icon
      type={FEATHER}
      name={'chevron-right'}
      size={normalize(15)}
      color={color}
      style={{
        transform: I18nManager.isRTL
          ? [{ rotate: '180deg' }]
          : [{ rotate: '0deg' }],
      }}
    />
  );
};

const AppSettings = ({
  optionText,
  value,
  hasColorBox = false,
  onPress,
  color = Colors.blue,
  containerStyles,
}) => {
  return (
    <View
      style={[
        styles.changePassContainer,
        containerStyles,
        { paddingVertical: normalize(15), paddingBottom: 0 },
      ]}>
      <Text size={normalize(15)}>{optionText}</Text>
      <View style={[styles.changePassContainer, { paddingVertical: 0 }]}>
        {hasColorBox ? (
          <View style={[styles.colorBox, { backgroundColor: color }]} />
        ) : null}
        <Text size={normalize(15)} onPress={onPress} color={color}>
          {value}
        </Text>
        <ForwardIcon color={color} />
      </View>
    </View>
  );
};

const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state?.SettingReducer?.theme);
  const screen = useSelector((state) => state?.SettingReducer.screen);
  const { colors } = useColors();
  const navigation = useNavigation();
  const enableSecurity = useSelector(
    (state) => state.authReducer?.enableSecurity,
  );
  const rememberMe = useSelector((state) => state.authReducer?.rememberMe);
  const [lockSwitch, setLockSwitch] = useState(enableSecurity);
  const [langList, setLangList] = useState([]);


  const toggleLockSwitch = async () => {
    setLockSwitch(!lockSwitch);
  };
  useEffect(() => {
    handleSecurity();
  }, [lockSwitch]);

  useEffect(() => {
    const cb = (res) => {
      setLangList(res)
    }
    fetchLanguageListRelam(cb)

  }, [])

  const handleSecurity = async () => {
    dispatch({ type: ENABLE_SECURITY, payload: lockSwitch });
    if (rememberMe) {
      try {
        await AsyncStorage.setItem(
          'enableSecurity',
          JSON.stringify(lockSwitch),
        );
      } catch (error) { }
    }
  };
  const enableNotification = useSelector((state) => state?.SettingReducer.pushNotify);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const enableHomepage = useSelector((state) => state?.SettingReducer.showDashboard);
  let systemName = DeviceInfo.getSystemName();
  const toggleEnablePushNotification = async () => {
    await AsyncStorage.setItem(
      'enablePushNotifications',
      JSON.stringify(!enableNotification),
    );
  };
  // ====================
  useEffect(() => {
    getPushNotify();
  }, []);
  const getPushNotify = () => {
    try {
      AsyncStorage.getItem('enablePushNotifications').then((res) => {
        if (res != null) {
          const flag = JSON.parse(res);
          setEnablePushNotification(flag);
        }

      });
    } catch (error) { }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('fcmToken');

      if (value !== null) {
        getNotificationApi(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  const getNotificationApi = (fcm) => {

    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        CompanyId: userInfo.CompanyId,
        DeviceOS: systemName,
        DeviceToken: fcm,
        LoginId: userInfo?.sub,
        MobileTypeId: 1,
      };
      const handleCallback = {
        success: (data) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);

      api.getNotification(data, handleCallback, header);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };


  useEffect(() => {
    if (enableNotification == true) {
      getData();
      getNotificationApi();
    }
  }, [enableNotification, systemName]);
  // =========================
  const [openThemeModal, setOpenThemeModal] = useState(false);
  const toggleThemeMode = () => {
    setOpenThemeModal(!openThemeModal);
  };

  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const toggleLanguageModal = () => {
    setOpenLanguageModal(!openLanguageModal);
  };

  const [openDefaultPage, setOpenDefaultPage] = useState(false);
  const toggleDefaultPageModal = () => {
    setOpenDefaultPage(!openDefaultPage);
  };

  const handleThemeChange = (theme) => {
    dispatch(changeAppTheme(theme));
  };

  const changeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('Language', language);
      AsyncStorage.getItem('Language').then((res) => {
        dispatch(handleLanguageChange(language));
        if (res === 'ar') {
          I18nManager.forceRTL(true);
        } else {
          I18nManager.forceRTL(false);
        }
        RNRestart.Restart();
      });
    } catch (e) { }
  };

  const defaultScreen = async (screen) => {
    try {
      await AsyncStorage.setItem('JobList', screen);
      AsyncStorage.getItem('JobList').then((res) => {
        dispatch(changeHomePage(screen));
        if (res === 'JobList') {
          //joblist
        } else {
          //Dashboard
        }
      });
    } catch (e) { }
  };

  return (
    <>
      <HeaderComponent
        title={strings('settings.settings')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: Colors.white }}>
        <View style={styles.settingsContainer}>
          <HeaderContainer />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('changePassword')}
            style={styles.changePassContainer}>
            <Text size={normalize(15)}>
              {strings('settings.Change_Password')}
            </Text>
            <ForwardIcon color={colors?.PRIMARY_BACKGROUND_COLOR} />
          </TouchableOpacity>
          <SwitchContainer
            text={strings('settings.switch_text')}
            onChange={toggleLockSwitch}
            value={lockSwitch}
            trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
          />
          <View style={styles.notificationView}>
            <HeaderContainer
              iconType={IONICONS}
              containerStyles={{ paddingTop: normalize(17) }}
              text={strings('settings.Notifications')}
              iconName={'notifications-outline'}
            />
            <SwitchContainer
              text={strings('settings.Enable_Push_Notifications')}
              onChange={() => dispatch(pushNotification(!enableNotification))}
              value={enableNotification}
              trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
              style={styles.notificationOption}
            
            />
          </View>
          <View style={styles.notificationView}>
            <HeaderContainer
              iconType={ANT_DESIGN}
              containerStyles={{ paddingTop: normalize(17) }}
              text={strings('settings.App_Settings')}
              iconName={'appstore-o'}
            />
            <AppSettings
              optionText={strings('settings.Theme')}
              color={colors?.PRIMARY_BACKGROUND_COLOR}
              hasColorBox={true}
              value={strings(`settings.${theme?.mode}`)}
              onPress={toggleThemeMode}
            />
            <AppSettings
              optionText={strings('settings.Language')}
              color={colors?.PRIMARY_BACKGROUND_COLOR}
              value={I18nManager?.isRTL === true ? strings('settings.Arabic') : strings('settings.English')}
              onPress={toggleLanguageModal}
            />
            <AppSettings
              optionText={strings('settings.Default_Home_Page')}
              color={colors?.PRIMARY_BACKGROUND_COLOR}
              value={screen != undefined && screen != '' ?
              strings(`settings.${screen}`) 
              : ''}
              onPress={toggleDefaultPageModal}
            />
            <SwitchContainer
              text={strings('settings.Show_Dashboard_Text')}
              onChange={() => dispatch(firstLogin(!enableHomepage))}
              value={enableHomepage}
              trackColor={colors.PRIMARY_BACKGROUND_COLOR}
              disabled={false}
              textStyles={{ color: enableHomepage ? Colors.black : Colors.darkGray }}
              containerStyles={{ paddingTop: normalize(10) }}
            />
          </View>
          <View style={styles.notificationView}>
            <HeaderContainer
              iconType={FEATHER}
              containerStyles={{ paddingTop: normalize(14) }}
              text={strings('settings.Information')}
              iconName={'info'}
            />
            <View style={styles.changePassContainer}>
              <Text size={normalize(15)}>
                {strings('settings.App_Version')}
              </Text>
              <Text
                color={colors?.PRIMARY_BACKGROUND_COLOR}
                size={normalize(15)}>
                3.75.4
              </Text>
            </View>
          </View>
          <ListModal
            visibility={openThemeModal}
            handleModalVisibility={toggleThemeMode}
            data={themeData}
            title={strings('settings.Select_Theme')}
            handleAction={handleThemeChange}
            type={'theme'}
          />
          <ListModal
            visibility={openLanguageModal}
            handleModalVisibility={toggleLanguageModal}
            data={langList}
            title={strings('settings.Select_Language')}
            handleAction={changeLanguage}
            type={'language'}
          />
          <ListModal
            visibility={openDefaultPage}
            handleModalVisibility={toggleDefaultPageModal}
            data={defaultPage}
            title={strings('settings.Default_Home_Page')}
            handleAction={defaultScreen}
            type={'screen'}
          />
        </View>
        {/* <Loader visibility={isLoading} /> */}

      </ScrollView>
    </>
  );
};

export default MainHoc(Settings);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  // safeAreaContainer: {
  //   flex: 1,
  //   backgroundColor: Colors.white,
  //   marginLeft: 10,
  //   marginRight: 5,
  // },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(14),
  },
  notificationView: {
    marginTop: normalize(20),
   // backgroundColor:'red',
   // textAlign:'right'
  },
  notificationOption:{
    textAlign:'right',
    marginLeft:30
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: normalize(10),
    borderBottomWidth: normalize(0.6),
    borderBottomColor: Colors.flatGrey,
    
  },
  changePassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(12),
    marginTop: normalize(8),
    
  },
  colorBox: {
    height: normalize(14),
    width: normalize(14),
    borderRadius: normalize(3),
    marginHorizontal: normalize(5),
    
  },
});
