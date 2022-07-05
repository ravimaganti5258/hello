import { useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Calender, ClockIcon } from '../../../assets/img/index';
import { Colors } from '../../../assets/styles/colors/colors';
import Button from '../../../components/Button';
import PairButton from '../../../components/Button/pairBtn';
import ModalPopUp from '../../../components/DateModalPopUp/index';
import { Dropdown } from '../../../components/Dropdown/index';
import HeaderComponent from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc/index.js';
import { Input } from '../../../components/Input';
import Loader from '../../../components/Loader';
import { Text } from '../../../components/Text/index';
import {
  queryAllRealmObject,
  insertNewRealmObject,
} from '../../../database/index';
import { APPLY_TIME_OFF } from '../../../database/timeOffSchema';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { useColors } from '../../../hooks/useColors';
import api from '../../../lib/api/index.js';
import { Header } from '../../../lib/buildHeader';
import LabelComponent from '../../../components/LableComponent';
import {
  addZeroPrecesion,
  convertFrom12To24Format,
  dateFormat,
  fontFamily,
  getDayDiff,
  getTimeDiff,
  normalize,
  timConvert,
  Timediff,
} from '../../../lib/globals.js';
import { strings } from '../../../lib/I18n';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { accessPermission } from '../../../database/MobilePrevi';
import DatePickerModal from '../JobDetail/PartsAttachments/DatePickerModal';

const current = new Date();
const initialDate = dateFormat(current, 'YYYY-MM-DD');
const ApplyTimeOff = ({ navigation }) => {
  const [leaveIndex, setLeaveIndex] = useState(0);
  const [timeDiff, setTimeDiff] = useState('');
  const [dayDiff, setDayDiff] = useState('');
  const [openCalender, setopenCalender] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [fromDate, setFromDate] = useState(initialDate);
  const [endDate, setEndDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reasonIndex, setReasonIndex] = useState({});
  const [leaveType, setLeaveType] = useState([]);
  const [reasonArray, setReasonArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Edit, setEdit] = useState(false);
  const [managerName, setMangerName] = useState('');
  const [permission, setPermission] = useState({});
  const [showDatePicker, setDatePicker] = useState(false);

  const { colors } = useColors();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  useEffect(() => {
    setIsLoading(true);
    fetchDataRealm();
  }, []);

  useEffect(() => {
    Object.keys(timeOffDetails).length != 0 ? fetchDatafromRoute() : null;
  }, []);

  useEffect(() => {
    if (userInfo?.IsManager) {
      fetchManagerName();
    }
  }, []);

  useEffect(() => {
    accessPermission('Off Time').then((res) => {
      setPermission(res)
    })
  }, []);

  //*** fetch Manager name  api call*/
  const fetchManagerName = () => {
    const handleCallback = {
      success: (data) => {
        setMangerName(data.Name);
      },
      error: (error) => { },
    };

    let headers = Header(token);
    let endpoint = `${userInfo.CompanyId}/${userInfo.ManagerId}`;
    api.getManagerName('', handleCallback, headers, endpoint);
  };

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];

        const result = res?.TimeOffReasons.map((obj) => {
          let data = {
            id: obj.OffTimeReasonId,
            label: obj.Reason,
            value: obj.Description,
          };
          return data;
        });

        if (result != undefined && result.length > 0) {
          setReasonArray(result);
        }
        const leaveType = res?.Leavetypes.map((obj) => {
          return obj;
        });
        setLeaveType(leaveType.reverse());
      })

      .catch((error) => { });

    setIsLoading(false);
  };
  const route = useRoute();
  const { timeOffDetails, edit } = route.params;

  const fetchDatafromRoute = () => {
    // const startTime = timeOffDetails?.StartTime?.split('T');
    // const endTime = timeOffDetails?.EndTime?.split('T');
    const startTime = timeOffDetails?.StartTime?.split(' ');
    const endTime = timeOffDetails?.EndTime?.split(' ');
    setLeaveIndex(timeOffDetails?.LeaveType == 'Full Day' ? 1 : 0),
      setDayDiff(addZeroPrecesion(timeOffDetails?.Days)),
      setReasonIndex({
        id: timeOffDetails.ReasonId,
        label: timeOffDetails.Reason,
        value: timeOffDetails.Reason,
      });

    setFromDate(startTime[0]);
    setEndDate(endTime[0]);
    setFromTime(timeOffDetails?.StartTime);
    setEndTime(timeOffDetails?.EndTime);
    // const sTime = timConvert(startTime[1]);
    // const etime = timConvert(endTime[1]);
    let stTime =  startTime[1].split(':');
    let enTime =  endTime[1].split(':');
    const sTime =  addZeroPrecesion(stTime[0]) + ':' + stTime[1] + ' ' + startTime[2];
    const etime =  addZeroPrecesion(enTime[0]) + ':' + enTime[1] + ' ' +  endTime[2];
    let diff = Timediff(sTime.split(' ')[[0]], etime.split(' ')[0]);
    // const timeDiff = addZeroPrecesion(diff.hours());
    // let minDiff =  ':' + addZeroPrecesion(diff.minutes());
    const totaltime = diff
    setTimeDiff(totaltime);
    setFromTime(startTime[1]);
    setEndTime(endTime[1]);
    let time = `${sTime} - ${etime}`;
    setSelectedTime(time);
    setEdit(edit);
    let date = `${dateFormat(startTime[0], 'DD/MM/YYYY')} - ${dateFormat(
      endTime[0],
      'DD/MM/YYYY',
    )}`;

    setSelectedDate(date);
  };

  const onFocusOut = () => {
    // setopenCalender(true);
  };

  const _onPressSubmit = () => {
    if(leaveIndex == 0 && dayDiff > 1) {
      FlashMessageComponent("warning", strings('apply_timeOff.hours_warning_msg'))
    }
    else if (leaveIndex == 0) {
     if (
        selectedDate != '' &&
        dayDiff != '' &&
        selectedTime != '' &&
        reasonIndex?.label != undefined
      ) {
        const handleCallback = {
          success: (data) => {
            setIsLoading(false);
            if (data?.Message?.MessageCode) {
              const msgCode = data?.Message?.MessageCode;
              if (msgCode.length > 5) {
                FlashMessageComponent('reject', msgCode);
              } else if (msgCode.charAt(0) === '1') {
                setTimeout(() => {
                  navigation.goBack();
                }, 1500);
                FlashMessageComponent(
                  'success',
                  strings(`Response_code.${msgCode}`),
                );
              } else {
                FlashMessageComponent(
                  'reject',
                  strings(`Response_code.${msgCode}`),
                );
              }
            }
            // Alert.alert('Success', data?.Message?.AdditionalInfo, [
            //   {text: 'Ok', onPress: () => navigation.goBack()},
            // ]);
          },
          error: (error) => {
            setIsLoading(false);
            console.log({ error }),
              FlashMessageComponent(
                'reject',
                error?.error_description
                  ? error?.error_description
                  : strings('rejectMsg.went_wrong'),
              );
          },
        };

        const time = selectedTime?.split(' ');
        const time2 =
          selectedTime != '' ? selectedTime?.split('-') : ['00', '00'];

        const startTimeFormat24 =
          time2[0] != '00' ? convertFrom12To24Format(time2[0]) : '00:00:00.000';
        const endtimeFormat24 =
          time2[1] != '00' ? convertFrom12To24Format(time2[1]) : '00:00:00.000';

        const startTime =
          selectedTime !== '' ? `${startTimeFormat24}:00.000` : '00:00:00.000';
        const endTime =
          selectedTime !== '' ? `${endtimeFormat24}:00.000` : '00:00:00.000';

        let data = {
          CompanyId: parseInt(userInfo?.CompanyId),
          TechId: userInfo?.sub,
          LeaveTypeId: leaveType[leaveIndex]?.LeaveTypeId,
          Days: dayDiff,
          StartTime: `${fromDate} ${startTime}`,
          EndTime: `${endDate} ${endTime}`,
          ReasonId: reasonIndex.id,
          ManagerId: '',
          RejectedRemarks: '',
          StatusId: 611,
          CreatedBy: parseInt(userInfo?.sub),
          CreatedSourceId: 2,
          Reason: reasonIndex.value,
          TechOffTimeQueueId: Edit ? timeOffDetails?.TechOffTimeQueueId : 0,
        };
        setIsLoading(true);
        let headers = Header(token);
        api.applyTimeOff(data, handleCallback, headers);
      }
      else {
        setIsLoading(false);
        FlashMessageComponent('warning', strings('Validation_Msg.PFRD'));
      }
    }

    else if (
      selectedDate != '' &&
      dayDiff != '' &&
      reasonIndex?.label != undefined
    ) {
      const handleCallback = {
        success: (data) => {
          setIsLoading(false);
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('reject', msgCode);
            } else if (msgCode.charAt(0) === '1') {
              setTimeout(() => {
                navigation.goBack();
              }, 1500);
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
            } else {
              FlashMessageComponent(
                'reject',
                strings(`Response_code.${msgCode}`),
              );
            }
          }
          // Alert.alert('Success', data?.Message?.AdditionalInfo, [
          //   {text: 'Ok', onPress: () => navigation.goBack()},
          // ]);
        },
        error: (error) => {
          setIsLoading(false);
          console.log({ error }),
            FlashMessageComponent(
              'reject',
              error?.error_description
                ? error?.error_description
                : strings('rejectMsg.went_wrong'),
            );
        },

      };

      const time = selectedTime?.split(' ');
      const time2 =
        selectedTime != '' ? selectedTime?.split('-') : ['00', '00'];

      const startTimeFormat24 =
        time2[0] != '00' ? convertFrom12To24Format(time2[0]) : '00:00:00.000';
      const endtimeFormat24 =
        time2[1] != '00' ? convertFrom12To24Format(time2[1]) : '00:00:00.000';

      const startTime =
        selectedTime !== '' ? `${startTimeFormat24}:00.000` : '00:00:00.000';
      const endTime =
        selectedTime !== '' ? `${endtimeFormat24}:00.000` : '00:00:00.000';

      let data = {
        CompanyId: parseInt(userInfo?.CompanyId),
        TechId: userInfo?.sub,
        LeaveTypeId: leaveType[leaveIndex]?.LeaveTypeId,
        Days: dayDiff,
        StartTime: `${fromDate} ${startTime}`,
        EndTime: `${endDate} ${endTime}`,
        ReasonId: reasonIndex.id,
        ManagerId: '',
        RejectedRemarks: '',
        StatusId: 611,
        CreatedBy: parseInt(userInfo?.sub),
        CreatedSourceId: 2,
        Reason: reasonIndex.value,
        TechOffTimeQueueId: Edit ? timeOffDetails?.TechOffTimeQueueId : 0,
      };
      setIsLoading(true);
      let headers = Header(token);
      api.applyTimeOff(data, handleCallback, headers);
    }
    else {
      setIsLoading(false);
      FlashMessageComponent('warning', strings('Validation_Msg.PFRD'));
    }
  };

  const onSelectDate = (fromDate, toDate) => {
    if (fromDate != '' && toDate != '') {
      let startDate = dateFormat(fromDate, 'DD/MM/YYYY');
      let endDate = dateFormat(toDate, 'DD/MM/YYYY');
      setFromDate(fromDate);
      setEndDate(toDate);
      const date = startDate + ' - ' + endDate;
      setSelectedDate(date);
      const diffDays = getDayDiff(fromDate, toDate);
      setDayDiff(addZeroPrecesion(diffDays + 1));
    } else {
      setSelectedDate('');
      setDayDiff('');
    }
  };

  const onSelectTime = (startTime, endTime) => {

    if (startTime != '' && endTime != '') {
      const time = startTime + ' - ' + endTime;

      let diff = getTimeDiff(startTime, endTime);
      const timeDiff =
        addZeroPrecesion(diff.hours()) + ':' + addZeroPrecesion(diff.minutes());
      if (diff.hours() > 0 || diff.minutes() > 29) {
        setTimeDiff(timeDiff);
        setSelectedTime(time);
      } else {
        FlashMessageComponent(
          'warning',
          strings('Response_code.TIMESUDBEGRATERTHAN'),
        );
        setSelectedTime('');
        setTimeDiff('');
      }
    } else {
      setSelectedTime('');
      setTimeDiff('');
    }
  };
  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
  };
  const _leaveType = () => {
    return (
      <View style={styles.btnWrap}>
        {leaveType.map((e, i) => {
          return (
            <Button
              key={`ID-${i}`}
              title={e.LeaveTypeDesc == 'Off Time' ? 'Hours' : e.LeaveTypeDesc}
              backgroundColor={
                leaveIndex == i
                  ? colors?.PRIMARY_BACKGROUND_COLOR
                  : Colors.white
              }
              txtColor={
                leaveIndex == i
                  ? Colors.white
                  : colors?.PRIMARY_BACKGROUND_COLOR
              }
              width={'30%'}
              height={'auto'}
              onClick={() => {
                setLeaveIndex(i);
              }}
              fontSize={normalize(13)}
              fontFamily={fontFamily.bold}
              leftIcon={leaveIndex == i ? true : false}
              style={[
                styles.fullOffBtnStyle,
                {
                  borderColor: colors?.PRIMARY_BACKGROUND_COLOR,
                  justifyContent: leaveIndex == i ? 'flex-start' : 'center',
                  paddingLeft: leaveIndex == i ? normalize(14) : null,
                },
              ]}
              leftIconStyle={{}}
            />
          );
        })}
      </View>
    );
  };
  let hrs, mins;
  if (timeDiff) {
    hrs = parseInt(dayDiff) * parseInt(timeDiff);
    mins = parseInt(dayDiff) * timeDiff.split(':')[1];
     if (mins > 60 && mins != NaN) {
      hrs += Math.floor(mins / 60);
      mins = mins % 60;
     }
  }
  return (
    <View style={styles.container}>
      <HeaderComponent
        title={strings('apply_timeOff.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
      />

      <View style={styles.bodyWrap}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 40 }}>
            {/* body section */}
            <Text align={'flex-start'}>
              {' '}
              {strings('apply_timeOff.leave_type')}
            </Text>
            {_leaveType()}
            {/* <View> */}
            <LabelComponent
              label={strings('apply_timeOff.reason')}
              style={{ marginTop: normalize(10) }}
              required={true}
            />
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={reasonIndex.label}
              list={reasonArray}
              selectedItem={reasonIndex}
              handleSelection={setReasonIndex}
              align={'flex-start'}
              dropDownContainer={{
                borderColor: Colors.darkSecondaryTxt,
                borderRadius: normalize(10),
              }}
              dropDownBodyContainer={{
                borderColor: Colors.darkSecondaryTxt,
                elevation: 2,
              }}
              itemStyle={styles.dropdownTextStyle}
            />
            {/* <Pressable onPress={() => setopenCalender(true)}> */}
            {/* </View> */}
            <LabelComponent
              label={strings('apply_timeOff.from_date-to_date')}
              style={{ marginTop: normalize(15), paddingBottom: normalize(2) }}
              required={true}
            />
            <TouchableOpacity
              style={[styles.dateInput, styles.calenderFields]}
              onPress={() => {
                leaveIndex == 0 ?
                toggleDatePicker() :
                setopenCalender(true);
              }}>
              <Text style={[styles.inputFieldStyle]}>{selectedDate}</Text>
              <View style={{ justifyContent: 'flex-end' }}>
                <Calender height={normalize(16)} width={normalize(16)} />
              </View>
            </TouchableOpacity>

            {dayDiff != '' && (
              <Text
                color={Colors.secondryBlack}
                size={normalize(13)}
                align={'flex-end'}
                style={{ padding: normalize(3) }}>
                {dayDiff > 1
                  ? strings('apply_timeOff.no_of_days')
                  : strings('apply_timeOff.no_of_day')}
                <Text color={Colors.blue} fontFamily={fontFamily.bold}>
                  {' '}
                  { dayDiff }
                </Text>
              </Text>
            )}

            {leaveIndex == 0 && (
              <>
                <LabelComponent
                  label={strings('apply_timeOff.start_time-end_time')}
                  style={{
                    marginTop: normalize(15),
                    paddingBottom: normalize(2),
                  }}
                  required={true}
                />
                <TouchableOpacity
                  style={[styles.dateInput, styles.calenderFields]}
                  onPress={() => {
                    setOpenTimePicker(true);
                  }}>
                  <Text style={[styles.inputFieldStyle]}>{selectedTime}</Text>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <ClockIcon height={normalize(17)} width={normalize(17)} />
                  </View>
                </TouchableOpacity>
                {timeDiff != '' && (
                  <Text
                    color={Colors.secondryBlack}
                    size={normalize(13)}
                    align={'flex-end'}
                    style={{ padding: normalize(3) }}>
                    {parseInt(timeDiff) > 1
                      ? strings('apply_timeOff.no_of_hours')
                      : strings('apply_timeOff.no_of_hour')}
                       {/* <View> */}
                       {dayDiff ? <Text color={Colors.blue} fontFamily={fontFamily.bold}>
                      {' '}
                      {hrs < 10 ? `0${hrs}` : `${hrs}`}
                      {mins < 10 ? `:0${mins}` : `:${mins}`}
                    </Text> : FlashMessageComponent('warning', strings('apply_timeOff.fill_date'))}
                  </Text>
                )}
              </>
            )}
            {userInfo?.IsManager && managerName != '' && (
              <View style={styles.managerInfoWrap}>
                <Text align={'flex-start'} size={normalize(13)}>
                  {strings('apply_timeOff.manager')}
                </Text>
                <Text
                  align={'flex-start'}
                  size={normalize(14)}
                  color={Colors.secondryBlack}>
                  {managerName != '' ? managerName : '-'}
                </Text>
              </View>
            )}

            <ModalPopUp
              visible={openCalender}
              onCancle={() => setopenCalender(false)}
              pickerType={'Calender'}
              pickerTitle={strings('apply_timeOff.select_from_and_to_date')}
              startLable={strings('apply_timeOff.from')}
              endLable={strings('apply_timeOff.to')}
              selectedDate={(fromDate, toDate) => {
                onSelectDate(fromDate, toDate)
              }}
              startDate={fromDate}
              endDate={endDate}
              leaveType={leaveIndex}
            />
            <DatePickerModal

              handleModalVisibility={toggleDatePicker}
              visibility={showDatePicker}
              setDate={(date) => {
                onSelectDate(date,date)
              }}
              selectedDate={fromDate}
            />
            <ModalPopUp
              visible={openTimePicker}
              onCancle={() => setOpenTimePicker(false)}
              pickerType={'Time'}
              pickerTitle={strings(
                'apply_timeOff.select_start_time_and_end_time',
              )}
              startLable={strings('apply_timeOff.start')}
              endLable={strings('apply_timeOff.end')}
              selectedTime={(startTime, endTime) => {
                onSelectTime(startTime, endTime);
              }}
              fromTime={fromTime}
              endTime={endTime}
            />
          </View>
        </ScrollView>
      </View>

      {/* footer section */}
      <View style={styles.footer}>
        <PairButton
          title1={strings('pair_button.cancel')}
          title2={
            edit ? strings('pair_button.update') : strings('pair_button.submit')
          }
          onPressBtn2={() => permission?.Add && _onPressSubmit()}
          onPressBtn1={() => navigation.navigate('Dashboard')}
          btn2Style={{ backgroundColor: permission?.Add ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.darkGray }}

        />
      </View>
      <Loader visibility={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyWrap: {
    marginHorizontal: 20,
    marginVertical: normalize(20),
    flex: 1,
  },
  flatlistContainer: {
    margin: 10,
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
  },
  btnWrap: {
    flexDirection: 'row',
    paddingVertical: normalize(10),
  },
  fullOffBtnStyle: {
    borderWidth: 1,
    borderRadius: normalize(50),
    paddingVertical: normalize(8),
    marginRight: normalize(15),
    justifyContent: 'flex-start',
  },

  managerInfoWrap: {
    backgroundColor: Colors.lightBackground,
    padding: normalize(15),
    marginVertical: 20,
    borderRadius: normalize(8),
  },
  inputFieldStyle: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 0.1,
    paddingBottom: Platform.OS === 'ios' ? normalize(5) : normalize(10),
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: normalize(10),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(5),
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(3),
    color: 'black',
  },
  calenderFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(10),
  },
});

export default MainHoc(ApplyTimeOff);
