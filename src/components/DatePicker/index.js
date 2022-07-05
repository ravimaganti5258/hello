import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, I18nManager} from 'react-native';
import {Calendar, LocaleConfig, WeekCalendar} from 'react-native-calendars';
import {testIDs} from './testId';
import {Colors} from '../../assets/styles/colors/colors';
import {useColors} from '../../hooks/useColors';
import {
  dateFormat,
  fontFamily,
  getDayDiff,
  normalize,
  timeFormat,
} from '../../lib/globals';
import moment from 'moment';
import {BlueArrowBack} from '../../assets/img/index';
import {Text} from '../Text';
import { strings } from '../../lib/I18n';

const {width, height} = Dimensions.get('screen');

let monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const week = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

let calendarDate = moment();

const index = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  markingDate,
  setMarkingDates,
  currentDa,
  setSelectedIndex,
  onDayPress,
  type = '',
  getSelectedDate,
  timer = false,
  selectedTime,
  currentTime,
}) => {
  const [markedDate, setMarkedDates] = useState({});
  const [isStartDatePicked, setIsStartDatePicked] = useState(false);
  const [isEndDatePicked, setIsEndDatePicked] = useState(false);
  const [StartDate, setStartDate] = useState(fromDate);
  const [EndDate, setEndDate] = useState(toDate);
  const {colors} = useColors();
  const [currentDate, setCurrentDate] = useState(
    calendarDate.format('YYYY-MM-DD'),
  );
  const markerStyle = {
    markerCustom: {
      color: Colors.lighestBlue,
      customStyles: {
        container: {
          backgroundColor: Colors.lighestBlue,
          width: normalize(65),
          borderRadius: normalize(0),
          height: normalize(35),
          bottom: normalize(2)
        },
        text: {
          color: Colors.darkTextGrey,
          fontSize: normalize(15)
        },
      },
    },
    darkCustomStyle: {
      container: {
        backgroundColor: colors.PRIMARY_BACKGROUND_COLOR,
        borderRadius: 8,
        justifyContent:"center",
        alignSelf:"center"
      },
      text: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: normalize(15)
      },
    },
  };

  useEffect(() => {
    setMarkedDates(markingDate);
  }, [markingDate]);

  useEffect(() => {
    setCurrentDate(currentDa);
  }, [currentDa]);

  const customHeader = (date) => {
   
    const month = date.month.getMonth();
    const year = date.month.getUTCFullYear();
    const MONTH = monthNames[month];
    const selectedMonth = MONTH + ' ' + year;
    return (
      <>
        <View style={styles.customHeader}>
          <Text
            // style={{
            //   // flex: 1
            // }}
            fontFamily={fontFamily.bold}
            color={colors?.PRIMARY_BACKGROUND_COLOR}
            size={normalize(17)}>
            {selectedMonth}
          </Text>
          <View style={styles.arrowWrap}>
            <TouchableOpacity
              onPress={() => onPressArrowLeft(date?.addMonth)}
              style={styles.arrowStyle}>
              <BlueArrowBack height={normalize(15)} 
              width={normalize(15)} 
              style={{color:colors.PRIMARY_BACKGROUND_COLOR}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressArrowRight(date?.addMonth)}
              style={styles.arrowStyle}>
              <BlueArrowBack
                onPress={() => onPressArrowRight(date?.addMonth)}
                style={{
                  transform: [{rotate: '180deg'}],
                  color:colors.PRIMARY_BACKGROUND_COLOR
                }}
                height={normalize(15)}
                width={normalize(15)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dayNameWarp}>
          {week.map((week, index) => {
            return (
              <Text
                key={`ID-${index}`}
                color={Colors.darkTextGrey}
                size={normalize(10)}>
                {week}
              </Text>
            );
          })}
        </View>
      </>
    );
  };

  const _onDayPress = (day) => {
    if (isStartDatePicked == false) {
      let markedDates = {};
      markedDates[day.dateString] = {
        startingDay: true,
        customStyles: markerStyle.darkCustomStyle,
        
      };
      setMarkedDates(markedDates);
      setIsStartDatePicked(true);
      setIsEndDatePicked(false);
      setStartDate(day.dateString);
      setFromDate(day.dateString);
      setSelectedIndex(0);
    } else {
      let markedDates = markedDate;
      let startDate = moment(StartDate);
      let endDate = moment(day.dateString);
      let range = endDate.diff(startDate, 'days');

      if (range >= 0) {
        for (let i = 1; i <= range; i++) {
          let tempDate = startDate.add(1, 'day');
          tempDate = moment(tempDate).format('YYYY-MM-DD');
          if (i < range) {
            markedDates[tempDate] = markerStyle.markerCustom;
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              customStyles: markerStyle.darkCustomStyle,
            };

            setSelectedIndex(1);
          }
        }
        setToDate(day.dateString);
        setMarkedDates(markedDates);
        setIsStartDatePicked(false);
        setIsEndDatePicked(true);
        setMarkingDates(markedDate);
      } else {
        setToDate('');
        alert(strings('calender.Select_an_upcoming_date'));
      }
    }
  };

  const onPressArrowLeft = (event) => {
    event ? event(-1) : null;
  };

  const onPressArrowRight = (event) => {
    event ? event(1) : null;
  };

  const handleDayOnPress = (day) => {
    try {
      let markedDates = {};
      markedDates[day.dateString] = {
        startingDay: true,
        customStyles: markerStyle.darkCustomStyle,
        
      };
      setMarkedDates(markedDates);
      getSelectedDate ? getSelectedDate(day?.dateString) : null;
      onDayPress ? onDayPress() : null;
    } catch (error) {}
  };

  return (
    <View>
      <Calendar
        testID={testIDs.calendars.FIRST}
        current={fromDate}
        style={styles.calendar}
        onDayPress={type == 'addParts' ? handleDayOnPress : _onDayPress}
        markedDates={markedDate}
        markingType="custom"
        customHeader={customHeader}
        minDate={new Date()}
        theme={{
          dayTextColor: Colors.secondryBlack,
          textDayFontFamily: fontFamily.semiBold,
          textMonthFontFamily: fontFamily.regular,
          textDayHeaderFontFamily: fontFamily.bold,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          monthTextColor: Colors.blue,
          textDayFontSize: normalize(15),
          textMonthFontSize: normalize(16),
          textDayHeaderFontSize: normalize(15),
          arrowColor: Colors.blue,
        }}
        enableSwipeMonths={true}
      />
    </View>
  );
  
};
// const markerStyle = {
//   markerCustom: {
//     color: Colors.lighestBlue,
//     customStyles: {
//       container: {
//         backgroundColor: Colors.lighestBlue,
//         width: normalize(65),
//         borderRadius: normalize(0),
//         height: normalize(35),
//         bottom: normalize(2)
//       },
//       text: {
//         color: Colors.darkTextGrey,
//         fontSize: normalize(15)
//       },
//     },
//   },
//   darkCustomStyle: {
//     container: {
//       backgroundColor: 'red',
//       borderRadius: 8,
//       justifyContent:"center",
//       alignSelf:"center"
//     },
//     text: {
//       color: Colors.white,
//       fontWeight: 'bold',
//       fontSize: normalize(15)
//     },
//   },
// };


const styles = StyleSheet.create({
  calendar: {
    marginBottom: normalize(10),
  },
  customHeader: {
    // flexDirection: I18nManager.isRTL?'row-reverse':'row',
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    paddingLeft: normalize(15),
    marginRight: normalize(5),
    marginBottom: 10,
  },
  dayNameWarp: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  arrowWrap: {
    flex: 0.4,
    flexDirection:I18nManager.isRTL?'row-reverse': 'row',
    alignItems:'center',
    top:0.5,
    justifyContent: 'space-between',
  },
  arrowStyle: {
    alignSelf: 'center',
    padding: normalize(10),
  },
});

export default index;
