import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../assets/styles/colors/colors.js';
import AddMoreModal from '../JobList/addMore.js';
import MainHoc from '../../../components/Hoc';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {DataNotFound} from '../../../components/DataNotFound/index.js';
import {
  BlackMoreOptionIcon,
  ClockIcon,
  Phone,
  Progress,
  Job,
  GroupEquipment,
  EventJobBagIcon,
  PlusIcon,
  DownArrow,
  JobStatusSuccessTick,
  LocationIcon2,
  UserGroup,
  CallIcon2,
} from '../../../assets/img/index.js';
import CustomFilter from '../../../components/FilterByModal/CustomFilterModal';
import api from '../../../lib/api';
import HeaderComponents from '../../../components/header';
import {Header} from '../../../lib/buildHeader';
import Loader from '../../../components/Loader';
import {Text} from '../../../components/Text/index';
import PhoneNumberModal from '../JobDetail/PhoneNumberModal';
import QRCodeUI from '../../screens/JobDetail/PartsAttachments/QRCodeUI';
import {strings} from '../../../lib/I18n/index.js';
import {useColors} from '../../../hooks/useColors.js';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {iosToDMY} from '../../../util/helper.js';
import {fetchNotesOnline} from '../../../lib/callBackApi.js';
import {accessPermission} from '../../../database/MobilePrevi/index.js';
import ServiceReportModel from '../JobDetail/ServiceReportModal.js';

const {width, height} = Dimensions.get('window');
const RecentJobs = ({navigation}) => {
  const [forCustomer, setforCustomer] = useState(true);
  const [forEquipment, setforEquipment] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [modelItem, setmodelItem] = useState(null);
  const [recentJobDataForCus, setRecentJobDataForCus] = useState('');
  const [recentJobDataForEquip, setRecentJobDataForEquip] = useState('');
  const [filterByModalVisible, setFilterByModalVisible] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [showPhoneNoModal, setShowPhoneNoModal] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [emptyMsg, setemptyMsg] = useState(false);
  const {colors} = useColors();
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const [showQR, setShowQR] = useState(false);
  const [scan, setScan] = useState('');
  const [permission, setPermission] = useState({});
  const jobInfo = useSelector((state) => state);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [jobServiceNotesDetail, setjobServiceNotesDetail] = useState([]);
  const [GetTechnicianRemarks, setGetTechnicianRemarks] = useState([]);
  const getWorkOrderAppointment = useSelector(
    (state) => state?.jobDetailReducers?.GetWorkOrderAppointment,
  );

  useEffect(() => {
    getRecentJobApi('');
   
  }, [forCustomer]);
  useEffect(()=>{
  },[isLoading])

  useEffect(() => {
    accessPermission('Recent Jobs').then((res) => {
      setPermission(res);
    });
  }, []);

  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const forCustomerToggleFun = () => {
    setforCustomer(true);
    setforEquipment(false);
    getRecentJobApi('');
  };
  const forEquipmentToggleFun = () => {
    setforCustomer(false);
    setforEquipment(true);
    getRecentJobApi('');
  };

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  const toggalPhoneNoMaodal = () => {
    setShowPhoneNoModal(!showPhoneNoModal);
  };

  const toggleRemark = (title) => {
    setNoteTitle(title);
    setShowRemark(!showRemark);
  };

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => {
        toggleAddMore();
      },
    },
  ];

  const getRecentJobApi = (arg) => {

    try {
       dispatch({type: SET_LOADER_TRUE});

      const handleCallback = {
        success: (data) => {
         if(data.length<1){
          dispatch({type: SET_LOADER_FALSE});

         } 
          setemptyMsg(true);
          dispatch({type: SET_LOADER_FALSE});

          forCustomer == true
            ? setRecentJobDataForCus(data)
            : arg != ''
            ? setRecentJobDataForEquip(data)
            : setRecentJobDataForEquip([]);
        },
        error: (error) => {
          dispatch({type: SET_LOADER_FALSE});
        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${
        jobInfo?.authReducer?.userInfo?.CompanyId
      }&CustomerId=${jobDetail?.CustomerId}&TechId=${
        isEnabled ? userInfo.sub : null
      }&isCustomerSearch=${forCustomer == true ? true : false}&serialno=${
        arg != '' ? arg?.serialno : null
      }&JobStatusId=${arg != '' ? arg?.JobStatusId : null}&ModelId=${
        arg != '' ? arg?.ModelId : null
      }`;
      api.getRecentJob('', handleCallback, header, endPoint);
      // dispatch({type: SET_LOADER_TRUE});
      dispatch({type: SET_LOADER_FALSE});

    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  const fetchNotesCallback = (item, id) => {
    const cb = (data) => {
      setjobServiceNotesDetail(data);
     
    };

    let endPoint = `${userInfo?.CompanyId}/${userInfo?.sub}/28/${item?.WorkOrderId}/${item.WoJobId}/${id}`;
    fetchNotesOnline('', token, endPoint, cb);
    // }
  };

  const onPressFilter = (data) => {
    setFilterByModalVisible(false);
     getRecentJobApi(data);
    
  };

  const toggleShowQR = () => {
    setShowQR(!showQR);
  };

  const onSuccess = (e) => {
    try {
      e
        ? (setScan(e?.data),
          Alert.alert('Success', e?.data, [
            {
              text: 'Cancel',
              onPress: () => toggleShowQR(),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                let obj = {
                  serialno: e?.data,
                  JobStatusId: null,
                  ModelId: null,
                };
                getRecentJobApi(obj);
              },
            },
          ]))
        : Alert.alert(`No job found`);
    } catch (error) {
      Alert.alert('Something Went Wrong!!');
    }
    setShowQR(!showQR);
  };

  const renderItem = ({item, index}) => {
    const WorkRequest = item.WorkRequest;
    let indexes = WorkRequest?.indexOf(',');
    return (
      <View style={styles.renderContainer}>
        <View style={styles.cardHeaders}>
          <View style={styles.jobLebelContainer}>
            <ClockIcon
              style={{
                alignSelf: 'center',
              }}
              height={normalize(14)}
              width={normalize(14)}
            />
            <Text
              style={{
                fontFamily: fontFamily.regular,
                marginHorizontal: 5,
                fontSize: normalize(14),
              }}>
              {strings('RecentJobs.Job')}
            </Text>
            <Text style={styles.jobId}>{`#${item.WoJobId}`}</Text>
          </View>
        
            <View style={styles.title}>
              <Text
                style={[
                  styles.serviceLebel,
                  {color: colors?.PRIMARY_BACKGROUND_COLOR},
                ]}>
                {strings('RecentJobs.Service')}
              </Text>
            </View>
         
        </View>
        <Text style={styles.jobTypeTxt} align={'flex-start'}>
          {item.Category}
        </Text>
        <Text
          style={[styles.jobInfoLabel, {bottom: normalize(5)}]}
          align={'flex-start'}>
          {/* {item.WorkRequest != null ? `${item.WorkRequest}`.substring(0,indexes)
          : ''} */}
          {item.WorkRequest != null
            ? indexes != -1 && indexes != null
              ? `${item.WorkRequest}`.substring(0, indexes)
              : `${item.WorkRequest}`
            : ''}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* {item.Status == 'Completed' ? (
            <View style={styles.roundView}></View>
          ) : (
            <View style={styles.redRoundView}></View>
          )} */}
          {item.Status == 'Completed' ? (
            <View style={styles.roundView}></View>
          ) : null}
          {item.Status == 'Unresolved' ? (
            <View style={styles.redRoundView}></View>
          ) : null}
          {item.Status == 'On Site' ? (
            <View style={styles.orangeRoundView}></View>
          ) : null}
           {item.Status == 'Cancelled' ? (
            <View style={styles.grayRoundView}></View>
          ) : null}
          {item.Status == 'Scheduled' ? (
            <View style={styles.blueRoundView}></View>
          ) : null}
          {item.Status == 'Completed' || item.Status == 'Unresolved'|| item.Status == 'On Site' || item.Status == 'Cancelled' || item.Status == 'Scheduled' ? (
            <Text style={styles.statusLabel} align={'flex-start'}>
              {item.Status}
            </Text>
          ) : null}

          {item?.JobStatusDateTime ? (
            <Text
              style={{fontFamily: fontFamily.regular, fontSize: normalize(13)}}
              align={'flex-start'}>
              {iosToDMY(item?.JobStatusDateTime)}
            </Text>
          ) : null}
        </View>
        {item.Status == 'Completed' || item.Status == 'Unresolved' ? (
          <Text style={styles.jobInfoLabel} align={'flex-start'}>
            {item?.Reason}
          </Text>
        ) : null}
        {(item.ServiceNotesCount > 0 || item.TechnicianRemarksCount > 0) && (
          <View style={styles.ServiceNotesContainer}>
            {item.ServiceNotesCount > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  fetchNotesCallback(item, 0);
                  toggleRemark(strings('RecentJobs.Service_Note'));
                }}>
                <Text
                  style={[
                    styles.NotesType,
                    {color: colors?.PRIMARY_BACKGROUND_COLOR},
                  ]}>
                  {strings('RecentJobs.Service_Note')} ({item.ServiceNotesCount}
                  )
                </Text>
              </TouchableOpacity>
            ) : null}
            {item.TechnicianRemarksCount > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  fetchNotesCallback(item, 1);
                  toggleRemark(strings('RecentJobs.Technician_Remark'));
                }}>
                <Text
                  style={[
                    styles.RemarkStyle,
                    {color: colors?.PRIMARY_BACKGROUND_COLOR},
                  ]}>
                  {strings('RecentJobs.Technician_Remark')} (
                  {item.TechnicianRemarksCount})
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        <View style={styles.borderStyle}></View>

        <View style={styles.userNameContainer}>
          <Text style={{fontFamily: fontFamily.bold, fontSize: normalize(15)}}>
            {item.TechName} {item.Status == 'Inactive' ? '(Inactive)' : null}
          </Text>
          {item.Status != 'Inactive' ? (
            <Text
              style={{fontFamily: fontFamily.bold, fontSize: normalize(15)}}>
              {/* {/ {item.Phone1} /} */}
              <TouchableOpacity onPress={() => toggalPhoneNoMaodal()}>
                <Phone
                  style={{
                    alignSelf: 'center',
                    marginRight: 10,
                  }}
                  height={normalize(21)}
                  width={normalize(21)}
                  color={colors?.PRIMARY_BACKGROUND_COLOR}
                />
              </TouchableOpacity>
            </Text>
          ) : null}
        </View>
        {showPhoneNoModal ? (
          <PhoneNumberModal
            visibility={showPhoneNoModal}
            handleModalVisibility={toggalPhoneNoMaodal}
            workPhoneNo={item?.Mobile1}
            mobileNo={item?.Phone1}
          />
        ) : null}
        {showRemark ? (
          <>
            <ServiceReportModel
              handleModalVisibility={toggleRemark}
              visibility={showRemark}
              title={noteTitle}
              type={'Recent'}
              list={jobServiceNotesDetail}
              text={jobServiceNotesDetail[0]?.Note}
            />
          </>
        ) : null}
      </View>
    );
  };

  return (
    <>
      {!showQR ? (
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <HeaderComponents
            title={strings('RecentJobs.header_title')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />

          <View style={styles.togleeContainer}>
            <TouchableOpacity
              onPress={() => {
                forCustomerToggleFun();
              }}>
              <View
                style={{
                  width: width * 0.45,
                  height: height * 0.07,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: forCustomer ? 2 : 0,
                  borderBottomColor: forCustomer
                    ? colors?.PRIMARY_BACKGROUND_COLOR
                    : 'lightgray',
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: forCustomer ? '#252525' : '#D6D6D6',
                    fontSize: normalize(17),
                  }}>
                  {strings('RecentJobs.for_Customer')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                forEquipmentToggleFun();
              }}>
              <View
                style={{
                  width: width * 0.45,
                  height: height * 0.07,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: forEquipment ? 2 : 0,
                  borderBottomColor: forEquipment
                    ? colors?.PRIMARY_BACKGROUND_COLOR
                    : 'lightgray',
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: forEquipment ? '#252525' : '#D6D6D6',
                    fontSize: normalize(17),
                  }}>
                  {strings('RecentJobs.For_Equipment')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={
              forEquipment
                ? styles.EquipmentprogressButton
                : styles.progressButton
            }>
            {forEquipment ? (
              <TouchableOpacity onPress={() => toggleShowQR()}>
                <GroupEquipment
                  style={{
                    alignSelf: 'center',
                  }}
                  height={normalize(22)}
                  width={normalize(22)}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={() => setFilterByModalVisible(true)}>
              <Progress
                style={{
                  alignSelf: 'center',
                }}
                height={normalize(30)}
                width={normalize(30)}
              />
            </TouchableOpacity>
          </View>
          {recentJobDataForCus.length > 0 &&
          forCustomer &&
          isEnabled &&
          permission?.View ? (
            <FlatList
              data={recentJobDataForCus}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : recentJobDataForEquip.length > 0 &&
            isEnabled &&
            permission?.View ? (
            <FlatList
              data={recentJobDataForEquip}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View style={styles.errWrap}>{emptyMsg && <DataNotFound />}</View>
          )}

          <CustomFilter
            visible={filterByModalVisible}
            modalHeadingLabel={strings('RecentJobs.Filter_By')}
            switchLabel={strings('RecentJobs.Show_My_Jobs_Only')}
            onChangeVal={toggleSwitch}
            switchValue={isEnabled}
            inputFieldView={forCustomer == true ? true : false}
            buttonTxt={strings('RecentJobs.Apply')}
            modelLabelTxt={strings('RecentJobs.Model')}
            JobStatusHeading={strings('RecentJobs.Job_Status')}
            serialLabelTxt={strings('RecentJobs.Serial')}
            hasBorder={true}
            dropdownlabel={modelItem?.label}
            handleModalVisibility={() => {
              setFilterByModalVisible(false);
            }}
            qrcodePress={() => toggleShowQR()}
            scanValue={scan}
            passScan={setScan}
            onPress={(data) => onPressFilter(data)}
          />
          {showAddMore ? (
            <AddMoreModal
              visibility={showAddMore}
              handleModalVisibility={toggleAddMore}
              txtColor={Colors.white}
              TxtStyle={{color: Colors.white}}
            />
          ) : null}

          <Loader visibility={isLoading} />
        </View>
      ) : (
        <QRCodeUI
          onSuccess={onSuccess}
          onCancel={toggleShowQR}
          onDone={onSuccess}
        />
      )}
    </>
  );
};

export default MainHoc(RecentJobs);

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  errWrap: {
    flex: 1,
    alignSelf: 'center',
    marginBottom: normalize(50),
  },
  renderContainer: {
    width: width * 0.94,
    // height: height * 0.24,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginVertical: height * 0.01,
    alignSelf: 'center',
  },
  jobId: {fontFamily: fontFamily.regular, fontSize: normalize(14)},
  roundView: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#179E29',
  },
  redRoundView: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D7373F',
  },
  orangeRoundView:{
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFA900',
  },
  grayRoundView:{
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6D6D6D',
  },
  blueRoundView:{
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#003366',
  },
  jobTypeTxt: {
    fontFamily: fontFamily.bold,
    fontSize: normalize(17),
    marginVertical: 10,
  },
  statusLabel: {
    fontFamily: fontFamily.bold,
    marginHorizontal: 10,
    fontSize: normalize(14),
  },
  jobInfoLabel: {
    fontFamily: fontFamily.regular,
    marginVertical: 10,
    fontSize: normalize(14),
  },
  NotesType: {
    fontFamily: fontFamily.regular,
    // color: '#17338D',
    fontSize: normalize(14),
  },
  RemarkStyle: {
    fontFamily: fontFamily.regular,
    // color: '#17338D',
    fontSize: normalize(14),
  },

  borderStyle: {
    width: width * 0.9,
    height: height * 0.01,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'lightgray',
  },
  serviceLebel: {
    fontSize: normalize(14),
    fontFamily: fontFamily.bold,
  },
  togleeContainer: {
    width: width,
    height: height * 0.07,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },

  progressButton: {
    flexDirection: 'row',
    width: width * 0.3,
    marginVertical: height * 0.02,
    alignSelf: 'flex-end',
    marginRight: width * 0.07,
    justifyContent: 'flex-end',
  },
  EquipmentprogressButton: {
    flexDirection: 'row',
    width: width * 0.2,
    marginVertical: height * 0.02,
    alignSelf: 'flex-end',
    marginRight: width * 0.07,
    justifyContent: 'space-between',
  },
  cardHeaders: {
    width: width * 0.88,
    height: height * 0.04,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'pink',
    flexDirection: 'row',
  },
  userNameContainer: {
    width: width * 0.88,
    // height: height * 0.04,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'pink',
    flexDirection: 'row',
  },

  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF0FF',
    width: normalize(70.3),
    height: normalize(22.23),
    borderRadius: 5,
    opacity: 1,
  },

  ServiceNotesContainer: {
    height: height * 0.04,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'pink',
    flexDirection: 'row',
    // marginTop: height*.013,
    width: width * 0.8,
  },
  jobLebelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


