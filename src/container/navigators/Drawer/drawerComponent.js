import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  I18nManager,
  Linking,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Logout, StarFill, ToggleArrow } from '../../../assets/img/index';
import { Colors } from '../../../assets/styles/colors/colors';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ProfilePicture from '../../../components/ProfilePicture';
import { Text } from '../../../components/Text';
import { CHECK_IN } from '../../../database/allSchemas';
import {
  insertNewRealmObject,
  queryAllRealmObject,
} from '../../../database/index';
import { useColors } from '../../../hooks/useColors';
import { useLogout } from '../../../hooks/useLogout';
import { useNetInfo } from '../../../hooks/useNetInfo';
import { fontFamily, normalize } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { LogoutAction } from '../../../redux/auth/action';
import { HIDE_LOGOUT_MODAL } from '../../../redux/auth/types';
import { handleCheckIn, handleCheckOut } from '../../../redux/log/action/action';
import { BottomMenu, drawerMenuArray } from '../../../util/sideMenu';
import { styles } from './styles';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';

const DrawerComponent = ({ navigation }) => {
  const checkIn = useSelector((state) => state.logReducer.ischeckIn);
  const [expand, setExpand] = useState(false);
  const { colors } = useColors();
  const { isConnected } = useNetInfo();
  const [checkFlag, setCheckFlag] = useState(false);
  const dispatch = useDispatch();
  const checkoutData = useSelector((state) => state.logReducer);
  const token = useSelector((state) => state.authReducer.token);
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const userCredentials = useSelector(
    (state) => state?.authReducer?.userCredentials,
  );

  const { showLogoutModal, toggleLogoutModal } = useLogout();
  const loading = useSelector((state) => state.logReducer.isLoading);
  const [contactSupport, setContactSupport] = useState({});

  //**** Logout function   */
  const handleUserLogout = async () => {
    try {
      dispatch({ type: HIDE_LOGOUT_MODAL });
      dispatch(LogoutAction());
    } catch (error) { }
  };

  useEffect(() => {
    fetchContactSupport();
  }, []);

  const fetchContactSupport = () => {
    queryAllRealmObject(MASTER_DATA).then((data) => {
      const res = data[0];
      const result = res?.SystemSettings.filter((obj) => obj?.SettingId == 105);
      result.length > 0 && setContactSupport(result);
    });
  };

  const callBack = () => { };

  const fetchData = () => {
    queryAllRealmObject(CHECK_IN).then((obj) => {
      obj.map((item) => {
        setCheckFlag(item.checkInLabel == 'Check-In' ? true : false);
      });
    });
  };

  //**** Check-in Check-out handler  */
  const handleBtnClick = () => {
    const CHECKIN = checkoutData.ischeckIn;
    if (!isConnected) {
      let obj = {
        id: '1',
        checkInLabel: checkIn ? 'Check-Out' : 'Check-In',
        time: new Date(),
      };
      insertNewRealmObject(obj, CHECK_IN).then((res) => {
        fetchData();
      });
    } else {
      if (!CHECKIN) {
        let data = {
          MobUserLogId: 0,
          CompanyId: userInfo.CompanyId,
          TechId: userInfo.sub,
          token: token,
        };

        dispatch(handleCheckIn(data));
      } else {
        let res = checkoutData.userData;
        let response = res?.Data;

        const logId = response?.split('~');
        let data = {
          MobUserLogId: logId ? logId[0] : 0,
          CompanyId: userInfo.CompanyId,
          TechId: userInfo.sub,
          token: token,
        };
        dispatch(handleCheckOut(data));
      }
    }
  };

  const onPressContact = () => {
    let number = contactSupport[0]?.SettingValue
      ? contactSupport[0]?.SettingValue
      : '9999999';

    if (Platform.OS == 'ios') {
      Linking.canOpenURL(`telprompt:${number}`).then((supported) => {

        if (supported) {
          return Linking.openURL(`telprompt:${number}`).catch(() => null);
        } else {
          FlashMessageComponent('warning', strings('flashmessage.Dialer_is_not_supported'));
        }
      });
    } else {
      Linking.openURL(`tel:${number}`);
    }
  };
  //**** Profile section */
  const profileInfo = () => {
    const status = isConnected ==true ? 'online' : 'offline'
    return (
      <>
        <ProfilePicture imageStyles={styles.imgStyle} type={status} />
        <View style={styles.profileDetailStyle}>
          <Text
            style={{
              ...styles.profileName,
              color: colors?.PRIMARY_BACKGROUND_COLOR,
            }}
            align={'flex-start'}>
            {userInfo?.DisplayName}
          </Text>
          <Text style={styles.emailField} align={'flex-start'}>
            {userCredentials?.userName}
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          height: normalize(50),
          backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
          marginTop: normalize(-50),
        }}></View>
      <ScrollView style={{ color: Colors.white }}>
        <StatusBar barStyle={'light-content'} />
        <View style={[styles.container]}>
          {/* Header Section  */}

          <View style={styles.sideMenuHeader}>
            <View style={styles.headerRow1}>
              <TouchableOpacity
                style={styles.profileInfoContainer}
                onPress={() => navigation.navigate('MyProfile')}>
                {profileInfo()}
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleLogoutModal}>
                <Logout
                  style={styles.logOutBtn}
                  height={normalize(20)}
                  width={normalize(20)}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerBtnwrap}>
              <Button
                title={
                  !checkIn
                    ? strings(`side_menu.check-in`)
                    : strings(`side_menu.check-out`)
                }
                style={styles.checkBtnStyle}
                backgroundColor={
                  !checkIn ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.red
                }
                txtColor={'white'}
                width={'42%'}
                height={'auto'}
                onClick={() => {
                  handleBtnClick();
                }}
                fontSize={normalize(13)}
                fontFamily={fontFamily.bold}
                loading={loading}
                loaderStyle={{ padding: normalize(0) }}
              />
              <Button
                title={strings('today_log.header_title')}
                style={styles.logBtnStyle}
                fontFamily={fontFamily.regular}
                backgroundColor={Colors.lightBackground}
                txtColor={colors?.PRIMARY_BACKGROUND_COLOR}
                width={'35%'}
                onClick={() => {
                  navigation.navigate('TodaysLog');
                }}
                fontSize={normalize(12)}
              />
            </View>
          </View>

          {/* Drawer Menu  section  */}

          <View style={styles.sideMenuContainer}>
            {drawerMenuArray.map((item, index) => {
              return (
                <View
                  style={[
                    styles.menuBtnWrap,
                    {
                      backgroundColor:
                        expand && item.title == 'Inventory'
                          ? Colors.aliceBlue
                          : null,
                    },
                  ]}
                  key={item.title}>
                  <TouchableOpacity
                    style={[styles.menuWrap]}
                    onPress={() =>
                      item.title == 'Inventory'
                        ? setExpand(!expand)
                        : navigation.navigate(item.navigation)
                    }>
                    <View style={styles.menuIcon}>
                      <item.Icon
                        height={item.height}
                        width={item.width}
                        fill={colors?.PRIMARY_BACKGROUND_COLOR}
                      />
                    </View>
                    <Text
                      style={
                        I18nManager.isRTL
                          ? [styles.menuText]
                          : [styles.menuText]
                      }>
                      {strings(`side_menu.${item?.title}`)}
                    </Text>
                    {item.title == 'Inventory' && (
                      <View style={styles.toggleArrowWrap}>
                        <ToggleArrow
                          style={
                            I18nManager.isRTL
                              ? {
                                transform: expand
                                  ? [{ rotate: '90deg' }]
                                  : [{ rotate: '180deg' }],
                              }
                              : {
                                transform: expand
                                  ? [{ rotate: '90deg' }]
                                  : [{ rotate: '360deg' }],
                              }
                          }
                          height={normalize(10)}
                          width={normalize(10)}
                        />
                      </View>
                    )}
                  </TouchableOpacity>

                  {expand && item.title == 'Inventory' && (
                    <View style={styles.subMenuContainer}>
                      {item.subTitle.map((i, index) => {
                        return (
                          <TouchableOpacity
                            key={i.title}
                            style={[styles.subMenuBtnWrap]}
                            onPress={() => {
                              navigation.navigate(i.navigation);
                            }}>
                            <Text style={styles.subMenuTextStyle}>
                              {strings(`side_menu.${i?.title}`)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Bottom menu section  */}
            <>
              <View style={styles.bottomMenuSep} />
              {BottomMenu.map((item, index) => {
                return (
                  <View style={styles.menuBtnWrap} key={item.title}>
                    <TouchableOpacity
                      style={styles.menuWrap}
                      onPress={() => {
                        if (item.title == 'contact_support') {
                          onPressContact();
                        } else {
                          navigation.navigate(item.navigation);
                        }
                      }}>
                      <View style={styles.menuIcon}>
                        <item.Icon
                          height={item.height}
                          width={item.width}
                          fill={colors?.PRIMARY_BACKGROUND_COLOR}
                        />
                      </View>
                      <Text style={styles.menuText}>
                        {strings(`side_menu.${item?.title}`)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          </View>
        </View>
      </ScrollView>
      {showLogoutModal ? (
        //**** Logout confirmation pop up */
        <ConfirmationModal
          visibility={showLogoutModal}
          handleModalVisibility={toggleLogoutModal}
          handleConfirm={handleUserLogout}
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.logout')}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default DrawerComponent;
