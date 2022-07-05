import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import { fontFamily, normalize, timeFormat } from '../../../lib/globals.js';
import Header from '../../../components/header';
import MainHoc from '../../../components/Hoc/index';
import { Text } from '../../../components/Text/index';
import { handleTodayLog } from '../../../redux/log/action/todayLogAction';
import Loader from '../../../components/Loader';
import { useNetInfo } from '../../../hooks/useNetInfo';

import {
  insertNewRealmObject,
  queryAllRealmObject,
} from '../../../database/index';
import { TODAYLOG, USER, CHECK_IN } from '../../../database/allSchemas';
import { strings } from '../../../lib/I18n';
import api from '../../../lib/api';
import { DataNotFound } from '../../../components/DataNotFound';

const TodayLog = ({ navigation }) => {
  const dispatch = useDispatch();
  const logData = useSelector((state) => state?.todayLogReducer?.data);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const userData = useSelector((state) => state?.authReducer);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.todayLogReducer?.isLoading);
  const [data, setdata] = useState('');
  const { isConnected } = useNetInfo();
  const [message, setMessage] = useState();

  useEffect(() => {
    let data = {
      CompanyId: userInfo.CompanyId,
      TechId: userInfo.sub,
      token: token,
    };
    dispatch(handleTodayLog(data, setMessage));
  }, []);

  useEffect(() => {
    if (!isConnected) {
    } else {
      queryAllRealmObject(CHECK_IN).then((res) => {
        res.map((e) => {
          let obj = {
            checkInTime: e.time,
          };
        });
      });
    }
  }, []);

  const rowWrap = (lable, item) => {
    const d_index = item.CheckOutTime.indexOf('(');
    const checkInTime = item.CheckInTime;
    const checkOutTime = item.CheckOutTime;

    const checkOut = d_index > -1 ? item.CheckOutTime.substr(0, d_index) : null;
    let duration =
      d_index > -1
        ? item.CheckOutTime.substr(d_index, item.CheckOutTime.length)
        : '';
    duration = duration.replace("Hr", strings("today_log.Hr"));
    duration = duration.replace("Mins", strings("today_log.Mins"));
    return (
      <>
        <View
          style={[
            styles.renderItemWrap,
            {
              backgroundColor:
                lable == strings("today_log.check-out") ? Colors.extraLightGrey : null,
            },
          ]}>
          <Text
            align={'flex-start'}
            color={Colors.secondryBlack}
            style={{ flex: 0.4 }}
            size={normalize(14)}>
            {lable}
          </Text>
          <Text
            align={'flex-start'}
            color={Colors.secondryBlack}
            style={{ flex: 0.4 }}
            size={normalize(14)}
            style={styles.dotSeperatorStyle}>
            -
          </Text>
          <Text
            align={'flex-start'}
            color={Colors.secondryBlack}
            style={{ flex: 0.4 }}
            size={normalize(14)}
            style={styles.timeTextStyle}>
            {lable == strings("today_log.check-out") ? checkOut : checkInTime}{' '}
            {lable == strings("today_log.check-out") ? duration : ''}
          </Text>
        </View>
      </>
    );
  };

  // ********* flatlist render item function ***//
  const renderItem = ({ item, index }) => {
    const checkoutTime = item?.CheckOutTime.split('(');
    return (
      <View>
        {rowWrap(strings('today_log.check-in'), item)}
        {checkoutTime[0] != '' && rowWrap(strings('today_log.check-out'), item)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={strings('today_log.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
      />
      <View style={styles.flatlistContainer}>
        {logData.length > 0 ? (
          <FlatList
            data={logData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `ID-${index}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <DataNotFound />
          // <View style={styles.emptyMsgWrap}>
          //   <Text size={normalize(18)}>{message}</Text>
          // </View>
        )}
      </View>
      <Loader visibility={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistContainer: {
    marginHorizontal: normalize(18),
    marginVertical: normalize(10),
    flex: 1,
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
  },
  renderItemWrap: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
  },
  timeTextStyle: {
    color: Colors.secondryBlack,
    flex: 1,
    fontFamily: fontFamily.semiBold,
  },
  dotSeperatorStyle: {
    paddingHorizontal: 10,
    flex: 0.1,
  },
  emptyMsgWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainHoc(TodayLog);
