import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Colors} from '../../../assets/styles/colors/colors';
import Cards from '../../../components/Cards';
import MainHoc from '../../../components/Hoc';
import {dateFormat, fontFamily, normalize} from '../../../lib/globals';
import api from '../../../lib/api';
import {useDispatch, useSelector} from 'react-redux';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import HeaderComponents from '../../../components/header';
import {Header} from '../../../lib/buildHeader';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {strings} from '../../../lib/I18n';

import moment from 'moment';
const Notification = ({navigation}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const masterData = useSelector((state) => state?.masterDataReducer.data);

  
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const notification_list = useSelector(
    (state) => state?.NotificationReducer?.data,
  );

  let systemName = DeviceInfo.getSystemName();
  const [notificationData, setNotificationData] = useState([]);

/* fcm tokent geting  */
const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('fcmToken');

      if (value !== null) {
        getNotificationApi(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const reversed = notification_list?.reverse();
    setNotificationData(reversed);
  }, [notification_list]);

  
const updateNotification =(id)=>{
  try {
    const handleCallback = {
      success: (data) => {
       dispatch({type: SET_LOADER_FALSE});
      },
      error: (error) => {
        console.log(error)
      },
    };
    const endPoint = `?CompanyId=${userInfo.CompanyId}&Wojobid=${jobInfo?.WoJobId}&PushNotificationId=${id}`;
    const header = Header(token);
    api.updateNotification('', handleCallback, header, endPoint);
  } catch (error) {
    console.log(error)
  }
  
}

  const getNotificationApi = (fcm) => {
    try {
      dispatch({type: SET_LOADER_TRUE});
      const data = {
        CompanyId: userInfo.CompanyId,
        DeviceOS: systemName,
        DeviceToken: fcm,
        LoginId: userInfo?.sub,
        MobileTypeId: 1,
      };
      const handleCallback = {
        success: (data) => {
          dispatch({type: SET_LOADER_FALSE});
        },
        error: (error) => {
          dispatch({type: SET_LOADER_FALSE});
        },
      };
      const header = Header(token);
      api.getNotification(data, handleCallback, header);
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  useEffect(() => {
    getData();
    getNotificationApi();
  }, [systemName]);

  const renderItem = ({item, index}) => {
    var noramalFrmt = dateFormat(item?.SendDate, 'DD/MM/YYYY HH:MM 12TF');
updateNotification(item?.PushNotificationId);

    return (
      <View style={styles.mainContainer}>
        <Cards
          type={'notification'}
          notificationTitle={item?.Title}
          notificationDescription={item?.NotifyMessage}
          notificationViewed={item?.IsRead}
          notificationTime={noramalFrmt}
          notificationJobId={item?.WoJobId}
           notificationId ={item?.PushNotificationId}
          containerStyles={{
            borderTopWidth:
              index == normalize(0) ? normalize(0) : normalize(0.7),
          }}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <HeaderComponents
          title={strings('NOTIFICATIONS.TITLE')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
        />
        <FlatList
          data={notificationData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `ID-${index}`}
          
        />
      </View>
      <Loader visibility={isLoading} />
    </>
  );
};

export default MainHoc(Notification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    height: normalize(45),
    padding: normalize(10),
    
  },
  mainContainer: {
     marginTop: normalize(5),
    },
});
