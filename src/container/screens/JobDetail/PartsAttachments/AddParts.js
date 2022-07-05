import React, { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fontFamily,
  normalize,
  textSizes,
  dateFormat,
  convertFrom12To24Format,
} from '../../../../lib/globals';
import { useColors } from '../../../../hooks/useColors';
import { Colors } from '../../../../assets/styles/colors/colors';
import MainHoc from '../../../../components/Hoc';
import HeaderComponent from '../../../../components/header';
import { Input } from '../../../../components/Input';
import { ANT_DESIGN } from '../../../../util/iconTypes';
import { Dropdown } from '../../../../components/Dropdown';
import {
  AddPartsCalenderIcon,
  BlackDeleteIconSerialNo,
  BlackMoreOptionIcon,
  PartClockIcon,
  PartsQuantityIcon,
} from '../../../../assets/img';
import { SerialSearchQRIcon, SerialSearchIcon } from '../../../../assets/img';
import MultiButton from '../../../../components/MultiButton';
import CheckBox from '../../../../components/CheckBox';
import DatePickerModal from './DatePickerModal';
import SerialNoSearchModal from './SerialNoSearchModal';
import { Icon } from '../../../../components/Icon';
import { useRoute } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../../lib/api';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../../redux/auth/types';
import { Header } from '../../../../lib/buildHeader';
import AddMoreModal from '../../JobList/addMore';
import QRCodeUI from './QRCodeUI';
import { queryAllRealmObject } from '../../../../database';
import { MASTER_DATA } from '../../../../database/webSetting/masterSchema';
import { FlashMessageComponent } from '../../../../components/FlashMessge';
import { strings } from '../../../../lib/I18n';
import moment from 'moment';
import Loader from '../../../../components/Loader';
import ConfirmationModal from '../../../../components/ConfirmationModal';

const AddParts = ({ navigation }) => {
  const dataType = [
    {
      id: 1,
      title: 'Normal',
      selected: true,
    },
    {
      id: 2,
      title: 'OEM',
      selected: false,
    },
    {
      id: 3,
      title: 'BOQ',
      selected: false,
    },
  ];

  const route = useRoute();
  const {
    partsData,
    partsType,
    edit,
    jobId,
    technicianJobInformation,
    woJobDetails,
    getWorkOrderAppointment,
  } = route?.params;
  const { colors } = useColors();
  const [typeData, setTypeData] = useState(dataType);
  const [selectedTypeData, setSelectedTypeData] = useState(dataType[1]);
  const [quantity, setQuantity] = useState('1');
  const [requestType, setRequestType] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [dropPoint, setDropPoint] = useState('');
  const [noteOne, setNoteOne] = useState('');
  const [order, setOrder] = useState('');
  const [shipVia, setShipVia] = useState('');
  const [tracking, setTracking] = useState('');
  const [rma, setRma] = useState('');
  const [rmaTracking, setRmaTracking] = useState('');
  const [noteTwo, setNoteTwo] = useState('');
  const [showShippingDate, setShowShippingDate] = useState(false);
  const [showETADate, setShowETADate] = useState(false);
  const [shippingDate, setShippingDate] = useState('');
  const [ETADate, setETADate] = useState('');
  const [RMADate, setRMADate] = useState('');
  const [showRMADate, setShowRMADate] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [ETATime, setEtaTime] = useState('');
  const [showETATime, setShowETATime] = useState(false);
  const [requestTypeData, setRequestTypeData] = useState([]);
  const [wareHouseData, setWareHouseData] = useState([]);
  const [serialNoResData, setserialNoData] = useState([]);
  const [dummyserialNoData, setDummyserialNoData] = useState([]);
  const [serialNoArray, setserialNoArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState('');
  const [selectPartsFromList, setSelectPartsFromList] = useState([]);
  const [data1, setData1] = useState('');
  const [serialCallBackData, setserialCallBackData] = useState([]);
  const [deleteSerial, setDeleteSerial] = useState(false);
  const [editTime, setEditTime] = useState('');
  const [showModal, setModal] = useState(false);
  const jobInformaaitions = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  const setInitialValues = () => {
    try {
      if (partsData?.IsBOQRequest) {
        const partsTypeList = typeData?.map((value, index) => {
          if (value?.title == 'BOQ') {
            return {
              ...value,
              selected: true,
              disabled: false,
            };
          }
          return {
            ...value,
            selected: false,
            disabled: true,
          };
        });
        setTypeData(partsTypeList);
      } else if (partsData?.OEM) {
        const partsTypeList = typeData?.map((value, index) => {
          if (value?.title == 'OEM') {
            return {
              ...value,
              selected: true,
              disabled: false,
            };
          }
          return {
            ...value,
            selected: false,
            disabled: true,
          };
        });
        setTypeData(partsTypeList);
      } else {
        const partsTypeList = typeData?.map((value, index) => {
          if (value?.title == 'Normal') {
            return {
              ...value,
              selected: true,
              disabled: false,
            };
          }
          return {
            ...value,
            selected: false,
            disabled: true,
          };
        });
        setTypeData(partsTypeList);
      }
    } catch (error) { }
  };

  useEffect(() => {
    edit ? setInitialValues() : null;
  }, [route]);

  const fetchDataRealm = () => {
    try {
      queryAllRealmObject(MASTER_DATA).then((data) => {
        const res = data[0];
        const reqType = res?.RequestType?.map((item, index) => {
          return {
            id: item?.OEMPartReqTypeId,
            label: item?.OEMPartReqType,
            value: item?.OEMPartReqType,
          };
        });
        setRequestTypeData(reqType);
      });
    } catch (error) { }
  };
  useEffect(() => {
    fetchDataRealm();
  }, []);
  const resetvaluess = () => {
    if (edit) {
      setLoading(true);
      let shippingDate = moment(selectPartsFromList[0]?.ShippingDate).format(
        'L',
      );
      let etaDatefrmt = moment(selectPartsFromList[0]?.ETADate).format('L');

      const formatedDatesd = dateFormat(etaDatefrmt, 'YYYY-MM-DD');

      let rmaDate = moment(selectPartsFromList[0]?.RMAShippingDate).format('L');

      try {
        const endpoint =
          technicianJobInformation?.VendorId == undefined || null
            ? `?CompanyId=${userInfo?.CompanyId}&PartRequestId=${partsData?.PartRequestId}&VendorId=null`
            : `?CompanyId=${userInfo?.CompanyId}&PartRequestId=${partsData?.PartRequestId}&VendorId=null`;

        const handleCallback = {
          success: (editRequest) => {
            let data = [];
            data[0] = editRequest;
            setSelectPartsFromList(data);
            const autoReqType = requestTypeData.filter(
              (data) => data.id == editRequest?.OEMPartReqTypeId,
            );
            setRequestType(autoReqType[0]);
            setserialCallBackData(editRequest?.SerialNo)
            setQuantity('' + editRequest.RequestedQty);
            setDropPoint(
              editRequest?.DropPoint == '' ? '' : editRequest?.DropPoint,
            );
            setNoteOne(
              editRequest?.PartNotes == '' ? '' : editRequest?.PartNotes,
            );
            var dummyyshipingD = editRequest?.ShippingDate?.split('T');
            var tempshipingDate = moment(dummyyshipingD[0]).isSame(
              '1900-01-01',
            );
            if (tempshipingDate) {
              setShippingDate('');
            } else {
              setShippingDate(
                editRequest?.ShippingDate != undefined || null
                  ? shippingDate
                  : '',
              );
            }
            setOrder(
              editRequest?.OrderNo != '' || undefined || null
                ? editRequest?.OrderNo
                : '',
            );
            setShipVia(editRequest?.ShipVia != '' ? editRequest?.ShipVia : '');
            setTracking(
              editRequest?.TrackingNo != '' ? editRequest?.TrackingNo : '',
            );
            var dummyEtaDate = editRequest?.ETADate.split('T');
            var tempEtaDate = moment(dummyEtaDate[0]).isSame('1900-01-01');
            if (tempEtaDate) {
              setETADate('');
            } else {
              setETADate(editRequest?.ETADate != null ? formatedDatesd : '');
            }
            const etaTimes = moment(editRequest?.ETATime).format();
            setEditTime(etaTimes);
            const times = moment(etaTimes).format('LT');
            if (tempEtaDate && times == '6:30 AM') {
              setEtaTime('');
            } else {
              if (editRequest?.ETATime == '4/6/2022 6:30:00 AM') {
                setEtaTime('')
              } else {
                setEtaTime(editRequest?.ETATime != null ? times : '');
              }
            }
            if (editRequest?.ETATime == '4/6/2022 6:30:00 AM') {
              setEtaTime('')
            }
            setRma(editRequest?.RMANo == '' ? '' : editRequest?.RMANo);
            setRmaTracking(
              editRequest?.RMATrackingNo == '' || null
                ? ''
                : editRequest?.RMATrackingNo,
            );
            var dummyRmaDate = rmaDate?.split('/').reverse().join('-');
            var tempRmaDate = moment(dummyRmaDate).isSame('1900-01-01');
            if (tempRmaDate) {
              setRMADate('');
            } else {
              setRMADate(editRequest?.RMAShippingDate != null ? rmaDate : '');
            }
            setNoteTwo(
              editRequest?.RMANotes == '' ? '' : editRequest?.RMANotes,
            );
            setCheckboxValue(editRequest.IsCoreReturn == 0 ? false : true);
            let req = OEMPartReqTypeId == 1 ? 'Normal' : 'Quick Response';
            setRequestType(OEMPartReqTypeId == 1 ? 'Normal' : 'Quick Response');
            setLoading(false);
          },
          error: (editRequest) => {
            setLoading(false);
          },
        };
        const header = Header(token);
        api.getJobeditdata('', handleCallback, header, endpoint);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    resetvaluess();
    setTimeout(() => {
      setData1('data');
    }, 1000);
    resetvaluess();
  }, [data1]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetvaluess();
      setTimeout(() => {
        setData1('data');
      }, 1000);
      resetvaluess();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, data1]);

  const getWarehouseData = () => {
    try {
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WoJobId=${technicianJobInformation?.WoJobId}`;
      const handleCallback = {
        success: (warehouseRes) => {
          setWareHouseData(warehouseRes);
        },
        error: (warehouseError) => { },
      };
      const header = Header(token);
      api.getPartsWarehouse('', handleCallback, header, endPoint);
    } catch (error) { }
  };

  useEffect(() => {
    getWarehouseData();
  }, []);

  useEffect(() => { }, [requestType]);

  const toggleETATime = () => {
    setShowETATime(!showETATime);
  };

  const toggleSearchModal = () => {
    setSearchModal(!searchModal);
  };

  const toggleRMADate = () => {
    setShowRMADate(!showRMADate);
  };

  const toggleShippingDate = () => {
    setShowShippingDate(!showShippingDate);
  };

  const toggleDelete = () => {
    setDeleteSerial(!deleteSerial);
  };

  const toggleETADate = () => {
    setShowETADate(!showETADate);
  };

  const incrementQuantity = () => {
    try {
      setQuantity((prevCount) => {
        const val = parseInt(prevCount) + 1;
        return val.toString();
      });
    } catch (error) { }
    getPartWareHouseQuantityApi();
  };

  const decrementQuantity = () => {
    try {
      setQuantity((prevCount) => {
        if (parseInt(prevCount) > 1) {
          getPartWareHouseQuantityApi();
        }
        const val =
          parseInt(prevCount) > 1 ? parseInt(prevCount) - 1 : prevCount;
        return val.toString();
      });
    } catch (error) { }
  };

  const handleDataTypeOnPress = (selectedIndex) => {
    try {
      const reqData = typeData?.map((data, index) => {
        if (index == selectedIndex) {
          return {
            ...data,
            selected: true,
            disabled: false,
          };
        }
        return { ...data, selected: false, disabled: false };
      });
      setTypeData(reqData);
    } catch (error) { }
  };

  const getSelectedData = () => {
    try {
      const selectedData = typeData?.filter((data) => data?.selected == true);
      setSelectedTypeData(selectedData[0]);
    } catch (error) { }
  };

  useEffect(() => {
    getSelectedData();
  }, [typeData]);

  const DataTypeRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleDataTypeOnPress(index)}
        style={[
          styles?.dataTypeItemContainer,
          {
            backgroundColor: item?.selected
              ? colors?.PRIMARY_BACKGROUND_COLOR
              : Colors.white,
            borderColor: item?.disabled
              ? Colors?.borderGrey
              : colors?.PRIMARY_BACKGROUND_COLOR,
          },
        ]}
        disabled={item?.disabled || item?.selected}>
        {item?.selected ? (
          <View style={styles.dotStyles} />
        ) : (
          <View style={[styles.dotStyles, { backgroundColor: Colors?.white }]} />
        )}

        <Text
          style={[
            styles?.dataTypeTextStyle,
            {
              color: item?.selected
                ? Colors?.white
                : item?.disabled
                  ? Colors?.borderGrey
                  : colors?.PRIMARY_BACKGROUND_COLOR,
            },
          ]}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const LabelComponents = ({ label, required = true }) => {

    return (
      <Text style={styles.star}>
        {required ? '* ' : ''}
        <Text style={{ color: Colors?.secondryBlack }}>{label}</Text>
      </Text>
      // </View>
    );
  };

  const QuantityController = ({ title, action }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.quantityControlerBtn}
        onPress={action}>
        <Text
          style={[
            styles.quantityControlerTxt,
            { color: colors?.PRIMARY_BACKGROUND_COLOR },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    let difference = getDifference(dummyserialNoData, serialCallBackData)
    setserialNoData(difference)
  },[serialCallBackData])

  function getDifference(array1, array2) {
    return array1.filter(object1 => {
      return !array2.some(object2 => {
        return object1?.SerialNo == object2?.SerialNo;
      });
    });
  }

  const deleteSerialNo = (selectedIndex, data) => {
    const reqData = serialCallBackData.filter(
      (item, index) => index != selectedIndex,
    );
    setserialCallBackData(reqData);
  };

  // selected serial render item
  const SerialNoRenderItem = ({ item, index }) => {
    const expDate = item?.ExpiryDate != null && item?.ExpiryDate != "" ?
      item?.ExpiryDate?.split('-') : ''
    return (
      <>
        <View style={styles.serialRenderItem}>
          <Text style={{ fontSize: normalize(13) }}>{item?.SerialNo}</Text>
          {expDate != '' ?
            <Text style={{ fontSize: normalize(13) }}>{expDate[2]?.split('T')[0] + '/' + expDate[1] + '/' + expDate[0]}</Text>
            : null}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ padding: normalize(10) }}
            onPress={() => toggleDelete()}>
            <BlackDeleteIconSerialNo
              height={normalize(17)}
              width={normalize(13)}
            />
          </TouchableOpacity>
        </View>
        {deleteSerial ? (
          <ConfirmationModal
            title={strings('confirmation_modal.title')}
            discription={strings('confirmation_modal.Delete_Discription')}
            handleModalVisibility={toggleDelete}
            visibility={deleteSerial}
            handleConfirm={() => {
              toggleDelete(), deleteSerialNo(index, item);
            }}
          />
        ) : null}
      </>
    );
  };

  const HeaderText = ({ title }) => {
    return (
      <View style={styles.headerTxtContainer}>
        <Text style={{ fontFamily: fontFamily.bold, fontSize: normalize(16) }}>
          {title}
        </Text>
      </View>
    );
  };

  //buttons array
  const buttons = [
    {
      btnName: strings('pair_button.cancel'),
      onPress: () => handleCancel(),
      btnTxtStyles: styles.cancelBtnTxt,
      btnStyles: { backgroundColor: Colors?.silver },
    },
    {
      btnName: edit ? strings('pair_button.update') : strings('pair_button.add'),
      onPress: () => handleSave(),
      btnTxtStyles: styles.addBtnTxt,
      btnStyles: { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
    },
  ];

  const handleCancel = () => {
    try {
      Keyboard.dismiss();
      navigation?.goBack();
    } catch (error) { }
  };

  const searchButton = () => {
    toggleSearchModal()
  }

  //** function for data based on the type of part as normal/boq/oem */
  const getDataBasedOnType = () => {
    let data = {};
    let partReqId =
      partsData?.PartRequestId != undefined ? partsData?.PartRequestId : 0;
    if (selectedTypeData?.title == 'Normal') {
      data = {
        CompanyId: userInfo?.CompanyId,
        WorkOrderId: jobInformaaitions?.WorkOrderId,
        JobId: jobInformaaitions?.WoJobId,
        PartRequestId: edit ? partReqId : null,
        PartId:
          selectPartsFromList.length > 0
            ? selectPartsFromList[0]?.PartId
            : null,
        ReqQty: parseInt(quantity),
        PartNotes: noteOne,
        IsOEM: 0,
        IsCoreReturn: 0,
        OEMName: 'OEM Name API',
        OrderNo: 'Ord No 101',
        ShipVia: 'Ship No 1000',
        ShippingDate: '2021-11-25T00:00:00',
        TrackingNo: '99526',
        ETADate: '2021-11-27T00:00:00',
        ETATime: '2021-11-25T12:15:00.000Z',
        RMANo: ' RMA from API',
        RMATrackingNo: '',
        RMAShippingDate: null,
        RMANotes: '',
        WhId: wareHouseData[0]?.WarehouseId,
        IsSerialized: 0,
        loginid: userInfo?.sub,
        SerialNo: serialCallBackData,
        RequestStatusId: null,
        PartOEM: null,
        SourceID: 2,
        CreatedBy: 32,
        LastChangedBy: null,
        CoreReturnStatusID: null,
        CoreReturnNotes: '',
        partPricing: {
          WoPartPriceId: 0,
          CompanyId: 0,
          WoJobId: 0,
          PartRequestId: null,
          PriceTypeId: 270,
          Qty: parseInt(quantity),
          UnitPrice: selectPartsFromList[0]?.UnitPrice,
          Description: selectPartsFromList[0]?.Description,
          DiscountTypeId: 80,
          Discount: 0,
          TaskNo: 0,
          CreatedBy: getWorkOrderAppointment?.CreatedBy,
          CreatedDate: getWorkOrderAppointment?.CreatedDate,
          LastChangedBy: getWorkOrderAppointment?.LastChangedBy,
          LastUpdate: getWorkOrderAppointment?.LastUpdate,
          CreatedSourceId: null,
          UpdatedSourceId: null,
          TaxTypeId: selectPartsFromList[0]?.TaxTypeId,
          TaxIdGroupId: selectPartsFromList[0]?.TaxIdGroupId,
          Tax: null,
          TaxPercent: 0,
        },
        DropPoint: '',
        OEMPartReqTypeId: requestType?.id,
        ReceivedOn: null,
        Attachement: null,
        IsBOQRequest: null,
        VendorId: null,
        BrandId: null,
        ModelId: null,
        MovingCost: 0,
      };
    } else if (selectedTypeData?.title == 'OEM') {
      const formatedDates =
        ETADate != '' ? ETADate?.split('/').reverse().join('-') : null;

      const ShDates =
        shippingDate != ''
          ? dateFormat(shippingDate, 'YYYY-MM-DD')
          : null;

      const formatedRmaDates =
        RMADate != '' ? RMADate?.split('/').reverse().join('-') : null;

      const tConverter =
        ETATime != '' ? convertFrom12To24Format(ETATime) : null;
      const etaDateTime = `${formatedDates}T${tConverter}:00.000Z`;

      data = {
        CompanyId: userInfo?.CompanyId,
        WorkOrderId: jobInformaaitions?.WorkOrderId,
        JobId: jobInformaaitions?.WoJobId,
        PartRequestId: edit ? partReqId : null,
        PartId:
          selectPartsFromList.length > 0
            ? selectPartsFromList[0]?.PartId
            : null,
        ReqQty: parseInt(quantity),
        PartNotes: noteOne,
        IsOEM: 1,
        IsCoreReturn: 0,
        OEMName: 'OEM Name API',
        OrderNo: order,
        ShipVia: shipVia,
        ShippingDate: ShDates == null ? null : `${ShDates}T00:00:00`,
        TrackingNo: tracking,
        ETADate: formatedDates == null ? null : `${formatedDates}T00:00:00`,
        ETATime: tConverter == null ? null : etaDateTime,
        RMANo: rma,
        RMATrackingNo: rmaTracking,
        RMAShippingDate: formatedRmaDates == null ? null : formatedRmaDates,
        RMANotes: noteTwo,
        WhId: wareHouseData[0]?.WarehouseId
          ? wareHouseData[0]?.WarehouseId
          : null,
        IsSerialized: selectPartsFromList[0]?.IsSerialized,
        loginid: userInfo?.sub,
        SerialNo: [],
        RequestStatusId: edit ? partsData?.PartReqStatusId : null,
        PartOEM: null,
        SourceID: 2,
        CreatedBy: jobInformaaitions?.CreatedBy,
        LastChangedBy: null,
        CoreReturnStatusID: null,
        CoreReturnNotes: '',
        partPricing: {
          WoPartPriceId: 0,
          CompanyId: 0,
          WoJobId: 0,
          PartRequestId: null,
          PriceTypeId: 270,
          Qty: parseInt(quantity),
          UnitPrice: selectPartsFromList[0]?.UnitPrice,
          Description: selectPartsFromList[0]?.Description,
          DiscountTypeId: 80,
          Discount: 0,
          TaskNo: 0,
          CreatedBy: getWorkOrderAppointment?.CreatedBy,
          CreatedDate: getWorkOrderAppointment?.CreatedDate,
          LastChangedBy: getWorkOrderAppointment?.LastChangedBy,
          LastUpdate: getWorkOrderAppointment?.LastUpdate,
          CreatedSourceId: null,
          UpdatedSourceId: null,
          TaxTypeId: selectPartsFromList[0]?.TaxTypeId,
          TaxIdGroupId: selectPartsFromList[0]?.TaxIdGroupId,
          Tax: null,
          TaxPercent: 0,
        },
        DropPoint: dropPoint,
        OEMPartReqTypeId: requestType?.id,
        ReceivedOn: null,
        Attachement: null,
        IsBOQRequest: null,
        VendorId: null,
        BrandId: selectPartsFromList[0]?.BrandId,
        ModelId: selectPartsFromList[0]?.ModelId,
        MovingCost: selectPartsFromList[0]?.MovingCost
          ? selectPartsFromList[0]?.MovingCost
          : 0,
      };
      
    } else if (selectedTypeData?.title == 'BOQ') {
      data = {
        PartRequestId: edit ? partsData?.PartRequestId : 0,
        CompanyId: userInfo?.CompanyId,
        WorkOrderId: technicianJobInformation?.WorkOrderId,
        JobId: jobId,
        ReqQty: parseInt(quantity),
        PartNotes: noteOne,
        loginid: userInfo?.sub,
        RequestStatusId: edit ? partsData?.PartReqStatusId : 1,
        SourceID: 2,
        CreatedBy: technicianJobInformation?.CreatedBy,
        LastChangedBy: null,
        IsBOQRequest: 1,
        VendorId: technicianJobInformation?.VendorId,
        BrandId: selectPartsFromList[0]?.BrandId,
        ModelId: selectPartsFromList[0]?.ModelId,
        PartId: selectPartsFromList[0]?.PartId,
        Price: selectPartsFromList[0]?.UnitPrice,
        ApprovalStatusId: edit ? partsData?.ApprovalStatusId : null,
        WoPartPriceId: 0,
        ApprovedQty: null,
        WarrantyMonths: null,
        InstalledDate: null,
        BOQTechId: null,
      };
    }
    return data;
  };

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const [searchQuery, setSearchQuery] = useState('');

  const serialChangeTxt = (item) => {
    setSearchQuery(item);
    if (item == '') {
      setDummyserialNoData([...serialNoArray]);
      setserialNoData([...serialNoArray]);
    }
  };

  //function to find serial number
  const searchAction = () => {
    if (searchQuery) {
      const filteredData = dummyserialNoData.filter(function (item) {
        let data = item?.SerialNo
        const res = data?.includes(searchQuery)
        if (res) {
          return item;
        }
      });
      setserialNoData(filteredData);
    }
    else {
      setserialNoData(serialNoResData)
    }
  };

  const dispatch = useDispatch();

  // function for add and update normal/boq/oem part request
  const handleSave = () => {
    try {
      if(quantity >= 1){
      if (selectedTypeData?.title == 'BOQ') {
        const data = getDataBasedOnType();
        selectPartsFromList?.length > 0
          ? quantity > wareHouseQuantity
            ? setModal(true)
            : handleBOQReguest(data)
          : FlashMessageComponent(
            'warning',
            strings('add_part.Please_select_parts'),
          );
      } else {
        if (
          selectPartsFromList.length > 0 &&
          selectPartsFromList != undefined
        ) {
          const data = getDataBasedOnType();
          quantity > wareHouseQuantity
            ? setModal(true)
            : addUpdateNormalOEM(data);
        } else {
          FlashMessageComponent(
            'warning',
            strings('add_part.Please_select_parts'),
          );
        }
      }
    }else{
      FlashMessageComponent('warning', strings('Quantity.Fill_proper_quantity'));
      }
    } catch (error) { }
  };

  // function for add and update boq part request over api
  const handleBOQReguest = (data) => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (data) => {
          dispatch({ type: SET_LOADER_FALSE });
          if (data?.PoErrorCode) {
            const msgCode = data?.PoErrorCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('reject', msgCode);
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
          }
          setTimeout(() => {
            navigation?.goBack();
          }, 1000);
        },
        error: (BOQErr) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      api.updateInsertBOQParts(data, handleCallback, header);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  // function for add update normal and oem over api
  const addUpdateNormalOEM = (data) => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (data) => {
          dispatch({ type: SET_LOADER_FALSE });
          if (data?.PoErrorCode) {
            const msgCode = data?.PoErrorCode;
            if (msgCode.length > 5) {
              FlashMessageComponent(
                'reject',
                strings(`Response_code.${msgCode}`),
              );
            } else if (msgCode.charAt(0) === '9') {
              FlashMessageComponent('success', strings('flashmessage.Part_added_sucessfully'));
              setTimeout(() => {
                navigation?.goBack();
              }, 1200);
            } else {
              FlashMessageComponent(
                'reject',
                strings(`Response_code.${msgCode}`),
              );
            }
          }
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
      let headers = Header(token);
      api.addPartRequest(data, handleCallback, headers);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const toggleShowMoreOpt = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];

  const [showQR, setShowQR] = useState(false);

  const toggleShowQR = () => {
    setShowQR(!showQR);
  };

  //functtion for on successful scan of qr code
  const onSuccess = (e) => {
    try {
      e
        ? (addScan(),setScan(e?.data))
        : (Alert.alert(`This serial number does not match with you inventor`))
    } catch (error) {
      Alert.alert(`Something Went Wrong !!`);
    }
    setShowQR(!showQR);
  };

  //validation alert message for serial number not in inventory
  const addScan = () => {
    if (scan != null && scan != '') {
      var serialNoArrays = serialNoResData?.filter((ele) => ele?.SerialNo == scan)
      if (serialNoArrays.length > 0) {
        let data = {
          serialnoDataList: serialNoArrays,
        };
        onPressFilter(data)
      } else {
        Alert.alert(`This serial number does not match with you inventory.`);
      }
    } 
    else {
      Alert.alert(`This serial number does not match with you inventory.`);
    }
  }

  const onConfirmModal = () => {
    setModal(false);
    if (selectedTypeData?.title == 'BOQ') {
      const data = getDataBasedOnType();
      handleBOQReguest(data);
    } else {
      const data = getDataBasedOnType();
      addUpdateNormalOEM(data);
    }
  };
  useEffect(() => {
    (selectPartsFromList?.length > 0) && getSerialNo();
  }, [selectPartsFromList]);

  //api function to get serial number on particular part
  const getSerialNo = () => {
    try {
      const handleCallback = {
        success: (serialNoRes) => {
          setserialNoData(serialNoRes?.SerialNumbers);
          setDummyserialNoData(serialNoRes?.SerialNumbers);
          setserialNoArray(serialNoRes?.SerialNumbers);
        },
        error: (serialNoError) => { },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&PartId=${selectPartsFromList[0]?.PartId}&WhId=${wareHouseData[0]?.WarehouseId}`;
      api.getSerialNo([], handleCallback, header, endPoint);
    } catch (error) { }
  };
  const [wareHouseQuantity, setWareHouseQuantity] = useState(0);

  //api function to get warehouse quantity number on particular part & warehouseId
  const getPartWareHouseQuantityApi = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });

      const handleCallback = {
        success: (data) => {
          const msgCode = data?.Message?.MessageCode;
          setWareHouseQuantity(data?.count);
          dispatch({ type: SET_LOADER_FALSE });
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
      const endPoint = `?CompanyId=${416}&PartId=${selectPartsFromList?.length > 0 ? selectPartsFromList[0]?.PartId : null
        }&WarehouseId=${wareHouseData ? wareHouseData[0]?.WarehouseId : null}`;
      api.getPartWareHouseQuantity('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  useEffect(() => {
    if (selectPartsFromList?.length > 0) {
      getPartWareHouseQuantityApi();
    }
  }, [selectPartsFromList]);

  const onPressFilter = (data) => {
    setSearchModal(false);
    const arr = [...serialCallBackData];
    const finaldata = arr.concat(data?.serialnoDataList);
    setserialCallBackData(finaldata);
  };

  //function to check quantity not in decimal
  const deCimalCheck = (text)=>{
    const validator = /^\d+$/;
    if (validator.test(text)){
      setQuantity(text);   
  }
  else{
      setQuantity(text.substring(0, text.length - 1));
      FlashMessageComponent('warning', strings('Quantity.Fill_proper_quantity'));
  }
  }

  return (
    <>
      {!showQR ? (
        <>
          <HeaderComponent
            title={
              edit
                ? strings('add_part.Edit_Part_Request')
                : strings('add_part.Add_Part_Request')
            }
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 70}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.mainContainer}>
                  <View style={styles.renderItemContainer}>
                    {typeData?.map((item, index) => {
                      return (
                        <DataTypeRenderItem
                          item={item}
                          index={index}
                          key={`ID-${index}`}
                        />
                      );
                    })}
                  </View>

                  {/* Search Parts */}
                  <View style={{ marginTop: normalize(11) }}>
                    <LabelComponents label={strings('add_part.Parts')} />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={
                        (partsData?.PartReqStatus === 'Awaiting Part' ||
                        partsData?.PartReqStatus === 'Requested' ||
                        partsData?.PartReqStatus === 'Allocated')
                          ? true
                          : false
                      }
                      onPress={() =>
                        navigation.navigate('SelectParts', {
                          selectPartsFromList,
                          setSelectPartsFromList,
                          jobId,
                        })
                      }>
                      <View
                        style={[
                          styles.partsIconContainer,
                          styles.searchBarContainer,
                        ]}>
                        <Text
                          style={{
                            fontSize: normalize(14),
                            fontFamily: fontFamily.semiBold,
                          }}>
                          {selectPartsFromList != null
                            ? selectPartsFromList[0]?.PartNo
                            : ''}
                        </Text>
                        <Icon
                          type={ANT_DESIGN}
                          size={normalize(16)}
                          name={'search1'}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Parts Name & Price */}
                  {selectPartsFromList?.length > 0 ?
                    <View style={[styles.partsNameContainer, { flex: 1 }]}>
                      <Text
                        style={[styles.partNameTxt, { width: '70%',textAlign:'left' }]}
                        numberOfLines={1}>
                        {selectPartsFromList != null
                          ? selectPartsFromList[0]?.Description
                          : ''}
                      </Text>
                      <Text
                        style={[
                          styles.partNameTxt,
                          { flex: 1, textAlign: 'right' },
                        ]}>
                        {selectPartsFromList?.length > 0
                          ? selectPartsFromList[0]?.UnitPrice
                            ? `$${selectPartsFromList[0]?.UnitPrice} Each`
                            : ''
                          : ''}
                      </Text>
                    </View> : <View style={{ marginTop: normalize(20) }}></View>}

                  {/* Parts Quantity */}
                  <LabelComponents label={strings('add_part.Quantity')} />
                  <View style={styles.quantityContainer}>
                    {quantity > 1 ? (
                      <QuantityController
                        title={'-'}
                        action={decrementQuantity}
                      />
                    ) : (
                      <View
                        style={styles.quty}></View>
                    )}
                    <TextInput
                      value={quantity}
                      onChangeText={(text) => {
                        setQuantity(text);
                        deCimalCheck(text);
                      }}
                      keyboardType={'numeric'}
                      style={styles.quantityInput}
                      editable={true}
                    />
                    <QuantityController
                      title={'+'}
                      action={incrementQuantity}
                    />
                  </View>

                  {/* Drop Point */}
                  {selectedTypeData?.title == 'OEM' ? (
                    <View style={styles.margin25}>
                      <LabelComponents
                        label={strings('add_part.Drop_Point')}
                        required={false}
                      />
                      <Input
                        containerStyle={styles.dropPointInputContainer}
                        style={styles.dropPointInput}
                        inputContainer={styles.margin8}
                        onChangeText={setDropPoint}
                        value={dropPoint}
                      />
                    </View>
                  ) : null}

                  {/* Request Type */}
                  {selectedTypeData?.title != 'BOQ' ? (
                    <View style={styles.margin25}>
                      <LabelComponents
                        label={strings('add_part.Request_Type')}
                        required={false}
                      />

                      <Dropdown
                        list={requestTypeData}
                        selectedItem={requestType}
                        handleSelection={setRequestType}
                        label={requestType?.label}
                        containerStyle={styles.margin8}
                        dropDownBodyContainer={styles.dropdownBorder}
                        dropDownContainer={{
                          ...styles.dropdownBorder,
                          height: normalize(40),
                        }}
                      />
                    </View>
                  ) : null}

                  {/* Notes */}
                  <View style={styles.top}>
                    <LabelComponents
                      label={strings('add_part.Notes')}
                      required={false}
                    />
                    <TextInput
                      style={styles.noteInputStyle}
                      multiline={true}
                      textAlignVertical="top"
                      onChangeText={setNoteOne}
                      value={noteOne}
                    />
                  </View>

                  {/* Warehouse */}
                  {selectedTypeData?.title == 'Normal' ? (
                    <View style={styles.margin25}>
                      <LabelComponents
                        label={strings('add_part.Warehouse')}
                        required={false}
                      />
                      {wareHouseData.length > 0 ? (
                        <>
                          {wareHouseData?.map((item, index) => {
                            return (
                              <View style={styles.warehouseContainer}>
                                <Text
                                  style={[
                                    styles?.warehoustTxt,
                                    styles.margin8,
                                  ]}>
                                  {item?.Warehouse}
                                </Text>
                                <View style={styles.partsIconContainer}>
                                  <PartsQuantityIcon
                                    width={normalize(14)}
                                    height={normalize(17)}
                                  />
                                  <Text
                                    style={[
                                      styles?.warehoustTxt,
                                      { marginLeft: normalize(10) },
                                    ]}>
                                    {wareHouseQuantity}
                                  </Text>
                                </View>
                              </View>
                            );
                          })}
                        </>
                      ) : (
                        <View style={styles.warehouseContainer}>
                          <Text
                            style={[
                              styles?.warehoustTxt,
                              styles.margin8,
                            ]}>
                            {strings('add_part.Not_Mapped')}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null}

                  {/* Shipping Details and RMA Details */}
                  {selectedTypeData?.title == 'OEM' ? (
                    <>
                      {/* Order */}
                      <HeaderText
                        title={strings('add_part.Shipping_Details')}
                      />
                      <View style={styles.top}>
                        <LabelComponents
                          label={strings('add_part.Order')}
                          required={false}
                        />
                        <Input
                          containerStyle={styles.dropPointInputContainer}
                          style={styles.dropPointInput}
                          inputContainer={styles.margin8}
                          onChangeText={setOrder}
                          value={order}
                        />
                      </View>
                      {/* Ship Via */}
                      <View style={styles.top}>
                        <LabelComponents
                          label={strings('add_part.Ship_Via')}
                          required={false}
                        />
                        <Input
                          containerStyle={styles.dropPointInputContainer}
                          style={styles.dropPointInput}
                          inputContainer={styles.margin8}
                          onChangeText={setShipVia}
                          value={shipVia}
                        />
                      </View>
                      {/* shipping Date */}
                      <View style={styles.top}>
                        <LabelComponents
                          label={strings('add_part.Shipping_Date')}
                          required={false}
                        />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={toggleShippingDate}
                          style={styles.calenderInputContainer}>
                          <Text style={styles.dateTxtStyles}>
                            {/* {DateshippingDate}
                             */}
                            {showShippingDate == false
                              ? shippingDate != ''
                                ? dateFormat(shippingDate, 'DD/MM/YYYY')
                                : ''
                              : ''}
                          </Text>
                          <AddPartsCalenderIcon
                            height={normalize(21)}
                            width={normalize(23)}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Tracking # */}
                      <View style={styles.top}>
                        <LabelComponents
                          label={strings('add_part.Tracking')}
                          required={false}
                        />
                        <Input
                          containerStyle={styles.dropPointInputContainer}
                          style={styles.dropPointInput}
                          inputContainer={styles.margin8}
                          onChangeText={setTracking}
                          value={tracking}
                        />
                      </View>
                      {/* Eta Date */}
                      <View style={styles.top}>
                        <LabelComponents
                          label={strings('add_part.ETA_Date')}
                          required={false}
                        />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={toggleETADate}
                          style={styles.calenderInputContainer}>
                          <Text style={styles.dateTxtStyles}>
                            {/* {ETADate} */}
                            {ETADate != ''
                              ? showETADate == false
                                ? dateFormat(ETADate, 'DD/MM/YYYY')
                                : ''
                              : ''}
                          </Text>
                          <AddPartsCalenderIcon
                            height={normalize(20)}
                            width={normalize(20)}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* ETA Time */}
                      <View style={styles.top}>
                        <LabelComponents
                          label={strings('add_part.ETA_Time')}
                          required={false}
                        />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={toggleETATime}
                          style={styles.calenderInputContainer}>
                          <Text style={styles.dateTxtStyles}>
                            {ETATime != ''
                              ? showETATime == false
                                ? ETATime
                                : ''
                              : ''}
                          </Text>
                          <PartClockIcon
                            height={normalize(21)}
                            width={normalize(23)}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Check Box */}
                      <CheckBox
                        value={checkboxValue}
                        handleValueChange={setCheckboxValue}
                        onTintColor={colors.PRIMARY_BACKGROUND_COLOR}
                        onFillColor={colors.PRIMARY_BACKGROUND_COLOR}
                        tintColor={colors.PRIMARY_BACKGROUND_COLOR}
                        label={strings('add_part.Core_Return')}
                        labelSize={textSizes.h11}
                        containerStyles={styles.checkcont}
                        ckBoxStyle={styles?.ckboxStyle}
                      />
                      {checkboxValue == true &&
                        selectedTypeData?.title == 'OEM' ? (
                        <>
                          <HeaderText title={strings('add_part.RMA_Details')} />
                          <View style={styles.top}>
                            <LabelComponents
                              label={strings('add_part.RMA')}
                              required={false}
                            />
                            <Input
                              containerStyle={styles.dropPointInputContainer}
                              style={styles.dropPointInput}
                              inputContainer={styles.margin8}
                              onChangeText={setRma}
                              value={rma}
                            />
                          </View>

                          <View style={styles.top}>
                            <LabelComponents
                              label={strings('add_part.RMA_Tracking')}
                              required={false}
                            />
                            <Input
                              containerStyle={styles.dropPointInputContainer}
                              style={styles.dropPointInput}
                              inputContainer={styles.margin8}
                              onChangeText={setRmaTracking}
                              value={rmaTracking}
                            />
                          </View>

                          {/* RMA Date */}
                          <View style={styles.top}>
                            <LabelComponents
                              label={strings('add_part.RMA_Date')}
                              required={false}
                            />
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={toggleRMADate}
                              style={styles.calenderInputContainer}>
                              <Text style={styles.dateTxtStyles}>
                                {RMADate != ''
                                  ? showRMADate == false
                                    ? dateFormat(RMADate, 'DD/MM/YYYY')
                                    : ''
                                  : ''}
                              </Text>
                              <AddPartsCalenderIcon
                                height={normalize(21)}
                                width={normalize(23)}
                              />
                            </TouchableOpacity>
                          </View>

                          {/* RMA Note */}
                          <View style={styles.top}>
                            <LabelComponents
                              label={strings('add_part.Note')}
                              required={false}
                            />
                            <TextInput
                              style={styles.noteInputStyle}
                              multiline={true}
                              textAlignVertical="top"
                              onChangeText={setNoteTwo}
                              value={noteTwo}
                            />
                          </View>
                        </>
                      ) : null}
                      <DatePickerModal
                        handleModalVisibility={toggleShippingDate}
                        visibility={showShippingDate}
                        setDate={setShippingDate}
                        selectedDate={shippingDate}
                      />
                      <DatePickerModal
                        handleModalVisibility={toggleETADate}
                        visibility={showETADate}
                        setDate={setETADate}
                        selectedDate={ETADate}
                      />
                      <DatePickerModal
                        handleModalVisibility={toggleRMADate}
                        visibility={showRMADate}
                        setDate={setRMADate}
                        selectedDate={RMADate}
                      />
                      <DatePickerModal
                        handleModalVisibility={toggleETATime}
                        visibility={showETATime}
                        setStartTimePicked={setEtaTime}
                        startTimePicked={ETATime}
                        type={'time'}
                      />
                    </>
                  ) : null}
                </View>
                {/* Select Serial */}
                {selectPartsFromList?.length > 0 && (
                  selectPartsFromList[0]?.IsSerialized == 1 &&
                  wareHouseQuantity > 0 &&
                  selectedTypeData?.title == 'Normal') ? (
                  <View style={{ paddingBottom: normalize(20) }}>

                    <View style={styles.serialContainer}>
                      <View
                        style={[
                          styles.warehouseContainer,
                          { paddingHorizontal: normalize(20) },
                        ]}>
                        <Text
                          style={styles.selectserial}>
                          {strings('add_part.Select_Serial')}
                        </Text>
                        <View style={styles?.partsIconContainer}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={
                              partsData?.PartReqStatus === 'Awaiting Part'
                                ? true
                                : false
                            }
                            onPress={toggleShowQR}>
                            <SerialSearchQRIcon
                              height={normalize(19)}
                              width={normalize(19)}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            disabled={
                              partsData?.PartReqStatus === 'Awaiting Part'
                                ? true
                                : false
                            }
                            onPress={() => searchButton()}>
                            <SerialSearchIcon
                              height={normalize(18)}
                              width={normalize(18)}
                              style={{ marginLeft: normalize(20) }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={{ backgroundColor: Colors?.extraLightGrey }}>
                      {serialCallBackData?.length != 0 &&
                        serialCallBackData != null ? (
                        <>
                          {serialCallBackData?.map((item, index) => {
                            return (
                              <SerialNoRenderItem
                                item={item}
                                index={index}
                                key={`ID-${index}`}
                              />
                            );
                          })}
                        </>
                      ) : null}
                    </View>
                    {searchModal ? (
                      <SerialNoSearchModal
                        handleModalVisibility={toggleSearchModal}
                        visibility={searchModal}
                        Data={serialNoResData}
                        onPress={(data) => onPressFilter(data)}
                        searchOnPress={searchAction}
                        searchOnchangeTxt={(data) => serialChangeTxt(data)}
                      />
                    ) : null}
                  </View>
                ) : null}
              </ScrollView>
              <MultiButton
                buttons={buttons}
                constinerStyles={styles.bottomBtnContainer}
              />
              {showMoreOptions ? (
                <AddMoreModal
                  visibility={showMoreOptions}
                  handleModalVisibility={toggleShowMoreOpt}
                />
              ) : null}
            </KeyboardAvoidingView>
          </View>
        </>
      ) : (
        <QRCodeUI
          onSuccess={onSuccess}
          onCancel={toggleShowQR}
          onDone={onSuccess}
        />
      )}
      {showModal ? (
        <ConfirmationModal
          visibility={showModal}
          handleModalVisibility={() => {
            setModal(false);
          }}
          handleConfirm={onConfirmModal}
          title={strings('confirmation_modal.title')}
          discription={
              strings('confirmation_modal.Confirmation_AddPart')
            }
          handleCancle={() => setModal(false)}
        />
      ) : null}
      <Loader visibility={loading} />
    </>
  );
};

export default MainHoc(AddParts);

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(25),
  },
  selectserial:{
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
  },
  top:{ 
    marginTop: normalize(15) 
  },
  dataTypeItemContainer: {
    borderRadius: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
    paddingLeft: normalize(17),
    marginRight: normalize(10),
    borderWidth: normalize(1),
    paddingRight: normalize(30),
    marginBottom: normalize(15),
  },
  dotStyles: {
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(20),
    backgroundColor: Colors?.dataTypeDot,
    marginRight: normalize(15),
  },
  quty:{
    width: normalize(8),
    height: normalize(3),
    backgroundColor: Colors.borderGrey,
  },
  renderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dataTypeTextStyle: {
    fontSize: normalize(12),
    fontFamily: fontFamily.bold,
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    flex: 1,
  },
  checkcont:{
    alignSelf: 'flex-start',
    marginTop: normalize(20),
  },
  inputDataContainer: {
    borderWidth: normalize(1),
    borderColor: Colors?.darkSecondaryTxt,
    borderRadius: normalize(6),
  },
  margin8:{ 
    marginTop: normalize(8) 
  },
  margin25:{ 
    marginTop: normalize(25) 
  },
  searchIconStyles: {
    height: normalize(15),
    width: normalize(15),
  },
  inputContainer: {
    marginTop: normalize(8),
  },
  partsNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: normalize(25),
  },
  partNameTxt: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.bold,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(8),
  },
  quantityInput: {
    fontSize: normalize(14),
    fontFamily: fontFamily.bold,
    width: normalize(153),
    borderWidth: normalize(1),
    borderColor: Colors?.darkSecondaryTxt,
    marginHorizontal: normalize(15),
    borderRadius: normalize(8),
    padding: normalize(2),
    textAlign: 'center',
    color: Colors?.secondryBlack,
    paddingVertical: Platform.OS === 'ios' ? normalize(10) : 0,
  },
  quantityControlerTxt: {
    fontSize: normalize(22),
    fontFamily: fontFamily.bold,
  },
  quantityControlerBtn: {
    padding: normalize(8),
  },
  dropdownBorder: {
    borderColor: Colors.darkSecondaryTxt,
  },
  noteInputStyle: {
    borderWidth: normalize(1),
    borderColor: Colors?.darkSecondaryTxt,
    minHeight: normalize(80),
    marginTop: normalize(8),
    borderRadius: normalize(8),
    padding: normalize(10),
    fontSize: normalize(14),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  dropPointInputContainer: {
    borderWidth: normalize(1),
    borderColor: Colors?.darkSecondaryTxt,
    borderRadius: normalize(8),
    marginTop: 0,
    paddingLeft: normalize(10),
  },
  dropPointInput: {
    marginTop: 0,
    fontSize: normalize(14),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  warehouseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warehoustTxt: {
    fontSize: normalize(13),
    fontFamily: fontFamily.bold,
  },
  serialContainer: {
    backgroundColor: Colors.extraLightGrey,
    paddingVertical: normalize(10),
  },
  serialRenderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(8),
  },
  headerTxtContainer: {
    marginTop: normalize(20),
    borderBottomWidth: normalize(1),
    paddingBottom: normalize(12),
    borderBottomColor: Colors?.greyBorder,
  },
  bottomBtnContainer: {
    paddingHorizontal: normalize(30),
    backgroundColor: Colors?.white,
    paddingVertical: normalize(13),
  },
  cancelBtnTxt: {
    fontSize: normalize(14),
  },
  addBtnTxt: {
    fontSize: normalize(14),
    color: Colors?.white,
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
  searchBarContainer: {
    padding: normalize(10),
    justifyContent: 'space-between',
    marginTop: normalize(8),
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    borderRadius: normalize(8),
  },
  ckboxStyle: {
    height: Platform.OS == 'ios' ? normalize(18) : normalize(25),
    width: Platform.OS == 'ios' ? normalize(18) : normalize(25),
  },
  star: {
    color: Colors?.dangerRed,
    textAlign: 'left',
    fontSize: normalize(13)
  },
});
