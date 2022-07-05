import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Dimensions, FlatList
} from 'react-native';
import HeaderComponents from '../../../components/header';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../../../assets/styles/colors/colors.js';
import {
  BlackMoreOptionIcon,
  CrossIcon,
  SearchIcon,
} from '../../../assets/img/index.js';
import MainHoc from '../../../components/Hoc/index.js';
import { Text } from '../../../components/Text/index.js';
import { strings } from '../../../lib/I18n/index.js';
import { fontFamily, normalize, textSizes } from '../../../lib/globals.js';
import { UserIcon } from '../../../assets/img/index.js';
import PairButton from '../../../components/Button/pairBtn';
import { SerialSearchQRIcon, PlusIcon } from '../../../assets/img/index.js';
import QRCodeUI from '../../screens/JobDetail/PartsAttachments/QRCodeUI';
import RadioButton from '../../../components/RadioButton/index.js';
import SearchBar from '../../../components/SearchBar/index.js';
import { useColors } from '../../../hooks/useColors';
import { Header } from '../../../lib/buildHeader';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import api from '../../../lib/api';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { useDispatch, useSelector } from 'react-redux';
import AddMoreModal from '../JobList/addMore';
import { DataNotFound } from '../../../components/DataNotFound';

const iconWidth = textSizes.h10;
const iconHeight = textSizes.h10;
const ff = fontFamily.semiBold;
const { width, height } = Dimensions.get('screen');

// screen for existing equipments list
const SelectEquipment = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectEquipmentListData, setSelectEquipmentListData] = useState('');
  const [selectEquipListData, setSelectEquipListData] = useState('');
  const dispatch = useDispatch();
  const [emptyMsgEnable, setEmptyMsgEnable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [scroll, setScroll] = useState(false);
  const { colors } = useColors();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const jobEquipmentList = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetJobEquipment,
  );
  const [showQR, setShowQR] = useState(false);
  const isFocused = useIsFocused();

  const toggleShowQR = () => {
    setShowQR(!showQR);
  };

  // qr code scan success function
  const onSuccessQR = (e) => {
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
      setSelectEquipmentListData(selectEquipListData);
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
  useEffect(() => {
    getSelectEquipmentList();
  }, [isFocused]);

  // api for select/existing equipments list
  const getSelectEquipmentList = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (data) => {
          const FiltredData = data?.map((item, index) => {
            let obj = { ...item, selected: false };
            return obj;
          });

          let dublicateRemoveArr = [];
          if (data?.length > 0) {
            data.forEach((item) => {
              if (dublicateRemoveArr.length > 0) {
                let flag = false;
                jobEquipmentList.forEach((val) => {
                  if (
                    val.Brand == item.BrandName &&
                    val.Model == item.Model &&
                    val.SerialNo == item.SerialNo || null &&
                    val.TagNo == item.TagNo || null
                  ) {
                    flag = true;
                  }
                });
                if (!flag) {
                  dublicateRemoveArr.push(item);
                }
              } else {
                dublicateRemoveArr.push(item);
              }
            });
            setSelectEquipmentListData(dublicateRemoveArr);
            setSelectEquipListData(dublicateRemoveArr);
          }
          setEmptyMsgEnable(true);
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&CustomerId=${jobInfo?.CustomerId}`;
      api.selectEquipment('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  useEffect(() => {
    selectEquipmentListData.length > 0 && filterList();
  }, [isFocused]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // The screen is focused
      // Call any action
      selectEquipmentListData.length > 0 && filterList();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const filterList = () => {
    if (jobEquipmentList.length > 0) {
      const SortedData = selectEquipmentListData.map((ele) => {
        return {
          ele: jobEquipmentList.filter((obj) => {
            if (obj.BrandId !== ele.BrandId && obj.ModelId !== ele.ModelId) {
            }
          }),
        };
      });
      setSelectEquipmentListData(SortedData);
    }
  };

  const onPressRadioBtn = (item_index) => {
    const data = selectEquipmentListData?.map((item, index) => {
      if (item_index === index) {
        let obj = { ...item, selected: !item.selected };
        return obj;
      } else {
        return item;
      }
    });
    setSelectEquipmentListData(data);
  };

  //equipment cards render function
  const renderComponent = ({ item, index }) => {
    return (
      <View style={styles.cardView}>
        <View style={styles.row}>
          <View style={{ flex: 0.1 }}>
            <RadioButton
              data={[{ key: item.selected, text: item?.amount }]}
              onPressRadio={() => onPressRadioBtn(index)}
              checked={item.selected}
              color={colors}
            />
          </View>
          <View style={{ flex: 0.9 }}>
            <View
              style={styles.model}>
              <View>
                <View style={styles.model1}>
                  <Text align={'flex-start'}>
                    {strings('Equipments.model_1')}
                  </Text>
                  <Text align={'flex-start'} style={styles.font}>
                    {item?.Model}
                  </Text>
                </View>
                <View style={styles.width}>
                  <Text align={'flex-start'}>{strings('Equipments.gps')}</Text>
                  <Text align={'flex-start'} style={styles.font}>
                    {item?.TagNo == '' || item?.TagNo == null ? `${strings('Equipments.tag')} -`
                      :
                      item?.TagNo.length < 30 ?
                        `${strings('Equipments.tag')} ${item?.TagNo}`
                        :
                        `${strings('Equipments.tag')} ${item?.TagNo.slice(0, 30)}...`}

                    {/* {item?.TagNo} */}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text align={'flex-end'}>{strings('Equipments.brand_1')}</Text>
                <Text align={'flex-end'} style={styles.font}>
                  {item.BrandName}
                </Text>
              </View>
            </View>
            <View
              style={styles.serial}
            />
            <View style={styles.row}>
              <Text align={'flex-start'} style={styles.font}>
                {item.SerialNo == '' || item.SerialNo == null
                  ? `${strings('Equipments.serial')} -` : `${strings('Equipments.serial')}`}
                {item.SerialNo}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // data for api
  const apiPaylaod = (data) => {
    let finalData = [];

    data.map((ele) => {
      let obj = {
        WoEquipmentId: 0,
        CompanyId: parseInt(userInfo?.CompanyId),
        WorkOrderId: jobInfo?.WorkOrderId,
        WoAddressId: jobInfo?.WoAddressId,
        CustomerEquipmentId: ele?.CustomerEquipmentId,
        BrandId: ele?.BrandId,
        Brand: ele?.BrandName,
        ModelId: ele?.ModelId,
        Model: ele?.Model,
        SerialNo: ele?.SerialNo,
        TagNo: ele?.TagNo,
        Description: ele?.Description,
        IsActive: 1,
        InstallationDate: null,
        CreatedBy: 32,
        CreatedDate: null,
        LastChangedBy: 0,
        LastUpdate: null,
        WoJobId: jobInfo?.WoJobId,
        CustomerId: jobInfo?.CustomerId,
        CustAddressId: null,
        ContractStartDate: null,
        ContractEndDate: null,
        ContractTypeId: null,
        ManufactureDate: null,
        WarrantyExpiryDate: null,
        PriorityId: ele?.PriorityId,
        IsContractExpired: null,
        CreatedSourceId: 1,
        UpdatedSourceId: null,
        CreatedSourceLoginId: null,
        UpdatedSourceLoginId: null,
      };
      finalData.push(obj);
    });
    return finalData;
  };

  const handleAddPress = () => {
    const selectedEquipment = selectEquipmentListData.filter((ele) => ele.selected === true);

    if (selectedEquipment.length != 0) {
      onPressAdd(selectedEquipment)
    } else {
      FlashMessageComponent('reject', 'Please Select Equipment')
    }
  }

  // function for existing equipment add
  const onPressAdd = (equipment) => {

    const handleCallback = {
      success: (data) => {

        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        navigation.goBack();
        dispatch({ type: SET_LOADER_FALSE });
      },
      error: (error) => {
        dispatch({ type: SET_LOADER_FALSE });
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : strings('rejectMsg.went_wrong'),
        );
      },
    };

    let data = apiPaylaod(equipment);
    dispatch({ type: SET_LOADER_TRUE });
    const header = Header(token);
    api.saveExistingEquipment(data, handleCallback, header);
  };

  // search function for searching equipment
  const searchAction = () => {
    if (searchQuery.length != 0) {
      const filteredData = selectEquipListData.filter(function (item) {
        const BrandName = item?.BrandName != null ? item?.BrandName.toString().toLowerCase() : '';
        const Model = item?.Model != null ? item?.Model.toString().toLowerCase() : '';
        const SerialNo = item?.SerialNo != null ? item?.SerialNo.toString().toLowerCase() : '';
        const TagNo = item?.TagNo != null ? item?.TagNo.toString().toLowerCase() : '';
        const textData = searchQuery.toString().toLowerCase().trim();
        return (
          BrandName.includes(textData) ||
          Model.includes(textData) ||
          SerialNo.includes(textData) ||
          TagNo.includes(textData)
        );

      });
      setSelectEquipmentListData(filteredData);
    }
    else {
      setSelectEquipmentListData(selectEquipListData);
    }
  };

  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
  };

  return (
    <>
      {!showQR ? (
        <View style={styles.head}>
          <HeaderComponents
            title={strings('SelectEquipment.title')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
            containerStyle={styles.container}
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
              style={[styles.scan, {
                backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
              }]}>
              <View style={[styles.topView, { height: normalize(40) }]}></View>

              <View style={styles.outerView1}>
                <View style={styles.flexView}>
                  <View style={styles.horz}>
                    <TouchableOpacity onPress={() => toggleShowQR()}>
                      <Text>
                        {' '}
                        <SerialSearchQRIcon
                          height={iconHeight}
                          width={iconWidth}
                        />
                        {'   '}
                        {strings('Equipments.scan')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.horz}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('AddNewEquipment', {
                          title: strings('SelectEquipment.Add New Equipment'),
                        });
                      }}>
                      <Text>
                        {' '}
                        <PlusIcon
                          fill={Colors.black}
                          height={iconHeight}
                          width={iconWidth}
                        />
                        {'   '}
                        {strings('Equipments.add_new')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          {scroll === false ? (
            <View>
              <View
                style={{
                  ...styles.topView,
                  backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                }}>
                <View style={styles.title}>
                  <UserIcon
                    height={normalize(30)}
                    width={normalize(23)}
                    style={{ marginLeft: normalize(20) }}
                  />
                  <Text style={styles.TxtStyles}>{jobInfo?.CustomerName} </Text>
                </View>
                <Text style={{ color: 'white' }}> {strings('common.job')} # {jobInfo?.WoJobId}</Text>
              </View>

              <View style={styles.outerView}>
                <TouchableOpacity onPress={() => toggleShowQR()}>
                  <Text>
                    {' '}
                    <SerialSearchQRIcon height={iconHeight} width={iconWidth} />
                    {'   '}
                    {strings('Equipments.scan')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AddNewEquipment', {
                      title: strings('SelectEquipment.Add New Equipment'),
                    });
                  }}>
                  <Text>
                    {' '}
                    <PlusIcon
                      fill={Colors.black}
                      height={iconHeight}
                      width={iconWidth}
                    />
                    {'   '}
                    {strings('Equipments.add_new')}
                  </Text>
                </TouchableOpacity>
              </View>
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
            {selectEquipmentListData.length > 0 ? (
              <>
                <FlatList
                  data={selectEquipmentListData}
                  renderItem={renderComponent}
                  keyExtractor={(item, index) => `${index}`}
                />
              </>
            ) : (
              <View style={styles.emptyMsgStyle}>
                <DataNotFound />
              </View>
            )}
          </ScrollView>
          <View style={styles.btn}>
            <PairButton
              title1={strings('SelectEquipment.Cancel')}
              title2={strings('SelectEquipment.Add')}
              onPressBtn1={() => {
                navigation.goBack();
              }}
              onPressBtn2={() => {
                handleAddPress()
              }}
            />
          </View>
          {showAddMore ? (
            <AddMoreModal
              visibility={showAddMore}
              handleModalVisibility={toggleAddMore}
              txtColor={Colors.white}
              TxtStyle={{ color: Colors.white }}
            />
          ) : null}
          <Loader visibility={isLoading} />
        </View>
      ) : (
        <QRCodeUI
          onSuccess={onSuccessQR}
          onCancel={toggleShowQR}
          onDone={onSuccessQR}
        />
      )}
    </>
  );
};
export default MainHoc(SelectEquipment);

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: 1,
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
  width: {
    width: normalize(200)
  },
  row: {
    flexDirection: 'row'
  },
  scan: {
    marginBottom: normalize(40),
    borderBottomRightRadius: normalize(10),
    borderBottomLeftRadius: normalize(10),
  },
  outerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(15),
    padding: normalize(30),
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
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
  model: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flex: 2,
    flexDirection: 'row',
  },
  head: {
    backgroundColor: '#F9F9F9',
    flex: 1
  },
  flexView: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
    justifyContent: 'space-between',
  },
  model1: {
    marginBottom: normalize(12)
  },
  TxtStyles: {
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(20),
    color: Colors.white,
  },
  btn: {
    backgroundColor: Colors.white,
    padding: normalize(10),
  },
  font: {
    fontFamily: ff
  },
  cardView: {
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    backgroundColor: 'white',
    elevation: 2,
    paddingLeft: 10,
    borderRadius: 10,
    padding: 16,
    marginVertical: 6,
  },
  serial: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    marginVertical: 10,
  },
  heading: {
    fontFamily: fontFamily.bold,
    marginTop: normalize(15),
    paddingBottom: normalize(2),
    fontSize: normalize(14),
  },
  // flexView: {
  //   alignContent: 'flex-start',
  //   flex: 0.5,
  // },
  emptyMsgStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(100),
  },
  horz: {
    paddingHorizontal: normalize(15)
  },
  container: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
  },
});