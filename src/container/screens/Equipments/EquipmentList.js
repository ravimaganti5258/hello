import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  SafeAreaView,
  ScrollView,
  I18nManager,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../../../assets/styles/colors/colors.js';
import AddMoreModal from '../JobList/addMore.js';
import { Text } from '../../../components/Text/index.js';
import { strings } from '../../../lib/I18n/index.js';
import { fontFamily, normalize, textSizes } from '../../../lib/globals.js';
import { useDimensions } from '../../../hooks/useDimensions';
import { useDispatch, useSelector } from 'react-redux';
import {
  BlackMoreOptionIcon,
  CrossIcon,
  SearchIcon,
  SerialSearchQRIcon,
  PlusIcon,
  AttachmentIcon,
  PlusBar,
  WhiteDeleteIcon,
  WhiteEditIcon,
  UserIcon,
} from '../../../assets/img/index.js';
import SwipeableComponent from '../../../components/Swipeable/index.js';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';
import TabShape from '../../navigators/BottomTab/TabShape.js';
import SearchBar from '../../../components/SearchBar/index.js';
import EquipmentServiceReportModal from './EquipmentServiceReportModal.js';
import {
  serviceReportdisable,
  serviceReportVisibleAction,
} from '../../../redux/serviceReport/action';
import QRCodeUI from '../../screens/JobDetail/PartsAttachments/QRCodeUI';
import { useColors } from '../../../hooks/useColors.js';
import Loader from '../../../components/Loader';
import HeaderComponents from '../../../components/header';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import { Header } from '../../../lib/buildHeader';
import api from '../../../lib/api';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { commonStyles } from '../../../util/helper';
import {
  fetchJobDetails,
  saveJobDetails,
} from '../../../redux/jobDetails/action';
import { DataNotFound } from '../../../components/DataNotFound/index.js';
import { saveEquimentattchment, saveExistingEquipment } from '../../../redux/Equipment/action.js';
import { accessPermission } from '../../../database/MobilePrevi/index.js';
const iconWidth = textSizes.h12;
const iconHeight = textSizes.h12;
const ff = fontFamily.semiBold;
const { width, height } = Dimensions.get('screen');

const WrapperComponent = ({
  item,
  navigation,
  row,
  index,
  children,
  apiCallBack,
  Editable,
  Delete,
  closeRow = () => null,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  //api function for delete equipment
  const deleteEquipmentApi = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });

      const handleCallback = {
        success: (data) => {
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));

          dispatch({ type: SET_LOADER_FALSE });
          apiCallBack();
        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WoJobId=${jobInfo?.WoJobId
        }&WoEquipmentId=${item?.WoEquipmentId}&SourceId=${1}`;
      api.deleteEquipment('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteAction = (item) => {
    try {
      deleteEquipmentApi(item);

      row[index].close();
      toggleDeleteModal();
    } catch (error) {
      toggleDeleteModal();
    }
  };

  const handleEditAction = (item) => {
    try {
      row[index].close();
      navigation.navigate('AddNewEquipment', {
        title: strings('EditEquipment.title'),
        data: item,
      });
    } catch (error) { }
  };

  let Btns = [];
  let editBtn = {
    title: strings('Equipments.Edit'),
    action: () => handleEditAction(item),
    style: { backgroundColor: Colors.blue },
    SvgIcon:
      item?.title != ''
        ? () => <WhiteEditIcon width={iconWidth} height={iconHeight} />
        : null,
  };
  let deleteBtn = {
    title: strings('Equipments.Delete'),
    action: () => toggleDeleteModal(),

    style: { backgroundColor: Colors.deleateRed },
    SvgIcon:
      item?.title != ''
        ? () => <WhiteDeleteIcon width={iconWidth} height={iconHeight} />
        : null,
  };
  Editable == true && Btns.push(editBtn);
  Delete == true && Btns.push(deleteBtn);

  return (
    <>
      <SwipeableComponent
        index={index}
        row={row}
        rowOpened={(index) => {
          closeRow(index);
        }}
        enabled={Btns.length > 0 && jobInfo.SubmittedSource != 2 ? true : false}
        containerStyle={{
          shadowOffset: { width: 0, height: 0 },
          shadowColor: Colors?.white,
          elevation: 0,
          backgroundColor: Colors.white,
        }}
        buttons={Btns}>
        {children}
      </SwipeableComponent>
      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('Equipments.Confirmation')}
          discription={strings('Equipments.Are_you_sure_want_to_Delete')}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={() => handleDeleteAction(item)}
        />
      ) : null}
    </>
  );
};

// function for equipment list and ui
const EquipmentList = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const { height, width } = useDimensions();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const serviceReportVisible = useSelector(
    (state) => state?.ServiceReportReducer?.serviceReportVisible,
  );
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const { colors } = useColors();
  const jobDetails = useSelector((state) => state?.jobDetailReducers?.data);
  const equipmentList = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetJobEquipment,
  );
  const [permission, setPermission] = useState({});
  const [equipmentListData, setequipmentListData] = useState([]);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const [scroll, setScroll] = useState(false);

  const dispatch = useDispatch();

  const toggleServiceReprtModal = () => {
    dispatch(serviceReportVisibleAction(!serviceReportVisible));
    if (serviceReportVisible) {
      dispatch(serviceReportdisable());
    }
  };
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const token = useSelector((state) => state?.authReducer?.token);
  const [allAttchmentList, setAllAttchmentList] = useState([]);

  const [showQR, setShowQR] = useState(false);

  const toggleShowQR = () => {
    setShowQR(!showQR);
  };
  useEffect(() => {
    setequipmentListData(equipmentList);
  }, [equipmentList]);

  useEffect(() => {
    getEquipmentAttachmentList();
  }, []);

  useEffect(() => {
    accessPermission('Equipment').then((res) => setPermission(res));
  }, []);

  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused)
      fetchEquimentList();
  }, [IsFocused]);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchEquimentList();
      getSelectEquipmentList()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  //** fetch equipment list api function */
  const fetchEquimentList = () => {
    try {
      const handleCallback = {
        success: (res) => {

          dispatch(saveJobDetails({ ...jobDetails, GetJobEquipment: res }));

          let temp = [];
          if (res?.length > 0) {
            res.forEach((item) => {
              if (temp.length > 0) {
                let flag = false;
                temp.forEach((val) => {
                  if (
                    val.Brand == item.Brand &&
                    val.Model == item.Model &&
                    val.SerialNo == item.SerialNo &&
                    val.TagNo == item.TagNo
                  ) {
                    flag = true;
                  }
                });
                if (!flag) {
                  temp.push(item);
                }
              } else {
                temp.push(item);
              }
            });
          }
          setUserData(res);
          setUserDataList(res);
        },
        error: (Err) => { },
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetJobEquimentOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  //** api function for select equipment */
  const getSelectEquipmentList = () => {
    try {

      const handleCallback = {
        success: (data) => {
          dispatch(saveExistingEquipment(data))
        },
        error: (error) => {

        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&CustomerId=${jobInfo?.CustomerId}`;
      api.selectEquipment('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  // api for equipment attachment list
  const getEquipmentAttachmentList = () => {
    try {
      const data = {
        CompanyId: userInfo?.CompanyId,
        JobId: [jobInfo?.WoJobId],
      };
      const handleCallback = {
        success: (getEquipAttachRes) => {
          setAllAttchmentList(getEquipAttachRes);
          dispatch(saveEquimentattchment(getEquipAttachRes));
        },
        error: (getEquipAttachErr) => { },
      };
      const header = Header(token);
      api.getEquipmentAttachment(data, handleCallback, header);
    } catch (error) { }
  };

  // function for search in equipment list
  const searchAction = () => {
    if (searchQuery.length != 0) {
      const filteredData = userDataList.filter(function (item) {
        const Brand =
          item?.Brand != null ? item?.Brand.toString().toLowerCase() : '';
        const Model =
          item?.Model != null ? item?.Model.toString().toLowerCase() : '';
        const SerialNo = item?.SerialNo
          ? item?.SerialNo.toString().toLowerCase()
          : '';
        const TagNo = item?.TagNo ? item?.TagNo.toString().toLowerCase() : '';
        const Desc = item?.Description ? item?.Description.toLowerCase() : '';
        const textData = searchQuery.toString().toLowerCase().trim();
        return (
          Brand.includes(textData) ||
          Model.includes(textData) ||
          SerialNo.includes(textData) ||
          TagNo.includes(textData) ||
          Desc.includes(textData)
        );
      });
      setUserData(filteredData);
    } else {
      setUserData(userDataList);
    }
  };

  //function for on success of scan
  const onSuccess = (e) => {
    try {
      e
        ? (setSearchQuery(e?.data),
          Alert.alert('Success', e?.data, [
            {
              text: 'Cancel',
              onPress: () => toggleShowQR(),
              style: 'cancel',
            },
            { text: 'Yes', onPress: () => searchAction() },
          ]))
        : Alert.alert(strings('QRCodeUI.Equipment_not_found'));
    } catch (error) {
      Alert.alert(`Something Went Wrong !!`);
    }
    setShowQR(!showQR);
  };

  const toggleSearchIcon = () => {
    setShowSearch(!showSearch);
  };
  const handleCancelSearch = () => {
    try {
      setUserData(userDataList);
      toggleSearchIcon();
      if (showSearch) {
        // coding
      }
    } catch (error) { }
  };

  const headerRightIcons = [
    {
      name: !showSearch ? SearchIcon : CrossIcon,
      onPress: handleCancelSearch,
    },
    {
      name: BlackMoreOptionIcon,
      onPress: () => {
        toggleAddMore();
      },
    },
  ];

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  const callBack2 = (data) => {
    dispatch(saveJobDetails(data[0]));
  };

  useEffect(() => {
    if (IsFocused) {
      let data = {
        token: token,
        TechId: userInfo?.sub,
        WojobId: jobInfo?.WoJobId,
        CompanyId: userInfo?.CompanyId,
        customFieldentity: '3,16',
      };
      fetchJobDetails(data, callBack2);
    }
  }, [IsFocused]);

  let row = [];
  let prevOpenedRow;

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  //** render function for equipment list card */
  const renderComponent = ({ item, index }) => {
    const filterData = allAttchmentList.filter((ele) => {
      return item?.ModelId == ele?.ModelId;
    });

    return (
      <View style={styles.cardView}>
        <WrapperComponent
          item={item}
          navigation={navigation}
          row={row}
          index={index}
          Editable={permission?.Edit}
          Delete={permission?.Delete}
          closeRow={(index) => closeRow(index)}
          apiCallBack={fetchEquimentList}>
          <View style={styles.main}>
            <View
              style={styles.model}>
              <View>
                <View style={styles.models}>
                  <Text align={'flex-start'}>
                    {strings('Equipments.model_1')}
                  </Text>
                  <Text align={'flex-start'} style={styles.font}>
                    {item?.Model}
                  </Text>
                </View>
                <View>
                  <Text align={'flex-start'}>{strings('Equipments.gps')}</Text>
                  <Text align={'flex-start'} style={styles.font}>
                    {item?.TagNo == '' || item?.TagNo == null
                      ? `${strings('Equipments.tag')} -`
                      : `${strings('Equipments.tag')}`}
                    {item?.TagNo}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text align={'flex-end'}>{strings('Equipments.brand_1')}</Text>
                <Text align={'flex-end'} style={styles.font}>
                  {item?.Brand}
                </Text>
              </View>
            </View>
            <View
              style={styles.serial}
            />
            <View
              style={styles.serials}>
              <Text
                style={styles.font}>
                {item.SerialNo == '' || item.SerialNo == null
                  ? `${strings('Equipments.serial')} -`
                  : `${strings('Equipments.serial')}`}
                {item.SerialNo}
              </Text>
              <View style={styles.title}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EquipmentAttachment', {
                      attachmentData: filterData,
                    })
                  }>
                  {filterData.length > 0 ? (
                    <>
                      <AttachmentIcon
                        style={styles.userImage}
                        color={Colors?.secondryBlack}
                        height={normalize(18)}
                        width={normalize(17.43)}
                      />
                      <View style={[styles.notifyNumber, { backgroundColor: colors.PRIMARY_BACKGROUND_COLOR, }]}>
                        <Text style={styles.whitecolor}>
                          {filterData.length}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </WrapperComponent>
      </View>
    );
  };

  const isCloseToTop = ({ contentOffset }) => {
    return contentOffset.y == 0;
  };

  const HeaderSection = () => {
    return (
      <View style={styles.flexView}>
        <View style={styles.horz}>
          <TouchableOpacity onPress={() => toggleShowQR()}>
            <Text>
              {' '}
              <SerialSearchQRIcon height={iconHeight} width={iconWidth} />
              {'   '}
              {strings('Equipments.scan')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horz}>
          <TouchableOpacity
            disabled={jobInfo.SubmittedSource != 2 ? !permission.Add : true}
            onPress={() => {
              navigation.navigate('AddNewEquipment', {
                title: strings('SelectEquipment.Add New Equipment'),
              });
            }}>
            <Text
              color={permission.Add ? Colors.secondryBlack : Colors.darkGray}>
              {' '}
              <PlusIcon
                fill={permission.Add ? Colors.secondryBlack : Colors.darkGray}
                height={iconHeight}
                width={iconWidth}
              />
              {'   '}
              {strings('Equipments.add_new')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horz}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={jobInfo.SubmittedSource != 2 ? !permission.Add : true}
            onPress={() => {
              navigation.navigate('SelectEquipment');
            }}>
            <Text
              color={permission.Add ? Colors.secondryBlack : Colors.darkGray}>
              {' '}
              <PlusBar
                height={iconHeight}
                width={iconWidth}
                fill={permission.Add ? Colors.secondryBlack : Colors.darkGray}
              />
              {'   '}
              {strings('Equipments.add_existing')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {!showQR ? (
        <View style={styles.overall}>
          <SafeAreaView style={commonStyles}>
            <HeaderComponents
              title={`${strings('Equipments.title')} (${userDataList.length})`}
              leftIcon={'Arrow-back'}
              navigation={navigation}
              headerTextStyle={styles.headerStyles}
              HeaderRightIcon={headerRightIcons}
              containerStyle={styles.headcont}
            />

            {showSearch ? (
              <SearchBar
                searchAction={() => searchAction()}
                onChangeText={(data) => setSearchQuery(data)}
                onEndEditing={searchAction}
              />
            ) : null}
            {scroll === true ? (
              <View
                style={[styles.section, {
                  backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                }]}>
                <View style={[styles.topView, { height: normalize(40) }]}></View>

                <View style={styles.outerView1}>{HeaderSection()}</View>
              </View>
            ) : null}
            {scroll === false ? (
              <View>
                <View
                  style={{
                    ...styles.topView,
                    backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                  }}>
                  <View style={styles.useri}>
                    <UserIcon
                      height={normalize(30)}
                      width={normalize(23)}
                      style={styles.cust}
                    />
                    <Text style={styles.TxtStyles}>{jobInfo?.CustomerName}</Text>
                  </View>
                  <Text style={{ color: 'white' }}> {strings('common.job')} # {jobInfo?.WoJobId}</Text>
                </View>

                <View style={styles.outerView}>{HeaderSection()}</View>
              </View>
            ) : null}
            <ScrollView
              onScroll={({ nativeEvent }) => {
                if (isCloseToTop(nativeEvent)) {
                  setScroll(false);
                } else {
                  setScroll(true);
                }
              }}>
              {userData.length > 0 ? (
                <FlatList
                  data={userData}
                  renderItem={renderComponent}
                  keyExtractor={(item, index) => `${index}`}
                />
              ) : (
                <View
                  style={styles.nodata}>
                  <DataNotFound
                  />
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
          <TabShape navigation={navigation} />
          {showAddMore ? (
            <AddMoreModal
              visibility={showAddMore}
              handleModalVisibility={toggleAddMore}
              txtColor={Colors.white}
              TxtStyle={{ color: Colors.white }}
            />
          ) : null}

          {serviceReportVisible ? (
            <EquipmentServiceReportModal
              visibility={serviceReportVisible}
              handleModalVisibility={toggleServiceReprtModal}
            />
          ) : null}
        </View>
      ) : (
        <QRCodeUI
          onSuccess={onSuccess}
          onCancel={toggleShowQR}
          onDone={onSuccess}
        />
      )}
      <Loader visibility={isLoading} />
    </>
  );
};

export default EquipmentList;
export const TabShap = ({ navigation }) => {
  return <TabShape navigation={navigation} />;
};
const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: 1,
  },
  nodata: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: normalize(100),
  },
  overall: {
    flex: 1
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
  TxtStyles: {
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(20),
    color: Colors.white,
  },
  horz: {
    paddingHorizontal: normalize(15)
  },
  serials: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  font: {
    fontFamily: ff
  },
  model: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row',
    justifyContent: 'space-between',
  },
  notifyNumber: {
    position: 'absolute',
    top: normalize(5),
    left: normalize(15),
    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
  },
  whitecolor: {
    color: '#ffffff',
  },
  models: {
    marginBottom: normalize(12)
  },
  cardView: {
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 10,
    marginVertical: 6,
  },
  serial: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    marginVertical: 10,
  },
  useri: {
    flex: 2,
    flexDirection: 'row'
  },
  cust: {
    marginLeft: normalize(20)
  },
  heading: {
    fontFamily: fontFamily.bold,
    marginTop: normalize(15),
    paddingBottom: normalize(2),
    fontSize: normalize(14),
  },
  outerView1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: normalize(10),
    backgroundColor: Colors.white,
    borderRadius: 50,
    shadowOffset: { height: 2, width: 2 },
    elevation: 2,
    shadowOpacity: 0.5,
    justifyContent: 'space-evenly',
    margin: normalize(20),
    position: 'absolute',
    alignSelf: 'center',
    width: width - 30,
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headcont: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
  },
  main: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    backgroundColor: Colors.white,
  },
  topView: {
    height: normalize(55),
    borderBottomRightRadius: normalize(15),
    borderBottomLeftRadius: normalize(15),
    color: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    paddingRight: normalize(10),
  },
  outerView: {
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    backgroundColor: Colors?.lightGray,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: normalize(40),
    borderBottomRightRadius: normalize(10),
    borderBottomLeftRadius: normalize(10),
  }
});
