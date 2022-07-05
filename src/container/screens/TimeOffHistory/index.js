import React, { useState } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  SectionList,
  SafeAreaView,
} from 'react-native';
import { WhiteDeleteIcon, WhiteEditIcon } from '../../../assets/img/index.js';
import { Colors } from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header';
import SwipeableComponent from '../../../components/Swipeable/index.js';
import { Text } from '../../../components/Text/index.js';
import { addZeroPrecesion, fontFamily, getTimeDiff, normalize, textSizes } from '../../../lib/globals';
import TimeOffDetails from './TimeOffDetails.js';
import MainHoc from '../../../components/Hoc';
import { useColors } from '../../../hooks/useColors';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../lib/api/index.js';
import Loader from '../../../components/Loader/index.js';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types.js';
import TimeOffCard from '../../../components/Cards/TimeOffCard.js';
import { months, splitDateString } from '../../../util/helper.js';
import { useFocusEffect } from '@react-navigation/core';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';
import { strings } from '../../../lib/I18n/index.js';
import moment from 'moment';
import { DataNotFound } from '../../../components/DataNotFound/index.js';
import { dateFormat } from '../../../lib/globals';
import { FlashMessageComponent } from '../../../components/FlashMessge/index.js';

const iconWidth = textSizes.h10;
const iconHeight = textSizes.h10;

const WrapperComponent = ({
  item,
  navigation,
  handleDeleteTimeOff,
  row = [],
  index,
  children,
  prevOpenedRow,

  closeRow = (index, item) => {
    if (item.Status == 'Pending Approval') {
      if (prevOpenedRow && prevOpenedRow != row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    }
  }
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };


  const handleDeleteAction = () => {
    try {
      row[index].close();
      handleDeleteTimeOff(item);
      toggleDeleteModal();
    } catch (error) {
      toggleDeleteModal();
    }
  };

  const handleEditAction = () => {
    try {
      row[index].close();
      navigation.navigate('ApplyTimeOff', {
        timeOffDetails: item,
        edit: true,
      });
    } catch (error) { }
  };

  switch (item.Status) {
    case 'Pending Approval': {
      return (
        <>
          <SwipeableComponent
            index={index}
            row={row}
            rowOpened={(index) => {
              closeRow(index);

            }}
            buttons={[
              {
                title: strings('timeOff_history.Edit'),
                action: () => handleEditAction(),
                style: { backgroundColor: Colors.blue },
                SvgIcon:
                  item.Status == 'Pending Approval'
                    ? () => (
                      <WhiteEditIcon width={iconWidth} height={iconHeight} />
                    )
                    : null,
              },
              {
                title: strings('timeOff_history.Delete'),
                action: () => toggleDeleteModal(),
                style: { backgroundColor: Colors.deleateRed },
                SvgIcon:
                  item?.Status == 'Pending Approval'
                    ? () => (
                      <WhiteDeleteIcon
                        width={iconWidth}
                        height={iconHeight}
                      />
                    )
                    : null,
              },
            ]}>
            {children}
          </SwipeableComponent>
          {showDeleteModal ? (
            <ConfirmationModal
              title={strings('timeOff_history.Confirmation')}
              discription={strings(
                'timeOff_history.Are_you_sure_want_to_Delete',
              )}
              handleModalVisibility={toggleDeleteModal}
              visibility={showDeleteModal}
              handleConfirm={handleDeleteAction}
            />
          ) : null}
        </>
      );
    }
    case 'Approved ': {
      return <View>{children}</View>;
    }
    case 'Rejected ': {
      return <View>{children}</View>;
    }
    default:
      return <Text>{strings('timeOff_history.No_Data_Found')}</Text>;
  }
};

const TimeOffHistory = ({ navigation }) => {
  const { colors } = useColors();

  let row = [];
  let prevOpenedRow;

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }

    prevOpenedRow = row[index];
  };


  const renderItem = ({ item, index }) => {
    // const startTime = splitDateString(item?.StartTime);
    // const endTime = splitDateString(item?.EndTime);
    const startTime = item?.StartTime?.split(' ')[0].split('/');
    const endTime = item?.EndTime?.split(' ')[0].split('/');
    let yearTwoDigStr = startTime[0].slice(2, 4);
    let yearTwoDigEnd = endTime[0].slice(2, 4);
    // var frmtDate = moment(item?.SendDate).format('Do MMM, h:mm A');
    if (item?.Days == 1) {
      var frmtStartDate = moment(item?.StartTime).format(' h:mm A');
      var frmtEndDate = moment(item?.EndTime).format(' h:mm A');
      if (frmtStartDate != '' && frmtEndDate != '') {
        const time = frmtEndDate - frmtStartDate;

        let diff = getTimeDiff(frmtStartDate, frmtEndDate);

        const timeDiff =
          addZeroPrecesion(diff.hours()) + ':' + addZeroPrecesion(diff.minutes());
        if (diff.hours() > 0 || diff.minutes() > 29) {

          // setTimeDiff(timeDiff);
          // setSelectedTime(time);
        }
        // onSelectTime(item?.StartTime, item?.EndTime)
      }
    }
    let totalHours = '';
    if (item.LeaveType == "Off Time") {
      let hours = item?.Hours != null && item?.Hours != 0 ? item?.Hours.split(' ')[0] : '';
      let minutes = item?.Hours != null && item?.Hours != 0 ? item?.Hours.split(' ')[2] : '';
      minutes == '0' || minutes == '' ? minutes = '' : minutes = '.' + minutes;
      totalHours = hours + minutes
    }
    return (
      <View style={styles.renderItemContainer}>
        <WrapperComponent
          item={item}
          handleDeleteTimeOff={handleDeleteTimeOff}
          navigation={navigation}
          row={row}
          closeRow={(index) => closeRow(index)}
          index={index}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleOnPress(item)}>
            <TimeOffCard
              number={item?.Days > 0 ? item?.Days : totalHours}
              units={item?.Days > 0 ? 'Day' : totalHours == '' ? '' : 'Hr'}
              leaveStatus={item?.Status}
              leaveTitle={item?.Reason}
              // date={`${dateFormat(startTime, 'ddmOyy')} - ${dateFormat(endTime, 'ddmOyy')}`}
              date={`${startTime[1]} ${
                months[startTime[0] - 1]
              } ${startTime[2]} - ${endTime[1]} ${
                months[startTime[0] - 1]
              } ${endTime[2]}`}
            />
          </TouchableOpacity>
        </WrapperComponent>
      </View>
    );
  };

  const [details, setDetails] = useState(null);
  const [timeOffHistory, setTimeOffHistory] = useState([]);
  const [message, setMessage] = useState('');
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  // const toggleDeleteModal = () => {
  //   setShowDeleteModal(!showDeleteModal);
  // };

  const handleOnPress = (data) => {
    console.log("data===>", data)
    setDetails(data);
  };

  const handleDeleteTimeOff = (item) => {
    try {
      const endUrl = `?CompanyId=${userInfo?.CompanyId}&techTimeOffQueueId=${item?.TechOffTimeQueueId}`;
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('warning', msgCode);
            } else if (msgCode.charAt(0) === '1') {
              fetchTimeOffHistory();
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
        },
        error: (deleteError) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      api.deleteTimeOFF(
        {},
        handleCallback,
        {
          Authorization: `Bearer ${token}`,
        },
        endUrl,
      );
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);

  const dispatch = useDispatch();

  const reducer = (acc, cur) => {
    try {
      //chnaging this to get array of months
      const appliedOn = cur?.StartTime?.split(' ')[0].split('/');
      const item = acc.find(
        (x) => x.month === `${months[appliedOn[0] - 1]} ${appliedOn[2]} `,
      );
      if (item) {
        item.data.push(cur);
      } else {
        acc.push({
          month: `${months[appliedOn[0] - 1]} ${appliedOn[2]} `,
          data: [cur],
        });
      }
      return acc;
    } catch (error) { }
  };

  const convertDataToSectionListFormat = (data) => {
    const requiredData = data.reduce(reducer, []);
    setTimeOffHistory(requiredData);
  };

  const fetchTimeOffHistory = async () => {
    dispatch({ type: SET_LOADER_TRUE });
    try {
      const data = {
        CompanyId: userInfo?.CompanyId,
        LoginId: userInfo?.sub,
        TechOffTimeQueueId: 0,
      };
      const handleCallback = {
        success: (timeOffHis) => {
          convertDataToSectionListFormat(timeOffHis);
          setMessage('TimeOff History Not found');
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (timeOffError) => {
          setMessage('TimeOff History Not found');
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      api.timeOffHistory(data, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (e) {
      setMessage('TimeOff History Not found');
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTimeOffHistory();
    }, []),
  );

  return (
    <>
      <View>
        <Header
          title={strings('timeOff_history.header_title')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
          headerRightText={strings('timeOff_history.apply')}
          headerRightTextNavigation={'ApplyTimeOff'}
          navigationParams={{ timeOffDetails: {}, edit: false }}
          rightTextStyle={{
            color: colors?.PRIMARY_BACKGROUND_COLOR,
            fontFamily: fontFamily.semiBold,
          }}
        />
      </View>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.sectionListContainer}>
          {timeOffHistory.length > 0 ? (
            <SectionList
              sections={timeOffHistory}
              renderItem={renderItem}
              keyExtractor={(item, index) => `ID-${index}`}
              showsVerticalScrollIndicator={false}
              renderSectionHeader={({ section: { month } }) => {
                let date = new Date().toDateString();
                let mon = date.slice(4, 7);
                let yr = date.slice(-4);
                let thisMonth = `${mon} ${yr}`;
                return (
                  <View style={styles.sectionListHeaderContainer}>
                    <View style={styles.lineBarStyles} />
                    <Text style={styles.sectionHeaderText}>
                      {thisMonth === month.trim()
                        ? strings('timeOff_history.This_Month')
                        : month}
                    </Text>
                    <View style={styles.lineBarStyles} />
                  </View>
                );
              }}
              maxToRenderPerBatch={7}
            />
          ) : (
            message != '' && <DataNotFound message={message} />
            // <View style={styles.noDataTxt}>
            //   <Text size={textSizes.h9}>{message}</Text>
            // </View>
          )}
          <Loader visibility={isLoading} />
          {details != null ? (
            <TimeOffDetails
              visibility={details == null ? false : true}
              handleVisibility={() => setDetails(null)}
              title={strings('timeOff_history.Time_Off_Details')}
              details={details}
            />
          ) : null}
          {/* {showDeleteModal ? (
            <ConfirmationModal
              title={'COnfirmation'}
              discription={'Are you sure want to Delete ?'}
              handleModalVisibility={toggleDeleteModal}
              visibility={showDeleteModal}
              handleConfirm={handleDeleteTimeOff}
            />
          ) : null} */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default MainHoc(TimeOffHistory);

const styles = StyleSheet.create({
  renderItemContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: normalize(15),
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.appGray,
  },
  sectionListContainer: {
    marginBottom: normalize(20),
    marginTop: normalize(10),
    flex: 1,
  },
  sectionListHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.extraLightGrey,
  },
  lineBarStyles: {
    borderWidth: 0.5,
    flex: 1,
    borderColor: Colors.darkGray,
  },
  sectionHeaderText: {
    marginHorizontal: normalize(7),
    color: Colors.darkGray,
    fontSize: textSizes.h11,
  },
  noDataTxt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
