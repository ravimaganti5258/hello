import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddPartsCalenderIcon } from '../../../assets/img';
import { totalHrs, minDropDown } from '../../../assets/jsonData';
import { Colors } from '../../../assets/styles/colors/colors';
import { Dropdown } from '../../../components/Dropdown';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { ModalContainer } from '../../../components/Modal';
import MultiButton from '../../../components/MultiButton';
import { Text } from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import { useDimensions } from '../../../hooks/useDimensions';
import api from '../../../lib/api';
import {
  fontFamily,
  normalize,
  textSizes,
  dateFormat,
  convertFrom24To12Format,
} from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import DatePickerModal from './PartsAttachments/DatePickerModal';
import { Header } from '../../../lib/buildHeader';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ResumeJobModal = ({ handleModalVisibility, visibility }) => {
  const todayDate = new Date();
  const currentDate = dateFormat(todayDate, 'YYYY-MM-DD');
  const [date, setDate] = useState(currentDate);
  const [showDatePicker, setDatePicker] = useState(false);
  const [hrs, setHrs] = useState(totalHrs(23, 'Hrs'));
  const [min, setMin] = useState(minDropDown(59, 'Mins'));
  const [selectedMin, setSelectedMin] = useState({});
  const [selectedHrs, setSelectedHrs] = useState({});
  const [goEnable, setGoEnable] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [availableDateList, setavailableDateList] = useState([]);
  const [empMsg, setEmpMsg] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [hoursDesign, setHoursDesign] = useState(false);
  const [minDesign, setMinDesign] = useState(false);
  const [hoursContain, sethoursContain] = useState('');
  const [selectedAvailableDateIndex, setSelectedAvailableDateIndex] =
    useState(-1);
  const { colors } = useColors();
  const { height } = useDimensions();

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );

  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
  };

  useEffect(() => {
    const sortedHr = hrs?.filter(
      (obj) => obj.value == JSON.stringify(jobDetail?.Hours),
    );
    const sortedMin = min?.filter((obj) => obj.value == jobDetail?.Minutes);
    setSelectedHrs(sortedHr[0]);
    setSelectedMin(sortedMin[0]);
  }, [jobDetail]);
  const buttons = [
    {
      btnName: strings('resume_Job_modal.cancel'),
      onPress: () => handleModalVisibility(),
      btnTxtStyles: { ...styles?.actionBtnTxtStyles },
      btnStyles: { ...styles?.cancelBtnStyles },
    },
    {
      btnName: strings('resume_Job_modal.save'),
      onPress: () => addFlag && goEnable && onPressSave(),
      btnTxtStyles: { ...styles?.actionBtnTxtStyles, color: Colors?.white },
      btnStyles: {
        ...styles?.saveBtnStyles,
        backgroundColor:
          addFlag && goEnable
            ? colors?.PRIMARY_BACKGROUND_COLOR
            : Colors?.darkGray,
      },
    },
  ];

  const buttonCancel = [
    {
      btnName: strings('resume_Job_modal.cancel'),
      onPress: () => handleModalVisibility(),
      btnTxtStyles: { ...styles?.actionBtnTxtStyles },
      btnStyles: { ...styles?.cancelBtnStyles },
    },
  ];

  //function to save resume job reason
  const onPressSave = () => {
    const handleCallback = {
      success: (data) => {

        handleModalVisibility();
        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
      },
      error: (error) => {
        handleModalVisibility();
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : strings('rejectMsg.went_wrong'),
        );
      },
    };

    let apiPayload = {
      piWoJobId: jobDetail?.WoJobId,
      piTechId: jobDetail?.TechId,
      piWorkDate: selectedSchedule?.AvailableDate,
      piStartTime: selectedSchedule?.StartTime,
      piEndTime: selectedSchedule?.EndTime,
      piTravelTime: selectedSchedule?.TravelTime,
      piDistance: selectedSchedule?.Distance,
      piComments: '',
      piIsConfirm: 1,
      piCompanyId: userInfo?.CompanyId,
      piLoginId: jobDetail?.TechId,
      piNextJobStartTime: selectedSchedule?.NextJobStartTime,
      piNextJobId:
        selectedSchedule?.NextJobId != null ? selectedSchedule?.NextJobId : 0,
      piNextJobTravelTime: selectedSchedule?.NextJobTravelTime,
      piNextJobDistance: selectedSchedule?.NextJobDistance,
      piVendorId: userInfo?.VendorId,
      scheduled: 1,
      piArrivalTime: selectedSchedule?.ArrivalTime,
      PiSourceId: 2,
      workStartDate: selectedSchedule?.StartTime,
      workEndDate: selectedSchedule?.EndTime,
    };
    let headers = Header(token);
    api.saveResumeJob(apiPayload, handleCallback, headers);
  };

  // ********* flatlist render item function ***//
  const renderItem = ({ item, index }) => {
    let startTime = convertFrom24To12Format(item?.StartTime);
    let endTime = convertFrom24To12Format(item?.EndTime);

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedAvailableDateIndex(index);
          setSelectedSchedule(item);
          setAddFlag(true);
        }}
        style={[
          styles.availableHrs,
          {
            marginTop: normalize(5),
          },
        ]}>
        <Text align={'flex-start'}>
          {dateFormat(item?.AvailableDate, 'DD/MM/YYYY')} {startTime} to{' '}
          {endTime}
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  //api function to fetch schdules for resuming job
  const onPressGo = (val) => {
    const formatedDate = moment(date).format('ddd MMM D YYYY');
    const handleCallback = {
      success: (data) => {
        setavailableDateList(data?.TechWorkSchedule);
        if (val == 'goenable') {
        } else {
          setHoursDesign(true);
          setMinDesign(true);
        }

        setGoEnable(true);

        setEmpMsg(true);
      },
      error: (error) => {
        console.log(error);
      },
    };

    let apiPayload = {
      PiWoJobId: jobDetail?.WoJobId,
      PiSkillMatchReq: 0,
      PiRegionMatchReq: 0,
      PiCertificationMatchReq: 0,
      PiIncludeCapacity: 0,
      PiWorkTypeMatchReq: 0,
      PiAllowOverTime: 0,
      PiShowTechniciansAround: null,
      PiTechnician: jobDetail?.TechDisplayName,
      PiSortBy: null,
      PiStartDate: formatedDate,
      PiScheduleRange: 0,
      PiLoginId: jobDetail?.TechId,
      PiCompanyId: parseInt(userInfo?.CompanyId),
      PiTechid: jobDetail?.TechId,
      PiVendorId: jobDetail?.VendorId,
      PiShowCrew: 0,
    };

    let headers = Header(token);
    api.fetchResumeJobSchedule(apiPayload, handleCallback, headers);
  };

  return (
    <ModalContainer
      visibility={visibility}
      containerStyles={{ top: normalize(50) }}>
      <View
        style={[
          styles.container,
          {
            maxHeight: height / 1.4,
            minHeight:
              hoursDesign == true || minDesign == true ? height * 0.47 : 0,
          },
        ]}>
        <ScrollView style={{ flexGrow: 1 }} nestedScrollEnabled={true}>
          <Text style={styles.resumeJobTxt}>
            {strings('resume_Job_modal.resume_job')}
          </Text>

          <View style={styles?.marginTopStyles}>
            <Text align={'flex-start'} size={normalize(13)}>
              {strings('resume_Job_modal.preferred_date')}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                toggleDatePicker();
              }}
              style={styles.calenderInputContainer}>
              <Text style={styles.dateTxtStyles}>
                {date != '' ? dateFormat(date, 'DD/MM/YYYY') : ''}
              </Text>
              <AddPartsCalenderIcon
                height={normalize(21)}
                width={normalize(23)}
              />
            </TouchableOpacity>
          </View>

          <View style={styles?.marginTopStyles}>
            <Text align={'flex-start'} size={normalize(13)}>
              {strings('resume_Job_modal.expected_time')}
            </Text>
            <View style={styles.dropDownContainer}>
              <View style={styles.dropDown}>
                <Dropdown
                  list={hrs}
                  zIndexVal={1}
                  selectedItem={selectedHrs}
                  handleSelection={(val) => {
                    setSelectedHrs(val);
                    setHoursDesign(false);
                    setMinDesign(false);
                    setGoEnable(false);
                    setEmpMsg(false);
                  }}
                  onPressCb={(val) => {
                    sethoursContain(selectedHrs?.label);
                    setHoursDesign(true);
                    setMinDesign(true);
                    setGoEnable(true);
                    setEmpMsg(true);
                    if (val == true) {
                      setHoursDesign(false);
                      setMinDesign(false);
                      setGoEnable(false);
                      setEmpMsg(false);
                    }
                  }}
                  label={selectedHrs?.label || 'Select'}
                  dropDownBodyContainer={{
                    ...styles?.dropDownBodyContainer,
                    ...styles?.dropDownBorder,
                  }}
                  dropDownContainer={styles.dropDownBorder}
                />
              </View>
              <View style={styles.dropDown}>
                <Dropdown
                  list={min}
                  zIndexVal={1}
                  selectedItem={selectedMin}
                  handleSelection={(val) => {
                    setHoursDesign(false);
                    setMinDesign(false);
                    setGoEnable(false);
                    setEmpMsg(false);
                    setSelectedMin(val);
                  }}
                  onPressCb={(val) => {
                    setHoursDesign(true);
                    setMinDesign(true);
                    setGoEnable(true);
                    setEmpMsg(true);
                    if (val == true) {
                      setHoursDesign(false);
                      setMinDesign(false);
                      setGoEnable(false);
                      setEmpMsg(false);
                    }
                  }}
                  label={selectedMin?.label || 'Select'}
                  dropDownBodyContainer={{
                    ...styles?.dropDownBodyContainer,
                    ...styles?.dropDownBorder,
                  }}
                  dropDownContainer={styles.dropDownBorder}
                />
              </View>
              <TouchableOpacity
                onPress={() => onPressGo('goenable')}
                style={[
                  styles.goBtnStyles,
                  { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
                ]}>
                <Text style={styles.goBtnTxt}>
                  {strings('resume_Job_modal.go')}
                </Text>
              </TouchableOpacity>
            </View>

            {availableDateList.length > 0 ? (
              <View style={styles.marginTopStyles}>
                <Text
                  align={'flex-start'}
                  size={normalize(13)}
                  style={{
                    marginTop:
                      (availableDateList.length > 0 && hoursDesign == true) ||
                        (availableDateList.length > 0 && minDesign == true)
                        ? 100
                        : 0,
                  }}>
                  {strings('resume_Job_modal.available_hrs')}
                </Text>
                <ScrollView style={{ height: normalize(100) }}>
                  {availableDateList.map((item, index) => {
                    return (
                      <View key={`ID-${index}`}>
                        {renderItem({ item, index })}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ) : (
              <>
                {empMsg && (
                  <View
                    style={{
                      marginTop: normalize(10),
                      marginLeft: normalize(15),
                    }}>
                    <Text
                      align={'flex-start'}
                      style={{
                        marginTop:
                          hoursDesign == true || minDesign == true ? 100 : 0,
                      }}>
                      {strings('resume_Job_modal.not_available')}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
        {goEnable ? (
          <View>
            <MultiButton
              buttons={buttons}
              constinerStyles={styles.btnContainerStyles}
            />
          </View>
        ) : (
          <View>
            <MultiButton
              buttons={buttonCancel}
              constinerStyles={styles.btnContainerStyles}
            />
          </View>
        )}
        {showDatePicker ? (
          <DatePickerModal
            handleModalVisibility={toggleDatePicker}
            visibility={showDatePicker}
            resumeJobDateClear={'ResumeJobModal'}
            setDate={(val) => {
              setDate(val);
            }}
            selectedDate={date}
          />
        ) : null}
      </View>
    </ModalContainer>
  );
};

export default ResumeJobModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(25),
  },
  resumeJobTxt: {
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    marginBottom: normalize(7),
    alignSelf: 'flex-start',
  },
  marginTopStyles: {
    marginTop: normalize(25),
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: Platform.OS === 'ios' ? 9 : undefined,
  },
  dropDown: {
    flex: 0.5,
    marginRight: normalize(10),
  },
  goBtnStyles: {
    paddingHorizontal: normalize(19),
    paddingVertical: normalize(9),
    borderRadius: normalize(20),
  },
  goBtnTxt: {
    color: Colors.white,
    fontSize: textSizes.h11,
  },
  availableHrs: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    borderRadius: normalize(6),
  },
  btnContainerStyles: {
    width: '80%',
    alignSelf: 'center',
    marginTop: normalize(15),
  },
  dropDownBodyContainer: {
    maxHeight: normalize(90),
  },
  dropDownBorder: {
    borderColor: Colors?.borderGrey,
  },
  actionBtnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors.secondryBlack,
  },
  cancelBtnStyles: {
    backgroundColor: Colors?.silver,
  },
  calenderInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    borderRadius: normalize(8),
    marginTop: normalize(8),
    paddingRight: normalize(10),
  },
  dateTxtStyles: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(10),
    textAlign: 'left'
  },
});
