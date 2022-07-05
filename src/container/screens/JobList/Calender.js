import React, {useEffect, useState} from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Colors} from '../../../assets/styles/colors/colors';
import {Text} from '../../../components/Text';
import {useColors} from '../../../hooks/useColors';
import {addZeroPrecesion, normalize} from '../../../lib/globals';
import MapCalenderContainer from './MapCalenderContainer';
import {
  getCurrentDateString,
  getDate,
  getMonth,
  getYear,
} from '../../../util/helper';
import {PanGestureHandler} from 'react-native-gesture-handler';

import {FlashMessageComponent} from '../../../components/FlashMessge/index.js';
import moment from 'moment';
import {WeekCalenderComponent} from './WeekCalender';
import {strings} from '../../../lib/I18n';

const Calender = ({
  showMapView,
  hideMapView,
  showMap,
  data,
  flatListRef,
  refreshClick,
  setScrollIndex,
  findNearByDate,
}) => {
  const dateString = getCurrentDateString();
  const [date, setDate] = useState(getDate());
  const [month, setMonth] = useState(getMonth());
  const [year, setYear] = useState(getYear());
  const [currentDate, setCurrentDate] = useState(dateString);
  const [currentDate2, setCurrentDate2] = useState(dateString);
  const [showCalender, setShowCalender] = useState(false);
  const [showWeek, setShowWeek] = useState(false);
  const [markerdDate, setMarkedDate] = useState({});
  const [maxIndex, setMaxIndex] = useState('');
  let week_number = 0 | (new Date().getDate() / 7);
  const [weekIndex, setWeekIndex] = useState(week_number);
  const [currentdateInWeek, setCurrentdateInWeek] = useState(currentDate);
  let startDate = moment(); // today
  const [formattedDate, setFormattedDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startDate);

  const setShowWeekTrue = () => {
    setShowWeek(true);
  };

  useEffect(() => {
    setCurrentDate(dateString);
  }, []);
  useEffect(() => {}, [weekIndex]);

  const setShowWeekFalse = () => {
    setShowWeek(false);
  };

  const toggleWeekView = () => {
    setShowWeek(!showWeek);
  };

  const setCalenderTrue = () => {
    setShowCalender(true);
  };

  const setCalenderFalse = () => {
    setShowCalender(false);
  };

  const toggleCalender = () => {
    setShowCalender(!showCalender);
  };

  const calendarRef = React.useRef();
  const weekCalendarRef = React.useRef();

  const arrowRight = () => {
    calendarRef.current.addMonth(1);
  };

  const arrowLeft = () => {
    calendarRef.current.addMonth(-1);
  };

  const {colors} = useColors();

  const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const week2 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calenderTheme = {
    calendarBackground: Colors.extraLightGrey,
    textDayStyle: {fontSize: normalize(15)},
    selectedDayTextColor: Colors.white,
    todayTextColor: colors?.PRIMARY_BACKGROUND_COLOR,
  };

  const RenderWeeks = () => {
    return (
      <View style={styles.weekRowContainer}>
        {week.map((week, index) => {
          return (
            <Text style={styles.weekText} key={`ID-${index}`}>
              {week}
            </Text>
          );
        })}
      </View>
    );
  };

  const [dateArray, setDateArray] = useState({});
/* for date fetching */
  const getDates = () => {
    let dateArray = [];
    data?.map((item) => {
      //changing this
      if (showWeek) {
        item?.event?.length > 0 && dateArray.push(item?.date);
      } else {
        if (item?.event?.length > 0)
          item?.date.split('-')[1] == addZeroPrecesion(month)
            ? dateArray.push(item?.date)
            : null;
      }
    });
    let newDaysObject = {};

    dateArray?.forEach((day) => {
      newDaysObject[day] = {
        marked: true,
        selected: false,
        type: 'custom',
        customStyles: {
          container: {
            backgroundColor:
              day == currentDate
                ? colors?.PRIMARY_BACKGROUND_COLOR
                : Colors?.extraLightGrey,
            borderRadius: 5,
          },
          text: {
            color: day == currentDate ? Colors?.white : Colors?.black,
          },
        },
        dotColor:
          day == currentDate ? Colors?.white : colors?.PRIMARY_BACKGROUND_COLOR,
      };
    });

    setDateArray(newDaysObject);
  };

  /*  set for marker dates */
  useEffect(() => {
    let markedDates = {};
    markedDates[currentDate] = {
      selected: false,
      type: 'custom',
      customStyles: {
        container: {
          backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
          borderRadius: 5,
        },
        text: {
          color: Colors.white,
        },
      },
    };
    setMarkedDate(markedDates);
  }, [currentDate]);

  useEffect(() => {
    getDates();
  }, [data, currentDate, month, showWeek]);
  useEffect(() => {}, [weekIndex]);

  const onMonthChange = (date) => {
    setYear(date?.year);
    setMonth(date?.month);
    setDate(date?.day);
  };

  useEffect(() => {
    let splitDate = currentdateInWeek.split('-');
  }, [currentdateInWeek, weekIndex]);

  const onDayPress = (date) => {
    try {
      setCurrentDate(date?.dateString);
      setSelectedDate(moment(date?.dateString));
      setDate(date?.day);
      setMonth(date?.month);
      setYear(date?.year);
      const index = findIndex(date?.dateString);
      if (index != -1) {
        flatListRef.current.scrollToIndex({index: index});
        setScrollIndex(index);
        setShowWeekTrue();
      } else {
        FlashMessageComponent('reject', strings('flashmessage.No_job_found'));
        const nearIndex = findNearByDate(date?.dateString, data);

        flatListRef.current.scrollToIndex({index: nearIndex});
        setScrollIndex(nearIndex);
        setShowWeekTrue();
      }
    } catch (error) {}
  };
  /*  index finding */

  const findIndex = (date) => {
    try {
      const foundData = data.findIndex((item) => item.date == date);
      return foundData || 0;
    } catch (error) {}
  };
  const handleGestureEvent = (e) => {
    setShowWeek(false);
  };

  /*  close gesture events */
  const closeGestoreEvent = (e) => {
    setShowWeek(true);
  };

  return (
    <View style={styles.container}>
      <>
        <MapCalenderContainer
          showMapView={showMapView}
          date={date}
          month={month}
          year={year}
          hideMapView={hideMapView}
          arrowLeft={showCalender && !showWeek ? arrowLeft : undefined}
          arrowRight={showCalender && !showWeek ? arrowRight : undefined}
          setCalenderTrue={setCalenderTrue}
          onRightArrowClick={() => {
            weekCalendarRef.current.getNextWeek();

            if (weekIndex < maxIndex - 1) {
              setWeekIndex(weekIndex + 1);
            } else if (weekIndex >= maxIndex) {
            }
          }}
          onLeftArrowClick={() => {
            weekCalendarRef.current.getPreviousWeek();

            if (weekIndex > 0) {
              setWeekIndex(weekIndex - 1);
            } else if (weekIndex == 0) {
            }
          }}
          setCalenderFalse={setCalenderFalse}
          showCalender={showWeek}
          toggleCalender={toggleCalender}
          toggleWeekView={toggleWeekView}
          setShowWeekTrue={setShowWeekTrue}
          setShowWeekFalse={setShowWeekFalse}
          showWeek={showWeek}
          showMap={showMap}
          isRefresh={refreshClick}
          onDayPress={onDayPress}
          onPressCalendarIcon={() => toggleCalender()}
        />
        {showCalender ? (
          <>
            <View>
              {showWeek ? (
                <View style={styles.weeksCalenderComponent}>
                  <WeekCalenderComponent
                    weekCalendarRef={weekCalendarRef}
                    currentDate={selectedDate}
                    setCurrentDate={(val) => {
                      const forDate = val.format('YYYY-MM-DD');
                      setCurrentDate(forDate);
                      const dateSplit = forDate.split('-');
                      const selectedDa = currentDate.split('-');
                      let obj = {
                        dateString: forDate,
                        day: selectedDa[2],
                        month: dateSplit[1],
                        timestamp: 1652140800000,
                        year: dateSplit[0],
                      };
                      onDayPress(obj);
                    }}
                    getCurrentMonth={(curmonth, date) => {
                      var mon = curmonth + 1;

                      setMonth(mon);
                      setCurrentDate2(date);
                    }}
                    markedDate={{...markerdDate, ...dateArray}}
                    themeColor={colors?.PRIMARY_BACKGROUND_COLOR}
                  />
                  <PanGestureHandler onGestureEvent={handleGestureEvent}>
                    <View style={styles.panGestureHandlerStyle}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          toggleWeekView();
                          setCalenderTrue();
                        }}>
                        <View style={styles.calenderNotchStyles} />
                      </TouchableOpacity>
                    </View>
                  </PanGestureHandler>
                  <View style={styles.bottomShadowView} />
                </View>
              ) : (
                <View style={styles.calenderContainer}>
                  <RenderWeeks />

                  <Calendar
                    style={styles.calenderStyles}
                    theme={calenderTheme}
                    ref={calendarRef}
                    current={currentDate2}
                    month={month}
                    enableSwipeMonths={true}
                    onMonthChange={onMonthChange}
                    onDayPress={onDayPress}
                    renderHeader={() => <View />}
                    hideArrows={true}
                    hideDayNames
                    markedDates={{...markerdDate, ...dateArray}}
                    markingType={'custom'}
                  />

                  <PanGestureHandler onGestureEvent={closeGestoreEvent}>
                    <View style={{padding: normalize(12)}}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          toggleCalender(), setShowWeekFalse();
                        }}>
                        <View style={styles.calenderNotchStyles} />
                      </TouchableOpacity>
                    </View>
                  </PanGestureHandler>
                  <View style={styles.bottomShadowView} />
                </View>
              )}
            </View>
          </>
        ) : null}
      </>
    </View>
  );
};

export default Calender;

const styles = StyleSheet.create({
  weekRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.extraLightGrey,
  },
  weekText: {
    color: '#4D4D4D',
    fontSize: normalize(11),
  },
  calenderStyles: {
    backgroundColor: Colors.extraLightGrey,
    zIndex: 1,
  },
  calenderContainer: {
    zIndex: 2,
    width: '100%',
    paddingTop: normalize(10),
    backgroundColor: Colors.extraLightGrey,
  },
  calenderNotchStyles: {
    width: normalize(58),
    height: normalize(5),
    backgroundColor: Colors?.notchColor,
    alignSelf: 'center',
    borderRadius: normalize(5),
  },
  bottomShadowView: {
    backgroundColor: Colors?.extraLightGrey,
    elevation: 2,
    width: '100%',
    height: normalize(0),
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors?.extraLightGrey,
    shadowColor: Colors?.black,
    shadowOpacity: 0.8,
    shadowRadius: 1.4,
    shadowOffset: {width: 0, height: 2},
  },
  showShadow: {
    elevation: 3,
  },
  hideShadow: {
    elevation: 0,
  },
  container:{
    elevation: 3
  },
  weeksCalenderComponent:{
    backgroundColor: Colors?.extraLightGrey
  },
  panGestureHandlerStyle:{
    padding: normalize(10)
  }
});
