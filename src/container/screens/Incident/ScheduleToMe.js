import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { AddPartsCalenderIcon } from '../../../assets/img';
import { Colors } from '../../../assets/styles/colors/colors';
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
import DatePicker from '../../../components/DatePicker/index';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { Header } from '../../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import MultiButton from '../../../components/MultiButton';

const { width, height } = Dimensions.get('screen');

const ScheduleToMe = ({ handleModalVisibility, dataItem }) => {
  const todayDate = new Date();
  const currentDate = dateFormat(todayDate, 'YYYY-MM-DD');
  const [date, setDate] = useState(currentDate);
  const [add, setAdd] = useState(false);
  const [showDatePicker, setDatePicker] = useState(false);
  const [flag, setFlag] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);
  const dispatch = useDispatch();
  const [selectedAvailableDateIndex, setSelectedAvailableDateIndex] =
    useState(-1);
  const [timedata, setTimedata] = useState([]);
  const { colors } = useColors();
  const { height } = useDimensions();
  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
    setFlag(false);
  };
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const [addFlag, setAddFlag] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState({})
  const userInformation = useSelector((state) => state?.authReducer?.userInfo);
  const rdxData = useSelector((state) => state);

  // buttons array for schduletome modal
  const buttons = [
    {
      btnName: strings('Schedule.cancel'),
      onPress: () => handleModalVisibility(),
      btnTxtStyles: { ...styles?.actionBtnTxtStyles },
      btnStyles: { ...styles?.cancelBtnStyles },
    },
    {
      btnName: strings('Schedule.add'),
      onPress: () => {
        addFlag && jobInfo?.SubmittedSource != 2 ? onPressAddSchedule() : null
      },
      btnTxtStyles: { ...styles?.actionBtnTxtStyles, color: Colors?.white },
      btnStyles: {
        ...styles?.saveBtnStyles,
        backgroundColor: addFlag ? colors?.PRIMARY_BACKGROUND_COLOR : Colors?.darkGray,
      },
    },
  ];
  const buttonCancel = [
    {
      btnName: strings('Schedule.cancel'),
      onPress: () => handleModalVisibility(),
      btnTxtStyles: { ...styles?.actionBtnTxtStyles },
      btnStyles: { ...styles?.cancelBtnStyles },
    },
  ];
  const jobDetailsList = useSelector(
    (state) => state?.jobDetailReducers?.data?.WOJobDetails,
  );
  const priceDetailsList = useSelector(
    (state) => state?.jobDetailReducers?.GetPriceDetailsEntity
  );

  // api function for adding schdule in incident
  const onPressAddSchedule = () => {
    handleModalVisibility();
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        WoJobId: jobInfo?.WoJobId,
        CompanyId: userInformation?.CompanyId,
        WorkOrderId: jobInfo?.WorkOrderId,
        ApptPrefDate: jobInfo?.ApptPrefDate,
        ApptPrefSlotId: null,
        ApptPrefTime: jobInfo?.ApptPrefTime,
        LastChangedBy: jobDetailsList[0]?.LastChangedBy,
        LastUpdate: rdxData?.jobDetailReducers?.GetWOJobSignature?.LastUpdate,
        WoJobDetailsId: jobDetailsList[0]?.WoJobDetailsId,
        WorkTypeId: jobDetailsList[0]?.WorkTypeId,
        WorkTaskId: jobDetailsList[0]?.WorkTaskId,
        Days: jobInfo?.Days,
        Hours: jobInfo?.Hours,
        Minutes: jobInfo?.Minutes,
        TaskNo: 0,
        CreatedBy: jobInfo?.CreatedBy,
        CreatedDate: jobDetailsList[0]?.CreatedDate,
        WorkGroupId: 6,
        jobPricing: [
          {
            WoJobPriceId: priceDetailsList[0]?.WoJobPriceId,
            CompanyId: userInformation?.CompanyId,
            WoJobId: jobInfo?.WoJobId,
            WoJobDetailsId: jobDetailsList[0]?.WoJobDetailsId,
            WorkTypeId: jobDetailsList[0]?.WorkTypeId,
            WorkTaskId: jobDetailsList[0]?.WorkTaskId,
            PriceTypeId: priceDetailsList[0]?.PriceTypeId,
            Qty: priceDetailsList[0]?.Qty,
            UnitPrice: priceDetailsList[0]?.UnitPrice,
            Description: priceDetailsList[0]?.Description,
            DiscountTypeId: priceDetailsList[0]?.DiscountTypeId,
            Discount: priceDetailsList[0]?.Discount,
            TaskNo: priceDetailsList[0]?.TaskNo,
            CreatedBy: priceDetailsList[0]?.CreatedBy,
            CreatedDate: jobDetailsList[0]?.CreatedDate,
            LastChangedBy: jobDetailsList[0]?.LastChangedBy,
            LastUpdate:
              rdxData?.jobDetailReducers?.GetWOJobSignature?.LastUpdate,
            CreatedSourceId: 1,
            UpdatedSourceId: 2,
            TaxTypeId: priceDetailsList[0]?.TaxTypeId,
            TaxIdGroupId: priceDetailsList[0]?.TaxIdGroupId,
            Tax: priceDetailsList[0]?.Tax,
            TaxPercent: priceDetailsList[0]?.Percentage,
            TaxId: 0,
            ExistWoJobPriceId: null,
            Warranty: priceDetailsList[0]?.Warranty,
            PricingUnitId: priceDetailsList[0]?.PricingUnitId,
            DaysPerTask: priceDetailsList[0]?.DaysPerTask,
            HoursPerTask: priceDetailsList[0]?.HoursPerTask,
            MinutesPerTask: priceDetailsList[0]?.MinutesPerTask,
            isApprovalQueue: null,
            QOJobPriceId: null,
            QOJobDetailsId: null,
            MarkupPercentage: priceDetailsList[0]?.MarkupPercentage,
            MenuId: null,
          },
        ],
        VendorId: userInformation?.VendorId,
        CreatedSourceId: 1,
        UpdatedSourceId: 2,
        CustomerTypePriorityId: null,
        WorkTypePriorityId: null,
        IsCustPrefDateChanged: null,
        IsCreatedByClientPortal: null,
        CustomerId: 28,
        AppDetails: {
          piWoJobId: jobInfo?.WoJobId,
          piTechId: userInformation?.sub,
          piWorkDate: selectedSchedule?.AvailableDate,
          piStartTime: selectedSchedule?.StartTime,
          piEndTime: selectedSchedule?.EndTime,
          piTravelTime: selectedSchedule?.TravelTime,
          piDistance: selectedSchedule?.Distance,
          piComments: '',
          piIsConfirm: 1,
          piCompanyId: userInformation?.CompanyId,
          piLoginId: userInformation?.sub,
          piNextJobStartTime: selectedSchedule?.NextJobStartTime,
          piNextJobId: selectedSchedule?.NextJobId != null ? selectedSchedule?.NextJobId : 0,
          piNextJobTravelTime: selectedSchedule?.NextJobTravelTime,
          piNextJobDistance: selectedSchedule?.NextJobDistance,
          piVendorId: userInformation?.VendorId,
          scheduled: 1,
          piArrivalTime: selectedSchedule?.ArrivalTime,
          PiSourceId: 1,
          workStartDate: selectedSchedule?.StartTime,
          workEndDate: selectedSchedule?.EndTime,
        },
        WOPunchPointsId: 293,
        Qty: null,
        PricingUnitId: 0,
        ProjectId: null,
        CustomerTypeId: null,
      };

      const handleCallback = {
        success: (data) => {
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
          console.log(error);
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      api.addJobFromIncidents(data, handleCallback, header);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const renderComponent = ({ item, index }) => {
    let row = [];

    let startTime = convertFrom24To12Format(item?.StartTime)
    let endTime = convertFrom24To12Format(item?.EndTime)


    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedAvailableDateIndex(index),
            setAddFlag(true),
            setSelectedSchedule(item)
        }}
        style={[
          styles.availableHrs,
          {
            backgroundColor:
              index == selectedAvailableDateIndex
                ? Colors?.availableJobHrs
                : null,
            marginTop: normalize(5),
          },
        ]}>
        <Text align={'flex-start'} fontFamily={fontFamily?.semiBold}>{dateFormat(item?.AvailableDate, 'DD/MM/YYYY')}{' '}{startTime} to {endTime}</Text>
      </TouchableOpacity>
    );
  };

  // api function for schdules on go 
  const onPressGo = () => {
    try {
      const data = {
        JobDuration: parseInt(dataItem?.HoursPerTask * 60 + dataItem?.MinutesPerTask),
        companyid: parseInt(userInformation.CompanyId),
        WOjobId: parseInt(jobInfo.WoJobId),
        TechId: parseInt(userInformation.sub),
        loginid: parseInt(userInformation.sub),
        PreferDate: date,
        worktaskid: parseInt(dataItem?.WorkTaskId),
      };

      const handleCallback = {
        success: (data) => {
          setAdd(!add);
          setTimedata(data);
          setFlag(true);
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (err) => {
          console.log(err);
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      api.scheduleToMe(data, handleCallback, header);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  //ui for schdule to me modal screens
  return (
    <View style={[styles.container, { maxHeight: height / 1.4 }]}>
      <ScrollView style={{ flexGrow: 1 }} nestedScrollEnabled={true}>
        <Text style={styles.resumeJobTxt}>
          {strings('Schedule.schedule_to_me')}
        </Text>

        <View style={styles?.marginTopStyles}>
          <View style={styles.label}>
            <Text style={styles.star}>*</Text>
            <Text align={'flex-start'} size={normalize(13)}>
              {strings('Schedule.preffered_date')}
            </Text>
          </View>
          <View style={styles.dropDownContainer}>
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
            <TouchableOpacity
              onPress={() => onPressGo()}
              style={[
                styles.goBtnStyles,
                { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
              ]}>
              <Text style={styles.goBtnTxt}>{strings('Schedule.go')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles?.marginTopStyles}>
          {flag === false ? (
            <DatePicker getSelectedDate={setDate} type={'addParts'} />
          ) : null}

          {flag === true ? (
            <View>
              <Text
                align="flex-start"
                style={{ fontFamily: fontFamily.semiBold }}>
                {strings('Schedule.available_hrs')}
              </Text>

              {timedata.length > 0 ? (
                <FlatList
                  data={timedata}
                  renderItem={renderComponent}
                  keyExtractor={(item, index) => `${index}`}
                />
              ) : (
                <Text style={styles.unavailableslot}>
                  {strings('Schedule.No_time_slots_available')}
                </Text>
              )}
            </View>
          ) : null}
        </View>
        {add ? (
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
      </ScrollView>
    </View>
  );
};

export default ScheduleToMe;

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
    marginTop: normalize(10),
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: Platform.OS === 'ios' ? 9 : undefined,
  },
  dropDown: {
    flex: 0.5,
    marginRight: normalize(10),
  },
  goBtnStyles: {
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginTop: normalize(8),
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
  dropDownBodyContainer: {
    maxHeight: normalize(90),
  },
  dropDownBorder: {
    borderColor: Colors?.borderGrey,
  },
  calenderInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 150,
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
  },
  label: {
    flexDirection: 'row',
  },
  star: {
    color: '#FF0000',
    fontSize: Platform.OS === 'ios' ? normalize(13) : normalize(18),
    letterSpacing: 1,
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
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
  cancelBtnStyles: {
    backgroundColor: Colors?.silver,
  },
  actionBtnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors.secondryBlack,
  },
  unavailableslot: {
    marginTop: normalize(10)
  }
});
