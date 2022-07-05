import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  I18nManager,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/core';
import { Colors } from '../../../assets/styles/colors/colors.js';
import HeaderComponents from '../../../components/header/index.js';
import {
  dateFormat,
  fontFamily,
  normalize,
  textSizes,
} from '../../../lib/globals';
import {
  BlackMoreOptionIcon,
  UserGroup,
  LocationIcon2,
  CallIcon2,
  EventJobBagIcon,
  PlusIcon,
  DownArrow,
  JobStatusSuccessTick,
  RedNot,
} from '../../../assets/img/index.js';
import { Text } from '../../../components/Text/index.js';
import Button from '../../../components/Button/index.js';
import { useColors } from '../../../hooks/useColors.js';
import { strings } from '../../../lib/I18n/index.js';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types.js';
import api from '../../../lib/api/index.js';
import JobTaskCards from '../../../components/Cards/JobTaskCards.js';
import Loader from '../../../components/Loader/index.js';
import CommonModal from './contactDetailPopUp';
import PhoneNumberModal from './PhoneNumberModal.js';
import AddMoreModal from '../JobList/addMore.js';
import AcceptRejectContainer from './AcceptRejectContainer.js';
import { SatusLabel } from '../../../util/sideMenu';
import UnResolvedCompleteModal from './UnResolvedCompleteModal.js';
import JobActions from './JobActions.js';
import ResumeJobModal from './ResumeJobModal.js';
import { Header } from '../../../lib/buildHeader.js';
import { FlashMessageComponent } from '../../../components/FlashMessge/index.js';
import CustomFields from './customRemarkFields/CustomRemarkFields.js';
import Instructions from './Instructions/Instructions.js';
import PartsAttachmentDropdown from './PartsAttachmentDropdown.js';
import TechnicianRemarkModal from './TechnicianRemarkModal.js';
import { saveJobDetails } from '../../../redux/jobDetails/action';
import { minDropDown, totalHrs } from '../../../assets/jsonData/index.js';
import { queryAllRealmObject } from '../../../database/index.js';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import {
  commonStyles,
  convertKiloMetersToMeters,
  convertMilesToMeters,
  getCurrentLocation,
  getDistanceFromLatLong,
  isPointInRange,
} from '../../../util/helper';
import TabShape from '../../navigators/BottomTab/TabShape.js';
import EquipmentServiceReportModal from '../Equipments/EquipmentServiceReportModal.js';
import {
  serviceReportdisable,
  serviceReportVisibleAction,
} from '../../../redux/serviceReport/action.js';
import { getEmailPrintJobSetting } from '../../../redux/serviceReport/action';
import { DataNotFound } from '../../../components/DataNotFound/index.js';
import { useNetInfo } from '../../../hooks/useNetInfo.js';
import { getStatus } from '../../../lib/getStatus.js';
import {
  fetchCompleteReason,
  fetchCustomerDetails,
  fetchPartRequestList,
  fetchNotesOnline,
  fetchProjectDetails,
  fetchWoJobOnline,
  fetchTechnicianDetail,
} from '../../../lib/callBackApi.js';
import { accessPermission } from '../../../database/MobilePrevi/index.js';

const locList = [{ id: 0, label: 'Mobile offline', value: 'Mobile offline' }];

const JobDetail = ({ navigation }) => {
  const [permission, setPermission] = useState({});
  const [partPermission, setPartPermission] = useState({})
  const [expandStatus, setExpandStatus] = useState(false);
  const [showPhoneNoModal, setShowPhoneNoModal] = useState(false);
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [acceptToggle, setAcceptToggle] = useState('');
  const [unresolvedModal, setUnresolvedModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [expandView, setExpandView] = useState(false);
  const [showResumeJob, setResumeJob] = useState(false);
  const [hrs, setHrs] = useState(totalHrs(23, 'Hrs'));
  const [min, setMin] = useState(minDropDown(59, 'Mins'));
  const [getWojobSplInsDetails, setGetWojobSplInsDetails] = useState([]);
  const [getTechnicianRemarks, setGetTechnicianRemarks] = useState([]);
  const [getjobServiceNotesDetail, setjobServiceNotesDetail] = useState([]);
  const { colors } = useColors();
  const dispatch = useDispatch();
  const route = useRoute();
  const { jobId, isCrewMember, workorderid } = route?.params;
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [message, setMessage] = useState('');
  const [showTechRemark, setShowTechRemark] = useState(false);
  const [reasonList, setReasonList] = useState(reasonList);
  const [completedJobReasonList, setCompletedJobReasonList] = useState({});
  const [unresolvedReason, setUnresolvedReason] = useState([]);
  const [reasonId, setReasonId] = useState([]);
  const [actualHrs, setActualHr] = useState(null);
  const [actualMins, setActualMins] = useState(null);
  const [actualTravel, setActualTravel] = useState(0);
  const [technicianRemark, setTechnicianRemark] = useState('');
  const [getWOJobChecklist, setGetWOJobChecklist] = useState(null);
  const [otpModel, setOtpModel] = useState(false);
  const [otpTimer, setOtpTimer] = useState('3:49');
  const [violationRadius, setViolationRadius] = useState(null);
  const [isTimeTrvleInKM, setIsTimeTravelInKM] = useState(null);
  const [optEnabled, setOtpEnabled] = useState(null);
  const [locationViolationReason, setLocationViolationReason] = useState({});
  const checkIn = useSelector((state) => state.logReducer.ischeckIn);
  const [jobDetailsCustomeFileds, setJobDetailsCustomeFileds] = useState({});
  const [locationDiff, setLocationDiff] = useState(0);
  const [tech, setTech] = useState(false);
  const [orderID, setOrderID] = useState(workorderid)
  const [headerRight, setHeaderRight] = useState([]);
  const [priceDetailsNew, setPriceDetails] = useState([]);
  const [workOrderCustomerContactDetails, setWorkOrderCustomerContactDetails] =
    useState(null);
  const serviceReportVisible = useSelector(
    (state) => state?.ServiceReportReducer?.serviceReportVisible,
  );
  const Job_Details_Store = useSelector(
    (state) => state?.jobDetailReducers?.data,
  );

  const CompletedStatusReasons = useSelector(
    (state) => state?.jobDetailReducers?.data?.CompletedStatusReasons,
  );
  const customeFieldsPanel = useSelector(
    (state) => state?.jobDetailReducers?.data?.CustomFields,
  );
  const { isConnected } = useNetInfo();
  useEffect(() => {
    const data = customeFieldsPanel?.filter((ele) => ele.PanelId == 28);
    data?.length > 0 && setJobDetailsCustomeFileds(data[0]);
  }, [customeFieldsPanel]);

  const toggleServiceReprtModal = () => {
    dispatch(serviceReportVisibleAction(!serviceReportVisible));
    if (serviceReportVisible) {
      dispatch(serviceReportdisable());
    }
  };

  const toggleTechRemark = () => {
    setShowTechRemark(!showTechRemark);
  };

  const toggleCompleteModal = () => {
    setActualHr(getWorkOrderAppointment?.ActualWorkedHours);
    setActualMins(getWorkOrderAppointment?.ActualWorkedMinutes);
    setActualTravel(getWorkOrderAppointment?.ActualTravelDistance);
    setCompleted(!completed);
  };

  const toggleUnresolvedModal = () => {
    // if(technicianJobInformation?.JobStatus == 'On Site'){
    setActualHr(getWorkOrderAppointment?.ActualWorkedHours);
    setActualMins(getWorkOrderAppointment?.ActualWorkedMinutes);
    setActualTravel(getWorkOrderAppointment?.ActualTravelDistance);
    setUnresolvedModal(!unresolvedModal);
    // }
  };
  const handleJobTimeLine = () => {
    setShowMoreOpt(false);
    navigation.navigate('JobSummary', { data: technicianJobInformation });
  };

  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };

  const toggleShowResumeJob = () => {
    setResumeJob(!showResumeJob);
  };

  const toggalPhoneNoMaodal = () => {
    setShowPhoneNoModal(!showPhoneNoModal);
  };

  const headerRightIcons = [
    {
      name: LocationIcon2,
      onPress: () => {
        mapDirection();
      },
    },
    { name: CallIcon2, onPress: () => toggalPhoneNoMaodal() },
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];

  const headerRightCallIcons = [
    {
      name: LocationIcon2,
      onPress: () => {
        mapDirection();
      },
    },
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];

  useEffect(() => {
    if ((workOrderCustomerContactDetails?.Phone1 === null ||
      workOrderCustomerContactDetails?.Phone1 === '' ||
      workOrderCustomerContactDetails?.Phone1 === undefined) &&
      (workOrderCustomerContactDetails?.Phone2 === null ||
        workOrderCustomerContactDetails?.Phone2 === '' ||
        workOrderCustomerContactDetails?.Phone2 === undefined)) {
      if (isCrewMember != 'No') {
        let arr = headerRightCallIcons
        arr.unshift({
          name: UserGroup,
          onPress: () => {
            navigation.navigate('CrewMemberList', { JobId: jobId });
          },
        });
        setHeaderRight(arr);
      }
      else {
        setHeaderRight(headerRightCallIcons);
      }
    }
    else {
      if (isCrewMember != 'No') {
        let arr = headerRightIcons
        arr.unshift({
          name: UserGroup,
          onPress: () => {
            navigation.navigate('CrewMemberList', { JobId: jobId });
          },
        });
        setHeaderRight(arr);
      }
      else {
        setHeaderRight(headerRightIcons);
      }
    }
    // if (isCrewMember != 'No') {
    //   arr.unshift({
    //     name: UserGroup,
    //     onPress: () => {
    //       navigation.navigate('CrewMemberList', { JobId: jobId });
    //     },
    //   });
    // setHeaderRight(headerRightIcons);
    // } else {
    //   setHeaderRight(arr);
    // }
  }, [workOrderCustomerContactDetails]);

  const [geoLocationCategory, setGelocationCategory] = useState([]);
  const [distanceAllowed, setDistanceAllowed] = useState(0);

  useEffect(() => {
    let data = [];
    if (completedJobReasonList.length > 0) {
      const compjobListFromApi = completedJobReasonList.map((ele) => {
        if (ele.id == CompletedStatusReasons?.Reasons[0]?.StatusReasonId) {
          data.push(ele);
        }
      });
    }
    // setUnresolvedReason(data);

  }, [completedJobReasonList]);

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const geoList = res?.GeoFensingCategoryList.map((ele) => {
          let newData = {
            WoCategory: ele?.WoCategory,
            WoCategoryId: ele?.WoCategoryId,
            IsActive: ele?.IsActive,
            ...ele,
          };
          return newData;
        });
        setGelocationCategory(geoList);
        let distanceinMiles = res?.SystemSettings?.filter(
          (item, index) => item?.SettingId == 99,
        );
        setDistanceAllowed(distanceinMiles[0]?.SettingValue);
        const result = res?.UnResolvedCompletedReasons.map((obj) => {
          let data = {
            id: obj?.StatusReasonId,
            label: obj?.StatusReason,
            value: obj?.StatusReason,
            JobStatusId: obj?.JobStatusId,
            ...obj,
          };
          return data;
        });
        if (result != undefined && result.length > 0) {
          const sortedReason = result.filter((ele) => ele.JobStatusId === 6);
          setReasonList(sortedReason);
          const completeReason = result.filter((ele) => ele.JobStatusId === 5);
          setCompletedJobReasonList(completeReason);
        }

        const requiredLocationViolationRadius = res?.SystemSettings?.filter(
          (item, index) => item?.SettingId == 72,
        );
        setViolationRadius(requiredLocationViolationRadius[0]?.SettingValue);

        const isKM = res?.SystemSettings?.filter(
          (item, index) => item?.SettingId == 71,
        );

        if (isKM[0]?.SettingValue == 0) {
          setIsTimeTravelInKM(false);
        } else {
          setIsTimeTravelInKM(true);
        }

        setLeaveType(leaveType.reverse());
      })

      .catch((error) => { });
  };
  const mapDirection = () => {
    try {
      const url = Platform.select({
        ios: `maps:0,0?q=${technicianJobInformation?.AcctualAddress}`,
        android: `geo:0,0?q=${technicianJobInformation?.AcctualAddress}`,
      });
      Linking.openURL(url);
      // Linking.openURL(
      //   Platform.OS === 'ios'
      //     ? 'maps://app?saddr=38.8976763+-77.0387185&daddr=38.9076763+-78.0387185'
      //     : 'google.navigation:q=19.0760+72.8777',
      // );
    } catch (e) {

    }
  };

  const [technicianJobInformation, setTechnicianJobInformation] =
    useState(null);
  const [customertimeZone, setCustomertimeZone] = useState(null);
  const [woJobDetails, setWOJobDetails] = useState(null);
  const [getWorkOrderAppointment, setGetWorkOrderAppointment] = useState(null);
  const [getProjectDetails, setGetProjectDetails] = useState(null);
  const [requestPartList, setRequestPartList] = useState([]);
  const [contactDetailPopUp, setContactDetailPopUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [JobDetailsNew,setJobDetailsNew] = useState([]);

  const toggleContactDetailPopUp = () => {
    setContactDetailPopUp(!contactDetailPopUp);
  };

  const toggleStatus = () => {
    setExpandStatus(!expandStatus);
  };

  const fetchJobDetails = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        TechId: userInfo?.sub,
        WojobId: jobId,
        CompanyId: userInfo?.CompanyId,
        customFieldentity: '3,16',
      };
      const handleCallback = {
        success: (jobDetails) => {
          dispatch({ type: SET_LOADER_FALSE });
          setOrderID(jobDetails[0]?.GetWorkOrderAppointment?.WorkOrderId)
          dispatch(saveJobDetails(jobDetails[0]));
          dispatch({ type: SET_LOADER_FALSE });
          setTechnicianJobInformation(jobDetails[0]?.TechnicianJobInformation);
          setCustomertimeZone(jobDetails[0]?.CustomertimeZone);
          setGetProjectDetails(jobDetails[0]?.GetProjectDetails);
          setWorkOrderCustomerContactDetails(
            jobDetails[0]?.WorkOrderCustomerContactDetails,
          );
          setGetWOJobChecklist(jobDetails[0]?.GetWOJobChecklist);
          setWOJobDetails(jobDetails[0]?.WOJobDetails);
          setGetWorkOrderAppointment(jobDetails[0]?.GetWorkOrderAppointment);
          setMessage('No Data Available');
          setjobServiceNotesDetail(jobDetails[0]?.GetWojobServiceNotesDetails);
          setGetTechnicianRemarks(jobDetails[0]?.GetTechnicianRemarks);
          setOtpEnabled(jobDetails[0]?.OTPEnable);
          setJobDetailsNew(jobDetails);
        },
        error: (error) => {
          setMessage('No Data Available');
          dispatch({ type: SET_LOADER_FALSE });
          // setLoading(false);
        },
      };
      api.jobDetails(data, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {
      setMessage('No Data Available');
      dispatch({ type: SET_LOADER_FALSE });
      // setLoading(false);
    }
  };

  const [optReasons, setOtpReasons] = useState(locList);
  const [selectedOtpReason, setSelectedOtpReason] = useState({});
  const getOtpReasons = () => {
    try {
      const endPoint = `?CompanyId=${userInfo?.CompanyId}`;
      const header = Header(token);
      const handleCallback = {
        success: (otpReasonRes) => {
          const reqFormatReason = otpReasonRes?.map((item, index) => {
            return {
              id: item?.OTPReasonId,
              label: item?.OTPReason,
              value: item?.OTPReason,
            };
          });
          setOtpReasons(reqFormatReason);
        },
        error: (otpReasonError) => {
          console.log({ otpReasonError });
        },
      };
      api.getOtpReason('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    otpModel ? getOtpReasons() : null;
  }, [otpModel]);

  useFocusEffect(
    React.useCallback(() => {
      fetchJobDetails();
      fetchPriceDetails();
    }, [jobId]),
  );
  useEffect(()=>{
    fetchNotesCallback(2);
  },[getWorkOrderAppointment])

  const fetchNotesCallback = (id) => {
    const cb = (data) => {
      id == 0
        ? setjobServiceNotesDetail(data)
        : id == 1
          ? setGetTechnicianRemarks(data)
          : setGetWojobSplInsDetails(data);
    };

    let endPoint = `${userInfo?.CompanyId}/${userInfo?.sub}/28/${getWorkOrderAppointment?.WorkOrderId}/${jobId}/${id}`;
    // ='416/28/1604475076/19158567/1';
    fetchNotesOnline('', token, endPoint, cb);
  };

  const onPresDeleteTask = (value) => {
    const handleCallback = {
      success: (data) => {
        dispatch({ type: SET_LOADER_FALSE });
        const msgCode = data?.Message?.MessageCode;

        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        setTimeout(() => {
          fetchJobDetails();
        }, 1500);
      },
      error: (error) => {
        dispatch({ type: SET_LOADER_FALSE });
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : 'something went wrong',
        );
      },
    };
    dispatch({ type: SET_LOADER_TRUE });
    let headers = Header(token);
    let endPoint = `?woJobId=${value?.WoJobId}&WoJobDetailsId=${value?.WoJobDetailsId}&CompanyId=${userInfo?.CompanyId}&LastChangedBy=${userInfo?.sub}`;
    api.deleteTask('', handleCallback, headers, endPoint);
  };

  const jobDetails = useSelector((state) => state?.jobDetailReducers?.data);
  const techId = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation?.TechId,
  );
  useEffect(() => {
    statusReasonCallback()
    // technicianDetailCallback()
    // projectCallback();
    // woJobOnlineCallback();
  }, []);

  const woJobOnlineCallback = () => {
    const cb = (data) => {
      dispatch(saveJobDetails({ ...jobDetails, WOJobDetail: data }));
    };
    const apiPayload = {
      CompanyId: userInfo?.CompanyId,
      JobId: [jobId],
    };
    fetchWoJobOnline(apiPayload, token, cb);
  };

  const technicianDetailCallback = () => {
    const cb = (data) => {

      dispatch(saveJobDetails({ ...jobDetails, TechnicianJobInformation: data }));
    };
    const apiPayload = {
      TechId: userInfo?.sub,
      CompanyId: userInfo?.CompanyId,
      WoJobId: jobId,
    };
    fetchTechnicianDetail(apiPayload, token, cb);
  };


  const projectCallback = () => {
    const cb = (data) => {

      dispatch(saveJobDetails({ ...jobDetails, GetProjectDetails: data }));
      // setGetProjectDetails(data)
    };
    let endPoint = `${userInfo?.CompanyId}/${technicianJobInformation?.WorkOrderId}`;
    fetchProjectDetails('', token, endPoint, cb);
  };

  const customerDetailCallback = () => {
    const cb = (data) => {
      dispatch(saveJobDetails({ ...jobDetails, WorkOrderCustomerContactDetails: data }));
    };
    let endPoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobId}`;
    fetchCustomerDetails('', token, endPoint, cb);
  };

  const statusReasonCallback = () => {
    const cb = (data) => {
      dispatch(saveJobDetails({ ...jobDetails, CompletedStatusReasons: data }));
      setUnresolvedReason(data?.Reasons)
    };
    let endPoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobId}`;
    fetchCompleteReason('', token, endPoint, cb);
  };

  const handleOtpOnSave = () => {
    // setOtpModel(false);
    // setExpandView(false);
    try {
      if (
        (firstInput.length == 1 &&
          secondInput.length == 1 &&
          thirdInput.length == 1 &&
          fourthInput.length == 1
        ) || selectedOtpReason != '') {
        const data = {
          WoAppointmentOTPId: 0,
          WoAppointmentId: getWorkOrderAppointment?.WoAppointmentId,
          Name: 'Raja1',
          Relationship: 'Test',
          MobileNumber: '9962177684',
          OTP: `${firstInput}${secondInput}${thirdInput}${fourthInput}`,
          OTPNotRequired: 1,
          OTPReasonId: selectedOtpReason?.id,
          IsActive: 1,
          WoJobId: technicianJobInformation?.WoJobId,
          CompanyId: userInfo?.CompanyId,
          isMobile: 1,
          TechId: userInfo?.sub,
          LastChangedBy: userInfo?.sub,
        };
        const handleCallback = {
          success: (insertOtpRes) => {
            setOtpModel(false);
            setExpandView(false);

            // fetchJobDetails();
            if (insertOtpRes?.Message?.MessageCode) {
              const msgCode = insertOtpRes?.Message?.MessageCode;
              if (msgCode.length > 5) {
                FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
              } else if (msgCode.charAt(0) === '1') {
                  toggleCompleteModal();
                // FlashMessageComponent(
                //   'success',
                //   strings(`Response_code.${msgCode}`),
                // );
              } else {
                FlashMessageComponent(
                  'warning',
                  strings(`Response_code.${msgCode}`),
                );
              }
            }
          },
          error: (insertOtpError) => console.log({ insertOtpError }),
        };
        const headers = Header(token);
        api.insertOTP(data, handleCallback, headers);
      } else {
        FlashMessageComponent('reject', strings('Location_Violation.Please_Enter_OTP'));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const [userCurrentLocation, setUserCurrentLocation] = useState({});

  const getUserCurrentLocation = async () => {
    try {
      const userCoordinates = await getCurrentLocation();
      const userLocationObject = {
        latitude: userCoordinates[1],
        longitude: userCoordinates[0],
      };
      setUserCurrentLocation(userLocationObject);
    } catch (error) { }
  };

  useEffect(() => {
    getUserCurrentLocation();
    getEmailJobSetting();
  }, []);

  const getEmailJobSetting = () => {
    try {
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('warning', msgCode);
            } else if (msgCode.charAt(0) === '1') {
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
          dispatch(getEmailPrintJobSetting(data));
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
        },
      };
      let endpoint = `${userInfo?.CompanyId}`;
      api.getEmailPrintJobSetting(
        '',
        handleCallback,
        {
          Authorization: `Bearer ${token}`,
        },
        endpoint,
      );
    } catch (er) {
      console.log({er});
    }
  };

  const [onlocationViolationSave, setOnLocationViolationSave] = useState({});

  const isLocationViolation = async () => {
    try {
      getUserCurrentLocation();
      const jobLocation = {
        latitude: technicianJobInformation?.ZipLat,
        longitude: technicianJobInformation?.ZipLon,
      };
      let radius;

      if (isTimeTrvleInKM) {
        radius = convertKiloMetersToMeters(violationRadius);
      } else {
        radius = convertMilesToMeters(violationRadius);
      }

      const isPointInRadius = await isPointInRange(
        jobLocation,
        userCurrentLocation,
        radius,
      );
      if (isPointInRadius) {
        return false;
      } else {
        return true;
      }
    } catch (error) { }
  };

  const [locationViolation, setLocationViolation] = useState(false);

  const handleEnRouteToOnSite = (changeTo) => {
    try {
      if (!isLocationViolation()) {
        updateToEnRouteAndOnSite(changeTo);
      } else {
        setLocationViolation(true);
        setOnLocationViolationSave({
          onSave: () => updateToEnRouteAndOnSite(changeTo),
        });
      }
    } catch (error) { }
  };

  const updateToEnRouteAndOnSite = (changeTo) => {
    try {
      const data = [
        {
          WorkOrderId: technicianJobInformation?.WorkOrderId,
          jobid: technicianJobInformation?.WoJobId,
          WoAppointmentId: getWorkOrderAppointment?.WoAppointmentId,
          jobstatus: changeTo,
          companyid: userInfo?.CompanyId,
          TechTimeZoneId: technicianJobInformation?.TechTimeZoneId,
          StartTime:
            getWorkOrderAppointment?.StartTime != ''
              ? dateFormat(
                getWorkOrderAppointment?.StartTime,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
          ArrivalTime:
            getWorkOrderAppointment?.ArrivalTime != ''
              ? dateFormat(
                getWorkOrderAppointment?.ArrivalTime,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
          LastChangedBy: userInfo?.sub,
          ismobile: 1,
          TechnicianId: userInfo?.sub,
          PreviousJobStatus: technicianJobInformation?.JobStatusid,
          UpdatedSourceId: woJobDetails[0]?.UpdatedSourceId,
          ActualTravelDistance: actualTravel,
          GeoFenceOnsiteLat: '',
          GeoFenceOnsiteLon: '',
          GeoFenceCompleteLat: '',
          GeoFenceCompleteLon: '',
        },
      ];
      if(changeTo == 4){
        data[0].GeoFenceOnsiteLat = userCurrentLocation.latitude;
        data[0].GeoFenceOnsiteLon = userCurrentLocation.longitude;
      }
      const handleCallback = {
        success: (enRouteOnSite) => {
          const msgCode = enRouteOnSite?.Data[0]?.Code;
          if (msgCode.length > 5) {
            FlashMessageComponent(
              'warning',
              strings(`Response_code.${msgCode}`),
            );
          } else {
            FlashMessageComponent(
              'success',
              strings(`Response_code.${msgCode}`),
            );
          }
          setTimeout(() => {
            fetchJobDetails();
          }, 1200);
        },
        error: (enRouteonSiteError) => console.log({ enRouteonSiteError }),
      };
      let headers = Header(token);
      api.updateStatus(data, handleCallback, headers);
    } catch (error) { }
  };

  const handleUnResolvedUpdateStatus = (id) => {
    if (reasonId && reasonId.length > 0) {
      handleUnResolvedUpdateStatusApi(id);
    } else {
      id == 5 ? toggleCompleteModal() : toggleUnresolvedModal();
       FlashMessageComponent('warning', strings('flashmessage.Please_select_a_reason'));
    }
  };
  const handleUnResolvedUpdateStatusApi = (id) => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = [
        {
          WorkOrderId: getWorkOrderAppointment?.WorkOrderId,
          jobid: getWorkOrderAppointment?.WoJobId,
          WoAppointmentId: getWorkOrderAppointment?.WoAppointmentId,
          jobstatus: id,
          unresolvedreasonid: null,
          companyid: getWorkOrderAppointment?.CompanyId,
          StartTime:
            getWorkOrderAppointment?.StartTime != ''
              ? dateFormat(
                getWorkOrderAppointment?.StartTime,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
          ArrivalTime:
            getWorkOrderAppointment?.ArrivalTime != ''
              ? dateFormat(
                getWorkOrderAppointment?.ArrivalTime,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
          ServiceStartTime:
            getWorkOrderAppointment?.ServiceStartTime != ''
              ? dateFormat(
                getWorkOrderAppointment?.ServiceStartTime,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
          ServiceEndTime:
            getWorkOrderAppointment?.ServiceEndTime != ''
              ? dateFormat(
                getWorkOrderAppointment?.ServiceEndTime,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : '02/25/2022 1:16 AM',
          ActualWorkedHours: actualHrs?.id ? actualHrs?.id : actualHrs,
          ActualWorkedMinutes: actualMins?.id ? actualMins?.id : actualMins,
          LastChangedBy: parseInt(userInfo?.sub),
          lastupdate:
            id == 5 ? woJobDetails[0]?.LastUpdate : '0001-01-01T00:00:00',
          ismobile: 0,
          LoginId: parseInt(userInfo?.sub),
          TechTimeZoneId: technicianJobInformation?.TechTimeZoneId,
          TechnicianId: getWorkOrderAppointment?.TechId,
          ScheduleStartDate:
            getWorkOrderAppointment?.ScheduleStartDate != ''
              ? dateFormat(
                getWorkOrderAppointment?.ScheduleStartDate,
                'MM/DD/YYYY HH:MM:MS 12TF',
              )
              : dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
          PreviousJobStatus: technicianJobInformation?.JobStatusid,
          CreatedSourceId: woJobDetails[0]?.CreatedSourceId,
          UpdatedSourceId: 2,
          ActualTravelDistance: actualTravel,
          GeoFenceOnsiteLat: null,
          GeoFenceOnsiteLon: null,
          GeoFenceCompleteLat: userCurrentLocation.latitude,
          GeoFenceCompleteLon: userCurrentLocation.longitude,
          TravelCostPerKMMile: 10,
          GFOnsiteStatusReasonId:
            getWorkOrderAppointment?.GFOnsiteStatusReasonId,
          GFCompletedStatusReasonId:
            getWorkOrderAppointment?.GFCompletedStatusReasonId,
          StatusReasonId: reasonId,
          isGenerateOTP: null,
          isSingleWorkRequest:
            technicianJobInformation?.WorkRequestCount > 0 ? false : true,
          Days: technicianJobInformation?.Days,
          Hours: technicianJobInformation?.Hours,
          Minutes: technicianJobInformation?.Minutes,
        },
      ];
      const handleCallback = {
        success: (unresolvedStatus) => {
          dispatch({ type: SET_LOADER_FALSE });
          if (unresolvedStatus?.Data[0]?.Code) {
            const msgCode = unresolvedStatus?.Data[0]?.Code;
            if (msgCode.length > 5) {
              dispatch({ type: SET_LOADER_FALSE });
              setTimeout(() => {
                FlashMessageComponent(
                  'warning',
                  strings(`Response_code.${msgCode}`),
                );
              }, 2500);
            
            } else if (msgCode.toString().charAt(0) === '1') {
              if (technicianRemark) {
                setTech(true);
                technicalRemarkApiCall();
              }
              dispatch({ type: SET_LOADER_FALSE });
              setTimeout(() => {
                FlashMessageComponent(
                  'success',
                  strings(`Response_code.${msgCode}`),
                );
              }, 2500);
            } else {
              if (technicianRemark) {
                setTech(false);
                technicalRemarkApiCall();
              } else {
                dispatch({ type: SET_LOADER_FALSE });
                setTimeout(() => {
                  FlashMessageComponent(
                    'warning',
                    strings(`Response_code.${msgCode}`),
                  );
                }, 2500);
              
              }
            }
            dispatch({ type: SET_LOADER_FALSE });
            setTimeout(() => {
              fetchJobDetails();
              // statusReasonCallback();
              setCompleted(false);
            }, 100);
          }
        },
        error: (unresolvedError) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      let headers = Header(token);
      api.updateStatus(data, handleCallback, headers);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
      console.log({error});
    }
  };

  const technicalRemarkApiCall = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const apiPayload = {
        NotesID: 0,
        NotesMasterId: 42,
        PrimaryKeyId: jobId,
        CompanyId: userInfo.CompanyId,
        Note: technicianRemark,
        CreatedBy: userInfo.sub,
        CreatedDate: dateFormat(new Date(), 'MM/DD/YYYY'),
        LastChangedBy: null,
        LastUpdate: null,
        Name: null,
        CreatedByName: null,
        LastChangedByName: null,
        SouceTypeId: 1,
        CreatedSourceId: 1,
        CreatedDatesmobile: null,
        LastUpdatesmobile: null,
        WoId: null,
        UpdatedSourceId: 2,
        CreatedSourceLoginId: null,
        UpdatedSourceLoginId: null,
        VisibleToVendor: null,
      };
      const handleCB = {
        success: (data) => {
          dispatch({ type: SET_LOADER_FALSE });

          if (tech == 'false') {
            const msgCode = data?.Message?.MessageCode;
            FlashMessageComponent(
              'success',
              strings(`Response_code.${msgCode}`),
            );
          }
          fetchNotesCallback(1);
        },
        error: (technicianRemarkError) => console.log({ technicianRemarkError }),
      };
      let headers = Header(token);
      // api.insertTechNotes(apiPayload, headers, handleCB);

      // dispatch(insertNotesApiCallAction(apiPayload, token, handleCB,isConnected));
      api.insetNotes(apiPayload, handleCB, headers);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const [attachmentData, setAttachmentData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      GetAttachments();
      getCustomFieldsCallBack()


    }, [technicianJobInformation, getWorkOrderAppointment]),
  );

  useFocusEffect(
    React.useCallback(() => {
      getPartListCallBack()
    }, [orderID]),
  );






  const GetAttachments = () => {
    try {
      const data = {
        JobId: [jobId],
        CompanyId: userInfo?.CompanyId,
        LastSyncDate: '',
      };
      const handleCallback = {
        success: (attachmentRes) => {
          setAttachmentData(attachmentRes);
        },
        error: (attachmentErr) => console.log({ attachmentErr }),
      };

      let endpoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobId}`;
      let headers = Header(token);
      api.getAttachments(data, handleCallback, headers);
      // api?.GetAllAttachmentOnline('', handleCallback, headers, endpoint);
    } catch (error) { }
  };

  const fetchJobCkecklistCallBack = () => {
    try {
      const handleCallback = {
        success: (res) => {
          setGetWOJobChecklist(res);
          // dispatch(saveJobDetails(...Job_Details_Store,GetWOJobChecklist=res));
        },
        error: (attachmentErr) => console.log({ attachmentErr }),
      };

      let endpoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobId}`;
      let headers = Header(token);
      api?.GetJobChecklistMobileOnline('', handleCallback, headers, endpoint);
    } catch (error) { }
  };



  // const jobPartList = useSelector(
  //   (state) => state?.jobDetailReducers?.data?.GetPartRequestList,
  // );

  // useEffect(() => {
  //   technicianJobInformation?.WorkOrderId
  //     ? //  getPartRequestList()
  //     setRequestPartList(jobPartList)
  //     : null;
  // }, [technicianJobInformation]);

  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [thirdInput, setThirdInput] = useState('');
  const [fourthInput, setFourthInput] = useState('');

  const handleCompleteStatus = () => {
    if (!isLocationViolation()) {
      optEnabled ? setOtpModel(true) : toggleCompleteModal();
    } else {
      // handleNavigation();
      setLocationViolation(true);
      setOnLocationViolationSave({
        onSave: () => {
          optEnabled ? setOtpModel(true) : toggleCompleteModal();
        },
      });
    }
  };

  const handleSubmittedOnPress = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        CompanyId: getWorkOrderAppointment?.CompanyId,
        WoJobId: jobId,
        WoAppointMentId: getWorkOrderAppointment?.WoAppointmentId,
        UserId: userInfo?.sub,
        SubmittedDate: dateFormat(new Date(), 'MM/DD/YYYY'),
        SubmittedSource: 2,
        VendorId: technicianJobInformation?.VendorId,
        TechId: getWorkOrderAppointment?.TechId,
        CreatedBy: getWorkOrderAppointment?.CreatedBy,
        WorkOrderId: technicianJobInformation?.WorkOrderId,
        IsInhouse: null,
      };
      const handleCallback = {
        success: (submitJobRes) => {
          dispatch({ type: SET_LOADER_FALSE });
          const msgCode = submitJobRes.Message.MessageCode;
          if (msgCode.length > 5) {
            FlashMessageComponent(
              'reject',
              strings(`Response_code.${msgCode}`),
            );
          } else if (msgCode.charAt(0) === '1') {
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
          setTimeout(() => {
            fetchJobDetails();
          }, 1200);
        },
        error: (submitJobError) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      api.submitJob(data, handleCallback, header);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const onResendOTP = () => {
    try {
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&LoginId=${userInfo?.sub}&WorkOrderId=${technicianJobInformation?.WorkOrderId}&WoJobId=${technicianJobInformation?.WoJobId}&WoAppointmentId=${getWorkOrderAppointment?.WoAppointmentId}&JobStatusId=5&MobileNo=992177684&TechId=${technicianJobInformation?.TechId}&isMobile=1`;
      const header = Header(token);
      const handleCallback = {
        success: (resendOTPRes) => { },
        error: (resendOTPErr) => {
          console.log({ resendOTPErr });
        },
      };
      api.resendOTP('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  const getOtpDetails = () => {
    try {
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WoAppointmentId=${getWorkOrderAppointment?.WoAppointmentId}`;
      const header = Header(token);
      const handleCallback = {
        success: (otpDetailRes) => {
          console.log({ otpDetailRes });
        },
        error: (otpDetailErr) => {
          console.log({ otpDetailErr });
        },
      };
      api.getOTPDetails('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };
  const fetchPriceDetails = () => {
    try {
      const handleCallback = {
        success: (res) => {
          setPriceDetails(res)
        },
        error: (Err) => {
         },
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&woJobId=${jobId}`;
      const header = Header(token);
      api.GetPriceDetailsEnityOnline('', handleCallback, header, endPoint);
    } catch (error) {
    }
  };
  const handleNavigation = () => {
    var distance = '0';
    getDistanceFromLatLong(
      userCurrentLocation.latitude,
      userCurrentLocation.longitude,
      location.latitude,
      location.longitude,
    ).then((res) => {
      setLocationDiff(res?.milesDistance);
      distance = res.milesDistance;
    });
    let isCategoryAllowed = geoLocationCategory.filter(
      (ele) => ele.WoCategoryId == technicianJobInformation.WoCategoryId,
    );
    if (
      isCategoryAllowed.length != 0 &&
      parseInt(distance) > parseInt(distanceAllowed)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleLocationCheck = (screenName = '', data = {}) => {
    if (handleNavigation()) {
      setLocationViolation(true);
      setOnLocationViolationSave({
        onSave: () => {
          screenName != ''
            ? navigation.navigate('MainForm', {
              screenName,
              data,
              preview: false,
              flag: 1,
            })
            : navigation.navigate('AddCheckList');
        },
      });
    } else {
      screenName != ''
        ? navigation.navigate('MainForm', {
          screenName,
          data,
          preview: false,
          flag: 1,
        })
        : navigation.navigate('AddCheckList');
    }
  };
  useEffect(() => {
    getOtpDetails();
  }, [getWorkOrderAppointment]);

  const [mobileOptTypeID, setMobileOtpTypeID] = useState(null);

  const getMobileOTPTypeID = () => {
    try {
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WorkOrderId=${technicianJobInformation?.WorkOrderId}`;
      const handleCallback = {
        success: (mobileOtpTypeIdRes) => {
          setMobileOtpTypeID(mobileOtpTypeIdRes);
        },
        error: (mobileOtpTypeIdErr) => {
          console.log({ mobileOtpTypeIdErr });
        },
      };
      const header = Header(token);
      api.getMobileOTPTypeID('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getMobileOTPTypeID();
  }, [technicianJobInformation]);

  useEffect(() => {
    accessPermission('Job Details').then((res) => {
      setPermission(res)
    })
  }, []);

  useEffect(() => {
    accessPermission('Parts').then((res) => {
      setPartPermission(res)
    })
  }, []);

  const location = {
    latitude: technicianJobInformation?.ZipLat,
    longitude: technicianJobInformation?.ZipLon,
  };
  const editable = getStatus('forms', technicianJobInformation?.JobStatus);
  const validateOtp = () => {
    try {
      const otp = `${firstInput}${secondInput}${thirdInput}${fourthInput}`;
      const endPoint = `${userInfo?.CompanyId}/${getWorkOrderAppointment?.WoAppointmentId}/${otp}`;
      const handleCallback = {
        success: (otpValidRes) => { },
        error: (otpValidErr) => {
          console.log({ otpValidErr });
        },
      };
      const header = Header(token);
      api.otpValidation('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  const JobStatusFields = () => {
    try {
      const index = SatusLabel.findIndex(
        (e) => e.label === technicianJobInformation.JobStatus,
      );
      const sortedData = SatusLabel.filter((ele, id) => {
        if (id > index && id <= parseInt(index) + 1) {
          return ele;
        }
      });
      return sortedData.map((ele, index) => {
        return (
          <View key={`ID-${index}`}>
            {technicianJobInformation?.JobStatus == 'Unresolved' ? (
              <View style={styles.viewCompleteDetails}>
                <RedNot height={normalize(14)} width={normalize(14)} />
                <TouchableOpacity onPress={() => toggleUnresolvedModal()}>
                  <Text
                    style={[
                      {
                        color: colors?.PRIMARY_BACKGROUND_COLOR,
                      },
                      styles.completedDetails,
                    ]}>
                    {strings('job_detail.view_unresolved_details')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={technicianJobInformation?.SubmittedSource != null}
                  onPress={() => {
                    handleNavigation(),
                      ele.label == 'Completed'
                        ? handleCompleteStatus()
                        : ele?.label == 'En Route'
                          ? updateToEnRouteAndOnSite(3)
                          : ele?.label == 'On Site'
                            ? handleEnRouteToOnSite(4)
                            : ele?.label == 'Submitted'
                              ? handleSubmittedOnPress()
                              : undefined;
                  }}
                  style={[
                    styles.crrStatusContainer,
                    { marginTop: normalize(20) },
                  ]}>
                  <Text
                    align={'flex-start'}
                    size={normalize(18)}
                    fontFamily={fontFamily?.bold}
                    color={
                      ele?.label == 'Submitted'
                        ? Colors?.submittedJobColor
                        : ele?.color
                    }>
                    {ele?.label == 'Submitted'
                      ? technicianJobInformation?.SubmittedSource != null
                        ? ele.label
                        : strings('status_update.submit')
                      : ele?.label}
                  </Text>
                </TouchableOpacity>
                {technicianJobInformation?.JobStatus == 'Completed' ? (
                  <View style={styles.viewCompleteDetails}>
                    <JobStatusSuccessTick
                      height={normalize(11)}
                      width={normalize(14)}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        toggleCompleteModal();
                      }}>
                      <Text
                        style={[
                          {
                            color: colors?.PRIMARY_BACKGROUND_COLOR,
                          },
                          styles.completedDetails,
                        ]}>
                        {strings('job_detail.view_completed_details')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={toggleUnresolvedModal}
                    style={[
                      styles.crrStatusContainer,
                      { marginTop: normalize(10) },
                    ]}>
                    <Text
                      align={'flex-start'}
                      size={normalize(18)}
                      fontFamily={fontFamily?.bold}
                      color={'#F49025'}>
                      {strings('status_update.unresolved')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        );
      });
    } catch (error) { }
  };

  const getPartListCallBack = () => {
    const cb = (data) => {
      data != '' && setRequestPartList(data?.PartLists);

    };
    let endPoint = `?CompanyId=${userInfo?.CompanyId}&WorkorderId=${orderID}&woJobId=${jobId}`;

    fetchPartRequestList('', token, endPoint, cb);
  };

  const getCustomFieldsCallBack = () => {
   
    let endPoint = `?CompanyId=${userInfo?.CompanyId}&woJobId=${jobId}`;
    // fetchCustomFeildsOnline('', token, endPoint, cb);

    const cb = {
      success: (data) => {
        let res = { ...Job_Details_Store, CustomFields: data?.CustomFields }
        // dispatch(saveJobDetails(res));
      },
      error: (error) => {
        console.log({ error });
      },
    };
    let headers = Header(token);
    api?.GetCustomFeildsMobileOnline('', cb, headers, endPoint);
  };

  const jobDetailsDateTime = dateFormat(
    technicianJobInformation?.ScheduleStartDateTime,
    'DD/MM/YYYY HH:MM 12TF',
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={commonStyles}>
        <HeaderComponents
          title={`${strings('common.job')} ${jobId}`}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
          HeaderRightIcon={headerRight}
        />
        {locationViolation ? (
          <JobActions
            type={'location_violation'}
            setExpandView={setExpandView}
            expandView={expandView}
            onSave={() => {
              setLocationViolation(false);
              setExpandView(false);
              onlocationViolationSave?.onSave();
            }}
            distance={locationDiff ? locationDiff : violationRadius}
            units={isTimeTrvleInKM ? `Km's` : 'Miles'}
            reasonList={locList}
            handleReasonSelection={setLocationViolationReason}
            selectedReason={locationViolationReason}
            onCancle={() => {
              setLocationViolation(false);
              setExpandView(false);
            }}
          />
        ) : null}

       {isConnected=='false' ? 
        <>
        {!otpModel ? (
          <JobActions
            type={'enter_otp'}
            setExpandView={setExpandView}
            expandView={expandView}
            handleReasonSelection={setSelectedOtpReason}
            selectedReason={selectedOtpReason}
            onSave={handleOtpOnSave}
            firstInput={firstInput}
            secondInput={secondInput}
            thirdInput={thirdInput}
            fourthInput={fourthInput}
            setFirstInput={setFirstInput}
            setSecondInput={setSecondInput}
            setThirdInput={setThirdInput}
            setFourthInput={setFourthInput}
            reasonList={optReasons}
            onResendOTP={onResendOTP}
            onCancle={() => {
              setExpandView(false);
            }}
            
          />
        )
          : null}
        </>
        : null}

        {technicianJobInformation?.ApprovalStatus == 'Rejected' ? (
          <JobActions
            type={'approval_rejected'}
            setExpandView={setExpandView}
            expandView={expandView}
            rejectedReason={getWorkOrderAppointment?.Reasons[0]?.StatusReason}
          />
        ) : null}

        {technicianJobInformation?.Ishold ? (
          <JobActions
            type={'resume_job'}
            handleResumeJob={() => setResumeJob(true)}
            expandView={expandView}
          />
        ) : null}

        {technicianJobInformation != null ? (
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}>
            {technicianJobInformation?.IsAccept == 0 ? (
              <AcceptRejectContainer
                getWorkOrderAppointment={getWorkOrderAppointment}
                toggleContainer={(val) => {
                  setAcceptToggle(val);
                  val === 'accept'
                    ? fetchJobDetails()
                    : val === 'reject'
                      ? navigation.goBack()
                      : null;
                }}
              />
            ) : null}

            <View style={styles.detailsContainer}>
              <View
                style={[
                  styles.namesContainer,
                  {flexDirection:  'row'},
                ]}>
                <Text
                  style={[
                    styles.customerNameStyle,
                    { color: colors?.PRIMARY_BACKGROUND_COLOR,flexWrap:'wrap',flex:1 },
                  ]}>
                  {technicianJobInformation?.CustomerName}
                </Text>
                <Button
                  title={strings('job_detail.get_details')}
                  onClick={toggleContactDetailPopUp}
                  txtStyle={styles.getDetailsBtnTxt}
                  style={styles?.getDetailBtn}
                  backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
                />
              </View>
              <Text style={styles.addressTxt}>
                {technicianJobInformation?.AcctualAddress}
              </Text>
              <Text style={styles.addressTxt}>
                {technicianJobInformation?.CustomerType}
              </Text>

              {technicianJobInformation?.IsAccept == 1 && (
                <View
                  style={
                    !expandStatus
                      ? styles.crrStatusContainer
                      : styles.onDropDownExpandStyles
                  }>
                  <TouchableOpacity
                    style={[
                      styles.nameContainer,
                      {flexDirection: 'row'},
                    ]}
                    onPress={
                      checkIn
                        ? toggleStatus
                        : () => {
                          FlashMessageComponent(
                            'reject',
                            strings('flashmessage.Please_Check_In_to_update_job_status'),
                          );
                        }
                    }>
                    <View>
                      <Text style={styles.crrStatusTxt}>
                        {strings('job_detail.Current_Status')}
                      </Text>
                      <Text style={styles.crrStatusValue}>
                        {technicianJobInformation?.JobStatus}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        paddingLeft: normalize(10),
                        paddingVertical: normalize(10),
                      }}
                      onPress={
                        checkIn
                          ? toggleStatus
                          : () => {
                            FlashMessageComponent(
                              'reject',
                              strings('flashmessage.Please_Check_In_to_update_job_status'),
                            );
                          }
                      }>
                      <DownArrow
                        height={normalize(6)}
                        width={normalize(11)}
                        fill={Colors?.secondryBlack}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  {expandStatus ? JobStatusFields() : null}
                </View>
              )}

              <View style={styles.projectContainer}>
                <View style={styles.nameContainer}>
                  <View
                    style={[
                      styles.nameContainer,
                      {
                        flex: 1,
                        justifyContent: 'flex-start',
                      },
                    ]}>
                    <EventJobBagIcon
                      height={normalize(13)}
                      width={normalize(15)}
                    />
                    <Text style={styles.jobDetailTxt}>
                      {strings('job_detail.job_details')} (1)
                    </Text>
                  </View>
                  {getProjectDetails != null && (
                    <Button
                      title={strings('job_detail.project_details')}
                      onClick={() =>
                        navigation.navigate('ProjectDetail', {
                          projectDetail: getProjectDetails,
                          // callback: projectCallback
                        })
                      }
                      disabled={
                        technicianJobInformation?.IsAccept == 0 ? true : false
                      }
                      txtStyle={{
                        ...styles.getDetailsBtnTxt,
                        color: Colors?.white,
                        textAlign: 'center',
                      }}
                      style={[
                        styles.projectDetailBtn,
                        {
                          paddingHorizontal: normalize(5),
                          paddingVertical: normalize(4),
                        },
                      ]}
                      backgroundColor={Platform.OS === 'android' ? colors?.PRIMARY_BACKGROUND_COLOR : colors?.PRIMARY_BACKGROUND_COLOR}
                      height={'auto'}
                      width={'auto'}
                    />
                  )}
                </View>

                <View style={styles.woIdContainer}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.woIdTxt}>
                      {technicianJobInformation?.WoNumber}
                    </Text>
                    <Text>{jobDetailsDateTime ? jobDetailsDateTime : '-'}</Text>
                  </View>
                </View>

                <View style={styles.woIdContainer}>
                  <Text style={[styles.addressTxt, styles.categoryTxtSize]}>
                    {strings('job_detail.category')}
                  </Text>
                  <Text style={styles.woCategoryTxtStyles}>
                    {technicianJobInformation?.WoCategory}
                  </Text>
                </View>

                <View style={styles.woIdContainer}>
                  <Text style={[styles.addressTxt, styles.categoryTxtSize]}>
                    {strings('job_detail.reference')} #
                  </Text>
                  <Text style={styles.woCategoryTxtStyles}>
                    {technicianJobInformation?.RequestedBy != null
                      ? technicianJobInformation?.RequestedBy
                      : '-'}
                  </Text>
                </View>

                <View style={styles.woIdContainer}>
                  {permission?.View && woJobDetails?.map((detail, index) => {
                    return (
                      <JobTaskCards
                        key={`ID-${index}`}
                        cardHeaderStyles={{
                          backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                        }}
                        workType={detail?.WorkType}
                        workRequest={detail?.WorkTask}
                        taskIndex={detail?.TaskNo}
                        day={detail?.Days}
                        hours={detail?.Hours}
                        minutes={detail?.Minutes}
                        showTaskOption={
                          (userInfo?.sub == detail?.CreatedBy && technicianJobInformation?.IsAccept == 1 &&
                            technicianJobInformation?.SubmittedSource != 2) ? true : false
                        }
                        hideDeleteButton={detail?.CreatedBy === techId ? true : false}
                        handleDelete={() => {
                          onPresDeleteTask(detail);
                        }}
                        handleEdit={
                          () =>
                            navigation.navigate('AddTask', {
                              data: detail,
                              edit: true,
                              list: woJobDetails,
                              jobDetail: {
                                jobId: getWorkOrderAppointment?.WoJobId,
                                woOrderId:
                                  getWorkOrderAppointment?.WorkOrderId,
                                CustomerId:
                                  technicianJobInformation?.CustomerId,
                              },
                            })
                        }
                        containerStyles={{ marginBottom: normalize(10) }}
                      />
                    );
                  })}
                </View>

                <View style={styles.woIdContainer}>
                  <View style={styles.addTaskContainer}>
                    <PlusIcon
                      height={normalize(10)}
                      width={normalize(10)}
                      fill={permission?.Add ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.darkGray}
                    />
                    <Text
                      color={permission?.Add ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.darkGray}
                      style={styles.addTaskText}
                      onPress={technicianJobInformation?.IsAccept == 1 && permission?.Add && technicianJobInformation?.SubmittedSource != 2
                        ? () =>
                          navigation.navigate('AddTask', {
                            data: woJobDetails[0],
                            list: woJobDetails,
                            edit: false,
                            jobDetail: {
                              jobId: getWorkOrderAppointment?.WoJobId,
                              woOrderId:
                                getWorkOrderAppointment?.WorkOrderId,
                              CustomerId:
                                technicianJobInformation?.CustomerId,
                            },
                          })
                        : null
                      }>
                      {strings('add_new_task.add_task')}
                    </Text>
                  </View>
                </View>

                <CustomFields
                  editable={technicianJobInformation?.IsAccept == 1 &&
                    technicianJobInformation?.SubmittedSource != 2 ? true : false}
                  CustomFields={jobDetailsCustomeFileds}
                  data={''}
                  callback={getCustomFieldsCallBack}
                />
              </View>
              <View style={[{ padding: 0 }]}>
                <Instructions
                  Selected={1}
                  serviceNote={getjobServiceNotesDetail}
                  techRemark={getTechnicianRemarks}
                  instruction={getWojobSplInsDetails}
                  WorkOrderId={technicianJobInformation?.WorkOrderId}
                  jobId={jobId}
                  callback={fetchNotesCallback}
                  // callback={fetchJobDetails}
                  isAccept={technicianJobInformation?.IsAccept}
                  submittedSource={technicianJobInformation?.SubmittedSource}
                />
              </View>

              <PartsAttachmentDropdown
                type={'parts'}
                data={partPermission?.Add ? requestPartList : []}
                isAccept={technicianJobInformation?.IsAccept}
                submittedSource={technicianJobInformation?.SubmittedSource}
                onAdd={
                  technicianJobInformation?.IsAccept == 1
                    ? () =>
                      navigation.navigate('AddParts', {
                        partsData: undefined,
                        partsType: undefined,
                        edit: false,
                        jobId: jobId,
                        technicianJobInformation: technicianJobInformation,
                        woJobDetails: woJobDetails,
                        getWorkOrderAppointment: getWorkOrderAppointment,
                      })
                    : null
                }
                navigation={navigation}
                getWorkOrderAppointment={getWorkOrderAppointment}
                getList={getPartListCallBack}
                getJobCheckList={getPartListCallBack}
              />
              <PartsAttachmentDropdown
                type={'attachments'}
                data={attachmentData}
                onAdd={
                  technicianJobInformation?.IsAccept == 1
                    ? () =>
                      // navigation.navigate('AddAttachment', {
                      //   attchmentDetail: undefined,
                      //   edit: false,
                      //   type: undefined,
                      //   screenName: 'Add Attachment',
                      // })
                      navigation.navigate('Attachment', {
                        attchmentDetail: undefined,
                        edit: false,
                        type: undefined,
                        screenName: 'Add Attachment',
                        formDetail: {},
                        color: colors.PRIMARY_BACKGROUND_COLOR
                      })
                    : null
                }
                isAccept={technicianJobInformation?.IsAccept}
                submittedSource={technicianJobInformation?.SubmittedSource}
                onPressDelete={() => { }}
                navigation={navigation}
                getList={GetAttachments}
              />
              <PartsAttachmentDropdown
                type={'forms'}
                data={getWOJobChecklist}
                isAccept={technicianJobInformation?.IsAccept}
                submittedSource={technicianJobInformation?.SubmittedSource}
                navigation={navigation}
                getJobCheckList={fetchJobCkecklistCallBack}
                getList={fetchJobDetails}
                onPressFormSave={handleLocationCheck}
                onAdd={() => {
                  technicianJobInformation?.IsAccept == 1
                    ? navigation.navigate('AddCheckList')
                    : null;
                }}
              />
            </View>
            {/* <Text
            onPress={() =>
              navigation?.navigate('EquipmentAttachment', {jobId: jobId})
            }>
            Go to Equipment Attachment List
          </Text> */}
          </ScrollView>
        ) : (
          message != '' && <DataNotFound />
        )}
        <Loader visibility={isLoading} />
        {showPhoneNoModal ? (
          <PhoneNumberModal
            visibility={showPhoneNoModal}
            handleModalVisibility={toggalPhoneNoMaodal}
            workPhoneNo={workOrderCustomerContactDetails?.Phone1}
            mobileNo={workOrderCustomerContactDetails?.Phone2}
          />
        ) : null}

        {showMoreOpt ? (
          <AddMoreModal
            visibility={showMoreOpt}
            handleModalVisibility={toggleShowMoreOpt}
            showTimeLine={true}
            handleJobTimeLine={handleJobTimeLine}
            containerStyles={{top: Platform.OS === 'ios' ? normalize(44) : normalize(10)}}
          />
        ) : null}

        {contactDetailPopUp ? (
          <CommonModal
            visibility={contactDetailPopUp}
            navigation={navigation}
            handleModalVisibility={toggleContactDetailPopUp}
            callback={customerDetailCallback}
            data={{
              ...workOrderCustomerContactDetails,
              CustomerName: technicianJobInformation?.CustomerName,
              AcctualAddress: technicianJobInformation?.AcctualAddress,
              ...getWorkOrderAppointment,
              isAccept: technicianJobInformation?.IsAccept,
              submittedSource: technicianJobInformation?.SubmittedSource,
              CustAddressId: technicianJobInformation?.CustAddressId,
              CompanyId: userInfo?.CompanyId,
              JobId: getWorkOrderAppointment?.WoJobId,
            }}
          />
          
        ) : null}
        {showResumeJob ? (
          <ResumeJobModal
            handleModalVisibility={toggleShowResumeJob}
            visibility={showResumeJob}
          />
        ) : null}
        {/* <Text onPress={toggleShowResumeJob}>Resume job</Text> */}
        {showTechRemark ? (
          <TechnicianRemarkModal
            handleModalVisibility={toggleTechRemark}
            visibility={showTechRemark}
            WorkOrderId={technicianJobInformation?.WorkOrderId}
            jobId={jobId}
            callback={() =>
              setTimeout(() => {
                fetchJobDetails();
              }, 1250)
            }
          />
        ) : null}
        {unresolvedModal ? (
          <UnResolvedCompleteModal
            handleModalVisibility={toggleUnresolvedModal}
            visibility={unresolvedModal}
            status={technicianJobInformation?.JobStatus}
            reasonList={reasonList}
            title={strings('job_detail.Unresolve_Job')}
            workRequests={woJobDetails}
            handleActualHrSelection={setActualHr}
            handleActualMinSelection={setActualMins}
            workOrderDetails={getWorkOrderAppointment}
            actualTravelValue={actualTravel != null ? actualTravel : 0}
            onActualTravelTextChange={setActualTravel}
            technicianRemarkTextChange={setTechnicianRemark}
            technicianRemark={technicianRemark}
            selectedActualHr={actualHrs}
            selectedActualMin={actualMins}
            handleReasonSelection={setReasonId}
            selectedReason={unresolvedReason}
            isSubmitted={
              technicianJobInformation?.JobStatus == 'Unresolved' ? true : false
            }
            onUpdateStatus={() => handleUnResolvedUpdateStatus(6)}
            hrList={hrs}
            minList={min}
            callback={statusReasonCallback}
          />
        ) : null}

        {completed ? (
          <UnResolvedCompleteModal
            handleModalVisibility={toggleCompleteModal}
            visibility={completed}
            status={technicianJobInformation?.JobStatus}
            reasonList={completedJobReasonList}
            title={strings('job_detail.Completed_Job')}
            workRequests={woJobDetails}
            handleActualHrSelection={setActualHr}
            handleActualMinSelection={setActualMins}
            workOrderDetails={getWorkOrderAppointment}
            actualTravelValue={actualTravel != null ? actualTravel : 0}
            onActualTravelTextChange={setActualTravel}
            technicianRemarkTextChange={setTechnicianRemark}
            technicianRemark={technicianRemark}
            selectedActualHr={actualHrs}
            selectedActualMin={actualMins}
            handleReasonSelection={setReasonId}
            selectedReason={unresolvedReason}
            isSubmitted={
              technicianJobInformation?.SubmittedSource == null ? false : true
            }
            onUpdateStatus={() => {
              handleUnResolvedUpdateStatus(5);
            }}
            hrList={hrs}
            minList={min}
            callback={statusReasonCallback}
          />
        ) : null}
      </SafeAreaView>
      {technicianJobInformation?.IsAccept == 1 && (
        <TabShape navigation={navigation} newNotification={true} />
      )}
      {serviceReportVisible ? (
        <EquipmentServiceReportModal
          visibility={serviceReportVisible}
          handleModalVisibility={toggleServiceReprtModal}
          jobDetailsNew={JobDetailsNew}
          priceDetailsNew={priceDetailsNew}
        />
      ) : null}
      {/* <AllCustomeFields
        panelName={'jobList'}
        type={'jobdetials'}
        CustomFields={customeFieldsPanel[0]}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(22),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  multiBtnContainer: {
    backgroundColor: Colors?.popUpLightGreyBackground,
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(15),
  },
  btnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors?.white,
    fontFamily: fontFamily?.semiBold,
  },
  btnHeight: {
    height: normalize(36),
  },
  rejectBtnStyles: {
    backgroundColor: Colors?.dangerRed,
  },
  acceptBtnStyles: {
    backgroundColor: Colors?.successGreen,
  },
  detailsContainer: {
    backgroundColor: Colors?.appGray,
    flex: 1,
    padding: normalize(20),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  namesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  getDetailsBtnTxt: {
    fontSize: normalize(13),
    color: Colors?.white,
  },
  getDetailBtn: {
    height: normalize(25),
    width: I18nManager.isRTL ? normalize(120) : normalize(91),
    borderRadius: normalize(20),
  },
  customerNameStyle: {
    fontSize: normalize(19),
    fontFamily: fontFamily.semiBold,
  },
  addressTxt: {
    fontSize: textSizes.h11,
    color: Colors?.secondryBlack,
    alignSelf: 'flex-start',
    textAlign: I18nManager.isRTL ? 'left' : 'right',
    textAlign: Platform.OS === 'ios' ? 'left' : 'left',
    // backgroundColor: 'red',
    width: '70%',
  },
  projectContainer: {
    marginTop: normalize(20),
    borderWidth: normalize(1),
    borderColor: Colors?.greyBorder,
    padding: normalize(12),
    borderRadius: normalize(8),
    backgroundColor: Colors?.white,
  },
  projectDetailBtn: {
    // borderWidth: normalize(0.6),
    borderRadius: normalize(20),
    // height: normalize(25),
    // borderColor: Colors?.black,
    flex: 0.5,

  },
  jobDetailTxt: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.bold,
    marginLeft: normalize(10),
  },
  woIdContainer: {
    marginTop: normalize(23),
  },
  woIdTxt: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.bold,
    color: Colors?.secondryBlack,
  },
  categoryTxtSize: {
    fontSize: normalize(13),
  },
  woCategoryTxtStyles: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.semiBold,
    color: Colors?.secondryBlack,
    alignSelf: 'flex-start',
  },
  addTaskText: {
    fontFamily: fontFamily.bold,
    fontSize: textSizes.h11,
    alignSelf: 'flex-end',
    marginLeft: normalize(7),
  },
  crrStatusContainer: {
    padding: normalize(9),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(7),
    backgroundColor: Colors?.white,
    elevation: 3,
    // borderWidth: 0.2,
    shadowColor: Colors.shadowcolor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 7,
    marginTop: normalize(31),
    marginBottom: normalize(11),
  },
  crrStatusValue: {
    fontFamily: fontFamily.bold,
    fontSize: normalize(18),
    alignSelf: 'flex-start',
    color: Colors.secondryBlack,
  },
  crrStatusTxt: {
    fontSize: normalize(13),
    paddingRight: normalize(10),
    color: Colors.secondryBlack,
    fontFamily: fontFamily.regular,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  onDropDownExpandStyles: {
    padding: normalize(9),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(8),
    backgroundColor: Colors?.white,
    marginTop: normalize(31),
    paddingBottom: normalize(23),
    marginBottom: normalize(11),
    borderColor: Colors?.greyBorder,
    borderWidth: normalize(1),
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTxt: {
    fontSize: textSizes.h9,
  },
  viewCompleteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(15),
  },
  completedDetails: {
    fontSize: normalize(14),
    fontFamily: fontFamily?.semiBold,
    marginLeft: normalize(10),
  },
});

export default JobDetail;
