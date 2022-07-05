import { useRoute } from '@react-navigation/core';
import React, { memo, useEffect, useState } from 'react';

import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  I18nManager
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  AttachmentIcon,
  BlackMoreOptionIcon,
  FilterIcon,
} from '../../../../assets/img';
import { Colors } from '../../../../assets/styles/colors/colors';
import HeaderComponent from '../../../../components/header/index';
import MainHoc from '../../../../components/Hoc';
import Loader from '../../../../components/Loader';
import { Text } from '../../../../components/Text';
import { queryAllRealmObject } from '../../../../database';
import { MASTER_DATA } from '../../../../database/webSetting/masterSchema';
import { useColors } from '../../../../hooks/useColors';
import api from '../../../../lib/api';
import { Header } from '../../../../lib/buildHeader';
import { fontFamily, normalize, textSizes } from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../../redux/auth/types';
import AddMoreModal from '../../JobList/addMore';
import PartsFilterModal from './PartsFilterModal';
import QRCodeUI from './QRCodeUI';
import { DataNotFound } from '../../../../components/DataNotFound';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const SelectPartsCard = memo(({ item, index, colors, allAttchmentList, navigation }) => {

  const filterData = allAttchmentList.filter((ele) => {
    return item?.ModelId == ele?.ModelId;
  });
  return (
    <View
      style={[
        styles.renderItemContainer,
        { marginTop: index == 0 ? normalize(26) : normalize(7) },
      ]}>
      <View style={styles.radioBtnContainer}>
        <View style={styles.radioBtn}>
          <View
            style={[
              styles.radioBtnDotColor,
              {
                backgroundColor: item?.selected
                  ? colors?.PRIMARY_BACKGROUND_COLOR
                  : Colors?.white,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.modalNameContainer}>
          <Text style={styles.labelTxt}>{strings('select_parts.Model')}</Text>
          <Text style={styles.labelTxt}>{strings('select_parts.Brand')}</Text>
        </View>
        <View style={styles.modalNameContainer}>
          <Text style={styles.valueTxt}>{item?.Model}</Text>
          <Text style={styles.valueTxt}>{item?.Brand}</Text>
        </View>
        <View style={styles.modalNameContainer}>
          <Text style={styles.partNameStyle}>{item?.Description}</Text>
        </View>
        <View style={styles.dividerStyles} />
        <View style={[styles.modalNameContainer, { marginTop: normalize(8) }]}>
          <Text style={styles.valueTxt}>
          {strings('select_parts.Part_#')}  {item?.PartNo}
            </Text>
          {filterData.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EquipmentAttachment', {
                  attachmentData: filterData,
                  screenName: 'Part Attachment'
                })
              }>
              <AttachmentIcon
                style={{...styles.userImage, marginRight: normalize(5)}}
                color={Colors?.secondryBlack}
                height={normalize(18)}
                width={normalize(17.43)}
              />
              <>
                <View style={[styles.notifyNumber, { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR }]}>
                  <Text style={styles.whitecolor}>
                    {filterData.length}
                  </Text>
                </View>
              </>

            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
});

const SelectParts = ({ navigation }) => {
  const route = useRoute();
  const { setSelectPartsFromList, jobId } = route?.params;
  const [partsList, setPartsList] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const { colors } = useColors();

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const toggleShowMoreOpt = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const headerRightIcons = [
    { name: FilterIcon, onPress: toggleFilter },
    {
      name: BlackMoreOptionIcon,
      onPress: toggleShowMoreOpt,
    },
  ];

  const handelSelection = (selectedIndex) => {
    try {
      const reqData = partsList?.map((item, index) => {
        if (index == selectedIndex) {
          return {
            ...item,
            selected: !item?.selected,
          };
        }
        return { ...item };
      });
      setPartsList(reqData);
    } catch (error) {
      console.log(error);
    }
  };

  const getSelectedData = () => {
    try {
      const selectedData = partsList?.filter((item) => item?.selected == true);
      setSelectedParts(selectedData);
      setSelectPartsFromList(selectedData);
    } catch (error) {
    }
  };

  useEffect(() => {
    getSelectedData();
  }, [partsList]);

  useEffect(() => {
    selectedParts?.length > 0 ? navigation.goBack() : null;
  }, [selectedParts]);

  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const getPartsLookupList = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (partsLookupListRes) => {
          setPartsList(partsLookupListRes?.PartLookupLists);
          dispatch({ type: SET_LOADER_FALSE });
          setMessage('No Parts Found');

        },
        error: (lookUpError) => {
          dispatch({ type: SET_LOADER_FALSE });
          setMessage('No Parts Found');
        },
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}`;
      let headers = Header(token);
      api.getPartsLookupList('', handleCallback, headers, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
      setMessage('No Parts Found');
    }
  };

  useEffect(() => {
    getPartsLookupList();
  }, []);

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const [brandList, setBrandList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState({});
  const [description, setDescription] = useState('');
  const [partNo, setPartNo] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [allAttchmentList, setAllAttchmentList] = useState([]);

  const toggleShowQR = () => {
    setShowQRScanner(!showQRScanner);
  };
  useEffect(() => {
    getEquipmentAttachmentList();
  }, []);

  const getEquipmentAttachmentList = () => {
    try {
      const data = {
        CompanyId: userInfo?.CompanyId,
        JobId: [jobId],
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
  const fetchDataRealm = () => {
    try {
      queryAllRealmObject(MASTER_DATA)
        .then((data) => {
          const res = data[0];
          const partsBrandList = res?.BrandLists?.map((item) => {
            return {
              id: item?.BrandId,
              label: item?.Brand,
              value: item?.Brand,
            };
          });
          setBrandList(partsBrandList);
          const partsModalList = res?.ModelLists?.map((item) => {
            return {
              id: item?.ModelId,
              label: item?.Model,
              value: item?.Model,
            };
          });
          setModelList(partsModalList);
        })
        .catch((error) => console.log(error));
    } catch (error) { }
  };

  //api function to get part look up list
  const onApplyFilter = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (partsLookupListRes) => {
          setPartsList(partsLookupListRes?.PartLookupLists);
          dispatch({ type: SET_LOADER_FALSE });
          setMessage('No Parts Found');
        },
        error: (lookUpError) => {
          dispatch({ type: SET_LOADER_FALSE });
          setMessage('No Parts Found');
        },
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&BrandId=${selectedBrand?.id}&ModelId=${selectedModel?.id}&PartNo=${partNo}&Description=${description}`;
      let headers = Header(token);
      api.getPartsLookupList('', handleCallback, headers, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
      setMessage('No Parts Found');
    }
  };

  const keyExtractor = (item, index) => `ID-${index}`;

  const onSuccess = (data) => {
    try {
      data ? setPartNo(`${data?.data}`)
        : (Alert.alert(`Part not found`))
    } catch (error) {
      toggleFilter();
      Alert.alert(`Something went wrong`);
    }
    toggleShowQR();
  };

  //function for ui of parts card
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handelSelection(index)}>
        <SelectPartsCard
          item={item}
          index={index}
          key={`ID-${index}`}
          colors={colors}
          allAttchmentList={allAttchmentList}
          navigation={navigation}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {showQRScanner ? (
        <QRCodeUI
          onSuccess={onSuccess}
          onDone={onSuccess}
          onCancel={toggleShowQR}
        />
      ) : (
        <>
          <HeaderComponent
            title={strings('select_parts.title')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
          {partsList?.length > 0 ? (
            <View style={styles.container}>
              <FlatList
                data={partsList}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                maxToRenderPerBatch={5}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.noDataTxtContainer}>
              {message != '' &&
                <DataNotFound />
              }
            </View>
          )}
          {showFilter ? (
            <PartsFilterModal
              handleModalVisibility={toggleFilter}
              visibility={showFilter}
              title={strings('PartsFilterModal.Filter_By')}
              modelList={modelList}
              brandList={brandList}
              handleBrandSelection={setSelectedBrand}
              handleModelSelection={setSelectedModel}
              selectedBrand={selectedBrand}
              selectedModel={selectedModel}
              description={description}
              onChangeDescription={setDescription}
              partNo={partNo}
              onPartNoChange={setPartNo}
              onApplyFilter={onApplyFilter}
              openScan={toggleShowQR}
            />
          ) : null}
          <Loader visibility={isLoading} />
          {showMoreOptions ? (
            <AddMoreModal
              visibility={showMoreOptions}
              handleModalVisibility={toggleShowMoreOpt}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export default MainHoc(SelectParts);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.appGray,
    paddingHorizontal: normalize(12),
  },
  renderItemContainer: {
    flexDirection: 'row',
    elevation: 4,
    backgroundColor: Colors?.white,
    padding: normalize(14),
    borderRadius: normalize(6),
    marginHorizontal: normalize(2),
    marginBottom: normalize(10),
    shadowColor: Colors?.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3.3,

  },
  radioBtnContainer: {
    flex: 0.13,
  },
  detailContainer: {
    flex: 0.87,
  },
  modalNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueTxt: {
    fontSize: normalize(14),
    fontFamily: fontFamily.semiBold,
  },
  labelTxt: {
    fontSize: normalize(13),

  },
  partNameStyle: {
    fontSize: normalize(16),
    marginTop: normalize(16),
    alignSelf: 'flex-start',
  },
  dividerStyles: {
    borderWidth: normalize(1),
    borderColor: Colors?.deviderBorder,
    marginTop: normalize(10),
  },
  radioBtn: {
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(18 / 2),
    borderWidth: normalize(1),
    borderColor: Colors?.greyBtnBorder,
    justifyContent: 'center',
    alignItems: 'center',

  },
  radioBtnDotColor: {
    height: normalize(13),
    width: normalize(13),
    borderRadius: normalize(13 / 2),
  },
  headerStyles: {
    flex: 1,
    fontSize: normalize(19),
    fontFamily: fontFamily.semiBold,

  },
  noDataTxt: {
    fontSize: textSizes.h10,
  },
  noDataTxtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
    flex: 1,
  },
  notifyNumber: {
    position: 'absolute',
    top: normalize(0),
    left: normalize(10),
    backgroundColor: '#17499E',
    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  whitecolor: {
    color: '#ffffff',
  },
});
