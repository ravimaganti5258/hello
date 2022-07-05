import React, { memo } from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Colors } from '../../../assets/styles/colors/colors';
import EventCards from '../../../components/Cards/EventCards';
import { Text } from '../../../components/Text';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { getWeek, months } from '../../../util/helper';

import { DataNotFound } from '../../../components/DataNotFound';
import { useColors } from '../../../hooks/useColors';
import { color } from 'react-native-reanimated';

const RenderItem = memo(({ item, navigation }) => {
  const { colors } = useColors();
  const renderFalgBasedonstatus = (value) => {
    let Status = '';
    switch (value?.JobStatusid) {
      //Awaiting Schedule
      case 1:
        Status = value?.jobstatus;
        break;
      //Scheduled
      case 2:
        Status = value?.AcceptanceStatusId == 1 ? 'Accepted' : value?.jobstatus;
        break;
      //En Route
      case 3:
        Status = value?.jobstatus;
        break;
      // On Site
      case 4:
        Status = value?.jobstatus;
        break;
      //Completed-submitted
      case 5:
        // Status = value?.issubmitted == 'yes' ? 'Submitted' : value?.jobstatus;
        Status = value?.ApprovalSatatusId == 1 || value?.ApprovalSatatusId == 2 || value?.ApprovalSatatusId == 4 ? 'Submitted' : value?.ApprovalSatatusId == 3 || value?.ApprovalSatatusId == 5 ? 'Approval Rejected' : value?.jobstatus
        break;
      //Unresolved
      case 6:
        Status = value?.jobstatus;
        break;

      default:
        break;
    }
    return Status;
  };
  const date = item.date.split('-');
  const handleOnPress = (jobDetails) => {
    navigation.navigate('JobDetail', {
      jobId: jobDetails?.jobno,
      isCrewMember: jobDetails?.CrewJob,
      workorderid: jobDetails?.workorderid
    });
  };
  return (
    <View style={styles.renderItemContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date[2]}</Text>
        <Text style={styles.monthText}>{months[date[1] - 1]}</Text>
        <Text size={textSizes.h12}>{getWeek(date[0], date[1], date[2])}</Text>
      </View>
      <View style={styles.cardContainer}>
        {item.event.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleOnPress(item)}
              style={styles.cardStyles}
              key={`ID-${index}`}>
              <EventCards
                type={'calenderEvent'}
                eventStatus={renderFalgBasedonstatus(item)}
                jobNumber={item?.jobno}
                technicianName={item?.customername}
                themeColor={colors?.PRIMARY_BACKGROUND_COLOR}
                eventJobTime={
                  // item?.CrewJob == 'Yes' && item?.Days > 0
                  //   ? `${item?.Days > 1 ? `${item.Days} Days` : `${item.Days} Day`}`
                  //   : item?.Hours > 0 ? item?.Minutes > 0 ? `${item?.Hours}h ${item?.Minutes}m`
                  //   : `${item?.Hours}h` : item?.Minutes > 0 ? `${item?.Minutes}m` : ''
                  // item?.CrewJob == 'Yes' && item?.Days > 0
                  //   ? `${item?.Days > 1 ? `${item.Days} Days` : `${item.Days} Day`}`
                  //   : `${item?.Hours}h ${item?.Minutes}m`
                 ` ${item?.Days > 0 ? item?.Days > 1 ? `${item.Days} Days` : `${item.Days} Day` : ''}` + `${item?.Hours > 0 ? ' ' + item?.Hours + 'h': ''}` + `${item?.Minutes > 0 ? ' ' +item?.Minutes + 'm': ''}`
                }
                jobTitle={item?.wocategory}
                eventDate={item?.ScheduledDateTime}
                address={item?.AcctualAddress}
                CrewJob={item?.CrewJob}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const CalenderView = ({ flatListRef, data, message, scrollIndex }) => {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {
    return <RenderItem item={item} navigation={navigation} />;
  };

  const keyExtractor = (item, index) => `ID-${index}`;

  return (
    <View style={styles.container}>
      {data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ref={flatListRef}
          maxToRenderPerBatch={70}
          initialNumToRender={70}
          initialScrollIndex={scrollIndex}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info?.index,
                animated: true,
              });
            });
          }}
        />
      ) : (
        <View style={styles.noDataTxtContainer}>
          {message != '' && <DataNotFound />}
        </View>
      )}
    </View>
  );
};

export default CalenderView;

const styles = StyleSheet.create({
  knobStyles: {
    width: normalize(58),
    height: normalize(4),
    backgroundColor: Colors.darkSecondaryTxt,
    marginTop: normalize(8),
    borderRadius: 10,
  },
  container: {
    flex: 1,
    paddingVertical: normalize(10),
    zIndex: -1,
  },
  renderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(5),
    paddingRight: normalize(10),
  },
  dateContainer: {
    borderRightWidth: 1,
    alignSelf: 'flex-start',
    height: '100%',
    marginRight: normalize(8),
    paddingTop: normalize(10),
    borderRightColor: Colors.darkSecondaryTxt,
    flex: 0.1,
  },
  dateText: {
    fontSize: textSizes.h8,
    marginTop: normalize(10),
    fontFamily: fontFamily.bold,
  },
  monthText: {
    fontSize: textSizes.h12,
    fontFamily: fontFamily.bold,
  },
  cardContainer: {
    flex: 1,
    borderTopWidth: 1,
    paddingTop: normalize(10),
    borderTopColor: Colors.darkSecondaryTxt,
  },
  cardStyles: {
    paddingTop: normalize(10),
    paddingBottom: normalize(20),
  },
  noDataTxtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
