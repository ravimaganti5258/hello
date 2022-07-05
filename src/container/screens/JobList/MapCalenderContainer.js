import moment from 'moment';
import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  I18nManager,
} from 'react-native';
import {
  BlueSmallArrowLeft,
  BlueSmallArrowRight,
  CalenderIcon,
  WhiteMapMarker,
} from '../../../assets/img';
import { Colors } from '../../../assets/styles/colors/colors';
import { Text } from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { getMonth, months, getDate, getCurrentDate } from '../../../util/helper';

const arrowIconWidth = normalize(10);
const arrowIconHeight = normalize(14);

const MapCalenderContainer = ({
  showMapView,
  date,
  month,
  year,
  hideMapView,
  arrowLeft,
  arrowRight,
  setCalenderTrue,
  toggleCalender,
  setShowWeekTrue,
  setShowWeekFalse,
  showWeek,
  showMap,
  isRefresh,
  setCalenderFalse,
  onDayPress,
  onPressCalendarIcon,
  onRightArrowClick = () => null,
  onLeftArrowClick = () => null,
}) => {
  const { colors } = useColors();

  const [monthsLists, setMonthsList] = useState([]);
  const getMonthsList = () => {
    const formatMonthList = months?.map((month, index) => {
      return {
        month: month,
        value: index,
      };
    });
    setMonthsList(formatMonthList);
  };

  useEffect(() => {
    getMonthsList();
  }, []);

  const handleLeftArrow = () => {
    try {
      // hideMapView();
      setCalenderTrue ? setCalenderTrue() : null;
      showWeek ? onLeftArrowClick() : null
      if (!showWeek) {
        !showWeek ? (arrowLeft ? arrowLeft() : null) : null;

        setShowWeekFalse();
      }

    } catch (error) { }
  };

  const handleRightArrow = () => {
    try {
      setCalenderTrue ? setCalenderTrue() : null;
      showWeek ? onRightArrowClick() : null
      if (!showWeek) {
        !showWeek ? (arrowRight ? arrowRight() : null) : null;

        setShowWeekFalse();
      }

    } catch (error) { }
  };

  const handleOnCalenderDatePress = () => {
    try {
      // hideMapView();
      toggleCalender ? toggleCalender() : null;
      setShowWeekTrue ? setShowWeekTrue() : null;
    } catch (error) { }
  };

  //handle on calenderIconpress
  const handleOnCalenderIconpress = () => {
    const date = getCurrentDate();
    try {
      setCalenderTrue();
      onPressCalendarIcon()
      onDayPress(date);
    } catch (error) { }
  };

  const handleOnCalenderRefreshPress = () => {
    const date = getCurrentDate();
    try {
      setCalenderFalse()
      onDayPress(date);
    } catch (error) { }
  };

  const [showMonths, setShowMonths] = useState(false);

  const toggleMonthsModal = () => {
    try {
      setShowMonths(!showMonths);
    } catch (error) { }
  };

  const monthListRenderItem = ({ item, index }) => {
    return (
      <View pointerEvents={'box-none'}>
        <TouchableOpacity style={styles.monthListRenderItem}>
          <View pointerEvents={'box-none'}>
            <Text>{item?.month}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = (item, index) => `ID-${index}`;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainers}>
        <View style={{flexDirection:I18nManager.isRTL?'row-reverse':'row',alignItems:'center'}}>
          <TouchableOpacity
            style={styles.arrowBtnStyles}
            onPress={handleLeftArrow}>
            <BlueSmallArrowLeft
              width={arrowIconWidth}
              height={arrowIconHeight}
              style={{color: colors.PRIMARY_BACKGROUND_COLOR}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnCalenderDatePress}>
            <Text
              style={[
                styles.monthTxtStyles,
                { color: colors?.PRIMARY_BACKGROUND_COLOR },
              ]}>
              {months[month - 1] || getMonth()} {year}
            </Text>
          </TouchableOpacity>
          {/* {showMonths ? (
            <View style={styles.monthListContainer} pointerEvents={'box-none'}>
              <FlatList
                data={monthsLists}
                renderItem={monthListRenderItem}
                keyExtractor={keyExtractor}
                nestedScrollEnabled={true}
              />
            </View>
          ) : null} */}
          <TouchableOpacity
            style={styles.arrowBtnStyles}
            onPress={handleRightArrow}>
            <BlueSmallArrowRight
              width={arrowIconWidth}
              height={arrowIconHeight}
              style={{color: colors.PRIMARY_BACKGROUND_COLOR}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.monthContainer}>
          <TouchableOpacity
            style={{ marginHorizontal: normalize(15) }}
            onPress={()=>{
              isRefresh()
              handleOnCalenderRefreshPress()
              }}>
            <Image
              source={require('../../../assets/images/refresh.png')}
              style={[styles.refreshIcon, {
                tintColor: colors?.PRIMARY_BACKGROUND_COLOR
              }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.calenderIconContainer}
            onPress={handleOnCalenderIconpress}>
            <CalenderIcon height={normalize(26)} width={normalize(23)} style={{color:colors.PRIMARY_BACKGROUND_COLOR}} />
            <Text
              style={[
                styles.dateTextStyles,
                { color: colors?.PRIMARY_BACKGROUND_COLOR },
              ]}>
              {/**date */ getDate()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.monthContainer,
              styles.mapViewBtn,
              {
                backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                marginHorizontal: normalize(5),
                // flexDirection:'row',
                // alignItems:'center'
                // justifyContent:'space-between',
                // alignItems:'stretch',

              },
            ]}
            onPress={showMap ? hideMapView : showMapView}>
            <WhiteMapMarker width={normalize(12)} height={normalize(15)} />
            <Text style={styles.mapViewTxt}>
              {showMap ? strings('Job_List.ListView') : strings('Job_List.MapView')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapCalenderContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.extraLightGrey,
    padding: normalize(10),
  },
  monthContainer: {
    flexDirection:'row',
    alignItems: 'center',
  },
  monthTxtStyles: {
    marginHorizontal: normalize(8),
    fontSize: textSizes.h9,
    color: Colors.blue,
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calenderIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(5),
  },
  dateTextStyles: {
    position: 'absolute',
    color: Colors.blue,
    fontFamily: fontFamily.semiBold,
    fontSize: textSizes.h12,
  },
  mapViewBtn: {
    backgroundColor: Colors.blue,
    marginLeft: normalize(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    borderRadius: normalize(18),
  },
  mapViewTxt: {
    marginLeft: normalize(5),
    // marginRight:I18nManager.isRTL? normalize(10):normalize(2),
    color: Colors.white,
    fontSize: textSizes.h12,
  },
  arrowBtnStyles: {
    paddingHorizontal: normalize(5),
  },
  shadowStyles: {
    width: '100%',
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors?.extraLightGrey,
    backgroundColor: Colors?.extraLightGrey,
  },
  monthListContainer: {
    position: 'absolute',
    top: normalize(40),
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: normalize(6),
    elevation: 3,
    // maxHeight: 200,
    zIndex: 10,
    flex: 1,
  },
  monthListRenderItem: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(30),
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors?.borderColor,
    borderRadius: normalize(6),
  },
  refreshIcon: {
    height: normalize(20),
    width: normalize(20),
  },
});
