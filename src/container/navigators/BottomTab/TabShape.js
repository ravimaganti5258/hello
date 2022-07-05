import React, { useEffect, useState } from 'react';

import {
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import {
  BagIconBottomTab,
  CrossColorIcon,
  DashboardIconBottomTab,
  ListBottomTabIcon,
  MenuIcon,
  NotificationTab,
  NotificationBell,
} from '../../../assets/img';
import { Colors } from '../../../assets/styles/colors/colors';
import AnimatedMenu from '../../../components/AnimatedMenu';
import { useColors } from '../../../hooks/useColors';
import { useDimensions } from '../../../hooks/useDimensions';
import { normalize } from '../../../lib/globals';
import { getPath } from './path';
import TabBottomSheet from './TabBottomSheet';
import {useDispatch, useSelector} from 'react-redux';

export default function TabShape({ navigation, serviceModals, newNotification = true }) {
  const routes = [
    {
      name: 'Dashboard',
      icon: DashboardIconBottomTab,
      height: normalize(25),
      width: normalize(25),
    },
    {
      name: 'JobList',
      icon: ListBottomTabIcon,
      height: normalize(23),
      width: normalize(30),
    },
    {
      name: '',
      icon: null,
    },
    {
      name: 'Settings',
      icon: BagIconBottomTab,
      height: normalize(27),
      width: normalize(27),
    },
    {
      name: 'Notification',
      icon: NotificationBell,
      height: normalize(26),
      width: normalize(28),
    },
  ];

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = useColors();
  const [visible, setVisible] = useState(false);
  const [bounce, setBounce] = useState(new Animated.Value(0));

  const TAB_HEIGHT = normalize(60);

  const d = getPath(width, TAB_HEIGHT, 50);

  const { height } = useDimensions();

  // const TO_VALUE = height / 2.8;
  const TO_VALUE = height * 0.3;

  const notification_list = useSelector(
    (state) => state?.NotificationReducer?.data,
  );

  // const isAllSeen = React.useMemo(() => {
  //   return notification_list?.every(n => n?.IsRead);
  // }, [notification_list]);

  const isAllSeen = React.useMemo(() => {
    return notification_list?.some(n => n?.IsRead == 1 )
  }, [notification_list]);

  useEffect(() => {
    if (visible) {
      Animated.spring(bounce, {
        useNativeDriver: false,
        toValue: TO_VALUE,
      }).start();
    } else {
      Animated.spring(bounce, {
        useNativeDriver: false,
        toValue: 0,
      }).start();
    }
  }, [visible]);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
          },
        ]}>
        <Svg width={width} height={TAB_HEIGHT}>
          <Path
            strokeWidth={10}
            fill={colors?.PRIMARY_BACKGROUND_COLOR}
            {...{ d }}
          />
        </Svg>
        <View style={styles.bottomTabContainer}>
          {routes.map((item, index) => {
            const onPress = () => {
              navigation.navigate(item?.name);
            };
            return (
              <View key={`${index}`} style={styles.tabBtnContainer}>
                {index != 2 ? (
                  <TouchableOpacity
                    style={styles.tabBtnStyles}
                    onPress={onPress}
                    activeOpacity={0.6}>
                    <item.icon height={item?.height} width={item?.width} />
                    {isAllSeen && item.name == 'Notification' && (
                      <View style={styles.NotificationBellStyle} />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={toggleVisible}
                    style={styles.tabCenterBtnContainer}
                    activeOpacity={0.7}>
                    <View style={styles.tabCenterBtn}>
                      {/* <AnimatedMenu
                        color={colors?.PRIMARY_BACKGROUND_COLOR}
                        active={visible}
                        onPress={toggleVisible}
                      /> */}
                      {visible ? (
                        <CrossColorIcon
                          height={normalize(20)}
                          width={normalize(20)}
                          fill={colors?.PRIMARY_BACKGROUND_COLOR}
                        />
                      ) : (
                        <>
                          <View
                            style={[
                              styles.burgerMenuStyle,
                              {
                                borderColor: colors?.PRIMARY_BACKGROUND_COLOR,
                              },
                            ]}
                          />
                          <View
                            style={[
                              styles.burgerMenuStyle,
                              {
                                borderColor: colors?.PRIMARY_BACKGROUND_COLOR,
                                width: normalize(16),
                                marginVertical: normalize(5),
                              },
                            ]}
                          />
                          <View
                            style={[
                              styles.burgerMenuStyle,
                              {
                                borderColor: colors?.PRIMARY_BACKGROUND_COLOR,
                              },
                            ]}
                          />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>
      <View pointerEvents={'box-none'} style={styles?.tabBackgroundStyles} />
      <View
        style={{
          height: insets.bottom,
          backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
        }}
      />
      <Animated.View
        pointerEvents={'box-none'}
        style={[
          styles.bottomSheetContainer,
          {
            bottom: normalize(85) + insets.bottom,
            height: bounce
          },
        ]}>
        {visible ? (

          <SafeAreaView>

            <TabBottomSheet
              onPressIcon={toggleVisible}
              ServiceModal={() => serviceModals}
            />

          </SafeAreaView>
        ) : null}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  bottomTabContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabBtnContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabBtnStyles: {
    width: '100%',
    alignItems: 'center',
  },
  tabCenterBtnContainer: {
    marginTop: normalize(2),
    top: -22,
  },
  tabBackgroundStyles: {
    width: '100%',
    height: normalize(85),
    backgroundColor: Colors?.white,
    zIndex: -1,
    bottom: normalize(10),
  },
  tabCenterBtn: {
    height: normalize(55),
    width: normalize(55),
    borderRadius: normalize(55 / 2),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 2.3,
    shadowOpacity: 0.3,
  },
  bottomSheetContainer: {
    width: '100%',
    position: 'absolute',
  },
  burgerMenuStyle: {
    height: normalize(2),
    width: normalize(24),
    borderWidth: 1,
  },
  NotificationBellStyle: {
    height: normalize(10),
    width: normalize(10),
    borderRadius: normalize(7),
    backgroundColor: Colors?.lightLemonGreen,
    position: 'absolute',
    right: normalize(30),
  },
});
