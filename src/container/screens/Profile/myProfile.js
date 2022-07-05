import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { fontFamily, normalize, timeFormatAMPM } from '../../../lib/globals';
import { useColors } from '../../../hooks/useColors';
import { Colors } from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header/index.js';
import Loader from '../../../components/Loader/index.js';
import { FlashMessageComponent } from '../../../components/FlashMessge/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { strings } from '../../../lib/I18n/index.js';
import MainHoc from '../../../components/Hoc/index.js';
import { EditWhiteIcon } from '../../../assets/img/index';
import api from '../../../lib/api';
import {
  getProfileDataSuccess,
  getProfileDataFailure,
} from '../../../redux/Profile/action';
import { useFocusEffect } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
const MyProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useColors();
  const [loader, setLoader] = useState(true);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const userCredentials = useSelector(
    (state) => state?.authReducer?.userCredentials,
  );
  const [profileData, setProfileData] = useState(null);
  const { isConnected, isInternetReachable } = useNetInfo()
  useEffect(() => {
    fetchProfileData();

  }, []);
 
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, []),
  );


  const fetchProfileData = () => {
    try {
      const handleCallback = {
        success: (data) => {

          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
            } else {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            }
          }
          setProfileData(data);
          dispatch(getProfileDataSuccess(data));
          setLoader(false);
        },
        error: (error) => {
          console.log({ error })
          setLoader(false);
          dispatch(getProfileDataFailure());
        },
      };
      let endpoint = `?CompanyId=${userInfo?.CompanyId}&LoginId=${userInfo?.sub}`;
      api.getUserProfile(
        '',
        handleCallback,
        {
          Authorization: `Bearer ${token}`,
        },
        endpoint,
      );
    } catch (er) {
      console.log(er);
    }
  };

  const calculateTime = (time) => {
    try {
      let timeObj = new Date(time);
      let dateObj = new Date();
      let calculateTime = timeObj.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', hour: '2-digit' });
      calculateTime = calculateTime.slice(0, 5);
      let calculateDate = timeObj.toLocaleDateString();
      let calculateNewDate = dateObj.toLocaleDateString();
      let calculateNumber =
        calculateDate.slice(0, 2) - calculateNewDate.slice(0, 2);
      const calTime = calculateTime.split(':');

      const tFormat = calTime[0] < 13 ? 'AM' : 'PM';
      if (calculateNumber === 0) {
        const text = `Today ${calculateTime} ${tFormat}`;
        return text;
      } else {
        const text = `${calculateDate} ${calculateTime} ${tFormat}`;
        if (text == 'Invalid Date Inval') return 'Today 9:00 AM';
        else return text;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  let base64ProfileImage = `data:image/png;base64,${profileData?.ProfileImage}`;

  return (
    <View style={styles.mainView}>
      <Loader visibility={loader} />
      <View>
        <Header
          title={strings('My_Profile.title')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
          headerRightText={strings('My_Profile.Edit')}
          rightTextStyle={{
            color: colors?.PRIMARY_BACKGROUND_COLOR,
            fontFamily: fontFamily.semiBold,
          }}
          onPressRightText={() => navigation.navigate('EditProfile')}
        />
      </View>
   
      <View style={styles.view1}>
        <View>
          <Image
            source={{ uri: base64ProfileImage }}
            style={styles.profilePicture}
          />
          <TouchableOpacity
            style={{
              ...styles.editLogoView,
              backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
            }}
            onPress={() => navigation.navigate('EditProfile')}>
            <EditWhiteIcon
              height={normalize(13)}
              width={normalize(13)}
              style={styles.editLogo}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            ...styles.usernameText,
            color: colors?.PRIMARY_BACKGROUND_COLOR,
          }}>
          {`${profileData?.FirstName ? profileData.FirstName : ''} ${profileData?.LastName ? profileData.LastName : ''
            }`}
        </Text>
        <View style={styles.view3}>

          {isInternetReachable ?
            <>
              <View style={styles.onlineLogo}></View>
              <Text style={styles.onlineText}>{strings('My_Profile.Online')}</Text>
            </> :
            <>
              <View style={styles.offlineLogo}></View>
              <Text style={styles.onlineText}>{strings('My_Profile.Offline')}</Text>
            </>
          }
        </View >
        <Text style={styles.lastLoginText}>
          {`${strings('My_Profile.Last_Login')}: ${profileData?.LastLogindatetime
            ? calculateTime(profileData?.LastLogindatetime)
            : ''
            }`}
        </Text>
      </View >
      <View style={styles.view2}>
        <Text style={styles.label}>{strings('My_Profile.Email')}</Text>
        <Text style={styles.emailText}>{userCredentials?.userName}</Text>
        <View style={styles.thinLine}></View>
        <Text style={styles.label}>{strings('My_Profile.Mobile')}</Text>
        <Text style={styles.emailText}>{`${profileData?.Phone1 ? profileData.Phone1 : ''
          }`}</Text>
        <View style={styles.thinLine}></View>
        <Text style={styles.label}>{strings('My_Profile.Phone')}</Text>
        <Text style={styles.emailText}>{`${profileData?.Phone2 ? profileData.Phone2 : ''
          }`}</Text>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  view1: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view2: {
    flex: 0.65,
    marginHorizontal: 15,
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  rightTextStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(14),
    marginTop: 13,
    flex: 1,
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: -25,
  },
  editLogo: {
    alignSelf: 'center',
  },
  onlineLogo: {
    height: 10,
    width: 10,
    backgroundColor: '#2ECC71',
    borderRadius: 50,
    alignSelf: 'center',
    //flexDirection:'row'
  },
  offlineLogo: {
    height: 10,
    width: 10,
    backgroundColor: '#FF0000',
    borderRadius: 50,
    alignSelf: 'center',
    flexDirection: 'row'
  },
  offlineLogo: {
    height: 10,
    width: 10,
    backgroundColor: 'grey',
    borderRadius: 50,
    alignSelf: 'center',
  },
  offlineLogo: {
    height: 10,
    width: 10,
    backgroundColor: 'grey',
    borderRadius: 50,
    alignSelf: 'center',
  },
  editLogoView: {
    height: 25,
    width: 25,
    // backgroundColor: Colors.blue,
    borderRadius: 50,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  usernameText: {
    paddingVertical: 3,
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    // color: Colors.blue,
    marginTop: 10,
  },
  onlineText: {
    paddingVertical: 3,
    fontSize: normalize(13),
    fontFamily: fontFamily.regular,
    paddingLeft: 5,
  },
  lastLoginText: {
    paddingVertical: 3,
    fontSize: normalize(13),
    fontFamily: fontFamily.regular,
  },
  label: {
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    textAlign: 'left'
  },
  emailText: {
    fontSize: normalize(16),
    fontFamily: fontFamily.regular,
    marginTop: normalize(3),
    textAlign: 'left'
  },
  view3: {
    flexDirection: 'row',
  },
  thinLine: {
    height: normalize(1),
    borderWidth: normalize(1),
    borderColor: Colors?.lightSilver,
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
});

export default MainHoc(MyProfile);
