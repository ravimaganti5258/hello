import React, {useEffect,useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../../assets/styles/colors/colors.js';
import AddMoreModal from '../../screens/JobList/addMore';
import TabShape from '../../navigators/BottomTab/TabShape.js';
import ScheduleToMe from './ScheduleToMe';
import Loader from '../../../components/Loader';
import { useIsFocused } from '@react-navigation/native';

import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import {
  BlackMoreOptionIcon,
  UserIcon,
  ClockIcon,
  AttchmentIcon,
  WhiteDeleteIcon,
  WhiteEditIcon,
} from '../../../assets/img/index.js';
import {
  commonStyles,
} from '../../../util/helper';
import { strings } from '../../../lib/I18n/index.js';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import {
  serviceReportdisable,
  serviceReportVisibleAction,
} from '../../../redux/serviceReport/action.js';
import EquipmentServiceReportModal from '../Equipments/EquipmentServiceReportModal.js';
import SwipeableComponent from '../../../components/Swipeable/index.js';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';
import api from '../../../lib/api';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';

import { Header } from '../../../lib/buildHeader';
import HeaderComponents from '../../../components/header';
import MultiButton from '../../../components/MultiButton/index.js';
import { ModalContainer } from '../../../components/Modal/index.js';
import { useColors } from '../../../hooks/useColors.js';
import {
  fetchJobDetails,
  saveJobDetails,
} from '../../../redux/jobDetails/action';
import { useFocusEffect } from '@react-navigation/native';
import { DataNotFound } from '../../../components/DataNotFound/index.js';
import { accessPermission } from '../../../database/MobilePrevi/index.js';

const { width, height } = Dimensions.get('window');

const iconWidth = textSizes.h12;
const iconHeight = textSizes.h12;
const ff = fontFamily.semiBold;


const WrapperComponent = ({
  item,
  navigation,
  row,
  index,
  children,
  Editable,
  Delete,
  closeRow = () => null,

}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const callBack = (data) => {
    dispatch(saveJobDetails(data[0]));
  };
  const deleteIncidents = (item) => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WOPunchPointsId=${item?.WOPunchPointsId}`;
      const handleCallback = {
        success: (data) => {
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          dispatch({ type: SET_LOADER_FALSE });
          let dataset = {
            token: token,
            TechId: userInfo?.sub,
            WojobId: jobInfo?.WoJobId,
            CompanyId: userInfo?.CompanyId,
            customFieldentity: '3,16',
          };
          fetchJobDetails(dataset, callBack);
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );

          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      api.deleteIncident('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteAction = (item) => {
    try {
      deleteIncidents(item);

      row[index].close();
      toggleDeleteModal();
    } catch (error) {
      toggleDeleteModal();
    }
  };

  const handleEditAction = () => {
    try {
      row[index].close();
      navigation.navigate('AddIncident', {
        title: strings('Add_Incident.Edit_Incidents'),
        item: item,
        incidentAttchment: false,
      });
    } catch (error) { }
  };

  let Btns = []
  let Btns2 = []
  let editBtn = {
    title: strings('IncidentAttachmentList.Edit'),
    action: () => handleEditAction(),
    style: { backgroundColor: Colors.blue },
    SvgIcon:
      item?.title != ''
        ? () => <WhiteEditIcon width={iconWidth} height={iconHeight} />
        : null,
  }
  let deleteBtn = {
    title: strings('IncidentAttachmentList.Delete'),
    action: () => toggleDeleteModal(),

    style: { backgroundColor: Colors.deleateRed },
    SvgIcon:
      item?.title != ''
        ? () => (
          <WhiteDeleteIcon width={iconWidth} height={iconHeight} />
        )
        : null,
  }
  Editable == true && Btns.push(editBtn)
  Delete == true && Btns.push(deleteBtn)
Editable == true && Btns2.push(editBtn)

  return (
    <>
      <SwipeableComponent
        index={index}
        row={row}
        enabled={Btns.length > 0 && jobInfo?.SubmittedSource != 2 ? true : false}
        rowOpened={(index) => {
          closeRow(index);
        }}
        containerStyle={{
          shadowOffset: { width: 0, height: 0 },
          shadowColor: Colors?.white,
          elevation: 0,
          backgroundColor: Colors.white,
        }}
        buttons={item?.CreatedBy == jobInfo?.TechId ?Btns : Btns2}>
        {children}
      </SwipeableComponent>
      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.Delete_Discription')}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={() => handleDeleteAction(item)}
        />
      ) : null}
    </>
  );
};

const Incidents = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [scheduleToMe, setScheduleToMe] = useState(false);
  const [worktaskid, setWorktaskid] = useState(null)
  const [onItem,setOnItem] = useState({})
  const { colors } = useColors();
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const incidentList = useSelector(
    (state) => state?.jobDetailReducers?.data?.IncidentDetails,
  );

  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const userInformation = useSelector((state) => state?.authReducer?.userInfo);
  
  const [permission, setPermission] = useState({});


  const token = useSelector((state) => state?.authReducer?.token);
  const dispatch = useDispatch();

  const serviceReportVisible = useSelector(
    (state) => state?.ServiceReportReducer?.serviceReportVisible,
  );
  const jobDetails = useSelector((state) => state?.jobDetailReducers?.data);


  const toggleServiceReprtModal = () => {
    dispatch(serviceReportVisibleAction(!serviceReportVisible));
    if (serviceReportVisible) {
      dispatch(serviceReportdisable());
    }
  };
  const ScheduleMeToggle = () => {
    setScheduleToMe(!scheduleToMe);
  };
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];

  useEffect(() => {
    accessPermission('Punch List').then((res) => {
      setPermission(res)
    })
  }, []);


  const fetchIncidentDetailsOnline = () => {
    try {
      const handleCallback = {
        success: (res) => {
          dispatch(saveJobDetails({ ...jobDetails, IncidentDetails: res }));
        },
        error: (Err) => { },
      };

      const endPoint = `?CompanyId=${userInformation?.CompanyId}&WoId=${jobInfo?.WorkOrderId}&WoJobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetIncidentDetailsOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchIncidentDetailsOnline();
    }, [navigation]),
  );
 
  let row = [];

  let prevOpenedRow;

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];

  };

// render function for incident cards
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.renderContainer}>
        <WrapperComponent
          item={item}
          navigation={navigation}
          row={row}
          Editable={permission?.Edit}
          Delete={permission?.Delete}
          closeRow={(index) => closeRow(index)}
          index={index}>
          <View style={{ padding: normalize(20) }}>
            <View style={styles.cardHeaders}>
              <Text style={{ fontFamily: fontFamily.bold }}>
                {item.WoCategory}
              </Text>
              <View style={styles.title}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('IncidentAttechment', {
                      data: item,
                      jobInfo: jobInfo
                    })
                  }>
                  <AttchmentIcon
                    style={styles.userImage}
                    color={Colors?.secondryBlack}
                    height={normalize(18)}
                    width={normalize(18)}
                  />
                  {item.Attachmentcounts > 0 ? (
                    <>
                      <View style={[styles.notifyNumber, { backgroundColor: colors.PRIMARY_BACKGROUND_COLOR }]}>
                        <Text style={styles.whitecolor}>
                          {item?.Attachmentcounts}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{ fontFamily: fontFamily.regular, textAlign: 'left' }}>
              {item?.WorkType}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                marginTop: height * 0.02,
                textAlign: 'left'
              }}>
              {strings('add_new_task.work_request')}
            </Text>
            <Text style={{ fontFamily: fontFamily.bold, textAlign: 'left' }}>{item.WorkTask}</Text>
            {item?.WoCategoryId == jobInfo?.WoCategoryId ? (
              <View style={styles.clockIconContainer}>
                <ClockIcon
                  style={{
                    alignSelf: 'center',
                  }}
                  height={normalize(14)}
                  width={normalize(14)}
                />
                <TouchableOpacity
                  onPress={() => {
                    setWorktaskid(item?.WorkTaskId)
                    setOnItem(item)
                    ScheduleMeToggle();
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      color: colors?.PRIMARY_BACKGROUND_COLOR,
                      marginHorizontal: normalize(10),
                    }}>
                    {strings('Add_Incident.Schedule_to_Me')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </WrapperComponent>
      </View>
    );
  };

  // ui for incident list with flatlist
  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={commonStyles}>
          <HeaderComponents
            title={strings('Add_Incident.Incidents')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
          {showAddMore ? (
            <AddMoreModal
              handleModalVisibility={toggleAddMore}
              visibility={showAddMore}
            />
          ) : null}
          <View
            style={{
              ...styles.IncedentsProfile,
              backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
            }}>
            <View style={styles.userContainer}>
              <UserIcon
                style={styles.userIconStyle}
                fill={'white'}
                height={normalize(20)}
                width={normalize(20)}
              />
              <Text style={styles.userName}> {jobInfo?.CustomerName} </Text>
            </View>
            <View style={styles.jobNumContainer}>
              <Text style={styles.userName}>
                {strings('Add_Incident.Job')}
                <Text style={styles.userName}>
                  {' '}
                  #
                  {jobInfo?.WoJobId}
                </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            disabled={jobInfo?.SubmittedSource != 2 ? !permission.Add : true}
            onPress={() =>
              navigation.navigate('AddIncident', {
                title: strings('Add_Incident.header_title'),
              })
            }>
            <View style={styles.addIncidentButton}>
              <Text style={{ fontFamily: fontFamily.bold, color: permission.Add && jobInfo?.SubmittedSource != 2 ? Colors.secondryBlack : Colors.darkGray }}>
                + {' '}
                {strings('Add_Incident.header_title')}
              </Text>

            </View>
          </TouchableOpacity>
          {incidentList?.length > 0 ? (
            <FlatList
              data={incidentList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <DataNotFound />
          )}
        </SafeAreaView>
        <TabShape navigation={navigation} />
        {serviceReportVisible ? (
          <EquipmentServiceReportModal
            visibility={serviceReportVisible}
            handleModalVisibility={toggleServiceReprtModal}
          />
        ) : null}

        {scheduleToMe ? (
          <ModalContainer
            visibility={scheduleToMe}
            containerStyles={styles.modalContainerStyle}>
            <ScheduleToMe
              visibility={scheduleToMe}
              handleModalVisibility={ScheduleMeToggle}
              dataItem={onItem}
            />
          </ModalContainer>
        ) : null}
        <Loader visibility={isLoading} />
      </View>
    </>
  );
};

export default Incidents;
export const TabShap = ({ navigation }) => {
  return <TabShape navigation={navigation} />;
};

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  renderContainer: {
    width: width * 0.94,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    elevation: 2,
    borderRadius: 10,
    marginVertical: height * 0.01,
    alignSelf: 'center',
  },
  IncedentsProfile: {
    width: width * 0.99,
    height: height * 0.07,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,

  },
  userContainer: {
    height: height * 0.07,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  jobNumContainer: {
    height: height * 0.07,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  userName: {
    color: '#ffffff',
    fontFamily: fontFamily.bold,
  },
  addIncidentButton: {
    flexDirection: 'row',
    width: width * 0.3,
    height: height * 0.03,
    marginVertical: height * 0.02,
    alignSelf: 'flex-end',
    marginRight: width * 0.07,
    justifyContent: 'space-between',
  },
  whitecolor: {
    color: Colors?.white,
    fontSize: normalize(10),
  },
  cardHeaders: {
    width: width * 0.838,
    height: height * 0.04,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  userImage: {
    alignSelf: 'center',
    marginHorizontal: normalize(10),
  },
  notifyNumber: {
    position: 'absolute',
    top: normalize(5),
    left: normalize(15),
    backgroundColor: '#17499E',
    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockIconContainer: {
    height: height * 0.04,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    
  },
  container:{
    flex: 1 
  },
  userIconStyle:
    {
      alignSelf: 'center',
      marginHorizontal: normalize(10),
    },
    modalContainerStyle:{
      top: normalize(50) 
    }
  
});
