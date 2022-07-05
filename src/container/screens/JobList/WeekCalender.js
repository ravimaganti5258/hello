import React, { Component, useState } from 'react';
import { View, Text, Button } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { Colors } from '../../../assets/styles/colors/colors';
import { fontFamily, normalize } from '../../../lib/globals';

export const WeekCalenderComponent = ({
  currentDate,
  weekCalendarRef,
  getCurrentMonth = () => { },
  setCurrentDate,
  markedDate,
  themeColor = '#17338d'
}) => {
  let startDate = moment();
  const [selectedDate, setSelectedDate] = useState(startDate);

  // Create a week's worth of custom date styles and marked dates.
  let customDatesStyles = [];
  let markedDates = [];
  let d2 = moment(markedDate[0]);
  const data2 = [markedDate];

  for (const key in markedDate) {
    let obj = {
      date: moment(key),
      dots: [
        {
          color: markedDate[key]?.dotColor,
          selectedColor: markedDate[key]?.dotColor,
        },
      ],
    };
    markedDates.push(obj);
  }

  const datesBlacklistFunc = (date) => {
    return date.isoWeekday() === 6; // disable Saturdays
  };

  const onDateSelected = (selectedDate) => {
    setSelectedDate(selectedDate);
    setCurrentDate(selectedDate);
  };

  const setSelectedDateNextWeek = (date) => {
    const selectedDate1 = moment(selectedDate).add(1, 'week');
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    setSelectedDate(selectedDate1);
  };

  const setSelectedDatePrevWeek = (date) => {
    const selectedDate1 = moment(selectedDate).subtract(1, 'week');
    setSelectedDate(selectedDate1);
  };

  const startingWeekDate = markedDates?.map((ele) => {
    const day1 = ele?.date.format('ddd');
    // if (day1 == 'Sun') {
    //   return ele?.date;
    // }
  });
  const filterData = startingWeekDate.filter((ele) => ele != undefined);
  return (
    <View>
      <CalendarStrip
        scrollable={true}
        scrollerPaging={true}
        ref={(ref) => (weekCalendarRef.current = ref)}
        calendarAnimation={{ type: 'sequence', duration: 30 }}
        // daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#9265DC' }}
        style={{
          height: normalize(90),
          // paddingTop: normalize(2),
          // paddingBottom: normalize(5),
        }}

        calendarHeaderStyle={{ color: 'transparent', height: 0 }}
        onWeekChanged={(week) => {
          getCurrentMonth(new Date(week).getMonth(), moment(week).format('YYYY-MM-DD'))}}
        dateNumberStyle={{
          color: Colors.secondryBlack,
          fontSize: normalize(14),
          fontFamily: fontFamily?.regular,
          fontWeight: 'normal',
          marginBottom: normalize(30),
        }}
        dateNameStyle={{ color: Colors.darkGray, fontSize: normalize(14), marginBottom: normalize(10) }}
        iconContainer={{ flex: 0 }}
        customDatesStyles={customDatesStyles}
        highlightDateNameStyle={{
          color: Colors.darkGray,
          fontSize: normalize(14),
          // paddingBottom: normalize(15),
        }}
        highlightDateNumberStyle={{
          color: Colors.white,
          fontWeight: 'normal',
          width: normalize(30),
          fontSize: normalize(14),
        }}
        highlightDateContainerStyle={{
          backgroundColor: themeColor,
          width: normalize(35),
          borderRadius: normalize(6),
          height: normalize(30),
        }}
        markedDates={markedDates}
        // selectedDate={selectedDate}
        selectedDate={currentDate}
        onDateSelected={onDateSelected}
        useIsoWeekday={true}
        iconLeft={null}
        iconRight={null}
        upperCaseDays={false}
        startingDate={filterData[0]}
      // showDayName={false}
      />

      {/* 
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Button
                    onPress={setSelectedDatePrevWeek}
                    title="Select previous week"
                    color="#841584"
                />
                <Button
                    onPress={setSelectedDateNextWeek}
                    title="Select next week"
                    color="#841584"
                />
            </View> */}
    </View>
  );
};
