import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Colors} from '../../assets/styles/colors/colors';
import {normalize} from '../../lib/globals';
import {
  BottomMessage,
  BottomLocation,
  BottomTabHome,
  NotificationBell,
} from '../../assets/img/index.js';
import {useColors} from '../../hooks/useColors';
import {useNavigation} from '@react-navigation/native';
import {notificationListReducer} from '../../redux/notification/reducer';
import {useDispatch, useSelector} from 'react-redux';
const DashboardBottomTab = ({newNotification = false}) => {
  const {colors} = useColors();
  const navigation = useNavigation();
  const notification_list = useSelector(
    (state) => state?.NotificationReducer?.data,
  );

  // const isAllSeen = React.useMemo(() => {
  //   return notification_list.every(n => n.IsRead);
  // }, [notification_list]);
  const isAllSeen = React.useMemo(() => {
    return notification_list?.some(n => n?.IsRead == 1 )
  }, [notification_list]);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
        },
      ]}>
      <TouchableOpacity onPress={() => navigation.navigate('JobList')}>
        <BottomTabHome
          style={styles.svgIcons}
          height={normalize(30)}
          width={normalize(30)}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('NearByTechnician')}>
        <BottomLocation
          style={styles.svgIcons}
          height={normalize(30)}
          width={normalize(30)}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        {/* <BottomMessage
                    style={styles.svgIcons}
                    height={normalize(30)}
                    width={normalize(30)}
                /> */}
        <NotificationBell
          style={styles.svgIcons}
          height={normalize(26)}
          width={normalize(26)}
        />
        {isAllSeen && (
          <View
            style={{
              height: normalize(10),
              width: normalize(10),
              borderRadius: normalize(7),
              backgroundColor: Colors?.lightLemonGreen,
              position: 'absolute',
              right: normalize(0),
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DashboardBottomTab;

const styles = StyleSheet.create({
  container: {
    height: normalize(70),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(50),
    paddingTop: normalize(15),
  },
  svgIcons: {},
});
