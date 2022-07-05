import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  I18nManager
} from 'react-native';
// import Header from '../../../components/header/index.js';
import HeaderComponents from '../../../components/header/index.js';
import { Colors } from '../../../assets/styles/colors/colors.js';
import {
  BlackMoreOptionIcon,
  SerialSearchIcon,
  SerialSearchQRIcon,
} from '../../../assets/img/index.js';
import { Dropdown } from '../../../components/Dropdown/index.js';
import PairButton from '../../../components/Button/pairBtn.js';
import MainHoc from '../../../components/Hoc/index.js';
import { Text } from '../../../components/Text/index.js';
import CheckBox from '../../../components/CheckBox';
import { DownArrow, ToggleArrow } from '../../../assets/img/index.js';
import AddContractTypeModal from './AddContractTypeModal.js';
import { strings } from '../../../lib/I18n/index.js';
import ModalPopUp from '../../../components/DateModalPopUp/index';
import Loader from '../../../components/Loader';

import {
  dateFormat,
  fontFamily,
  getDayDiff,
  getTimeDiff,
  normalize,
  timConvert,
} from '../../../lib/globals.js';
import DatePickerModal from '../JobDetail/PartsAttachments/DatePickerModal';
import { AddPartsCalenderIcon } from '../../../assets/img';
import { emptyDropDown } from '../../../util/helper.js';
import { Header } from '../../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../lib/api';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { NewEquipment } from '../../../assets/jsonData/index.js';
import database, { queryAllRealmObject } from '../../../database/index.js';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import QRCodeUI from '../JobDetail/PartsAttachments/QRCodeUI.js';
import { useColors } from '../../../hooks/useColors.js';
import AllCustomeFields from '../../../components/AllCustomFields/index.js';
import AddMoreModal from '../JobList/addMore.js';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';

const current = new Date();
const initialDate = dateFormat(current, 'YYYY-MM-DD');

const AddNewEquipment = ({ navigation, route }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const [openCalender, setopenCalender] = useState(false);
  const [fromDate, setFromDate] = useState(initialDate);
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dayDiff, setDayDiff] = useState('');
  const [showDatePicker, setDatePicker] = useState(false);
  const [title, setTitle] = useState(route?.params?.title);
  const [isScrollable,setIsScrollable]=useState(true)
  const { colors } = useColors();
  const SLADropDownArr = [
    { id: 1, label: 'Met', value: 'Met' },
    { id: 2, label: 'Not Met', value: ' Not Met' },
  ];
  const todayDate = new Date();
  const currentDate = dateFormat(todayDate, 'YYYY-MM-DD');
  const [date, setDate] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [flag, setflag] = useState(false);
  const [flag1, setflag1] = useState(false);
  const [flag2, setflag2] = useState(false);
  const [NestedUI, setNestedUI] = useState(false);
  const [slaDropDown, setSlaDropDown] = useState(SLADropDownArr);
  const [ModalList, setModalList] = useState([]);
  const [brandList, setBrnadList] = useState([]);
  const [selectedSlaDropDown, setSelelctedSlaDropDown] = useState({});
  const [selectedModalList, setSelectedModalList] = useState({});
  const [selectedBrandList, setSelelctedBrnadList] = useState({});
  const [brandDropDown, setBrandDropDown] = useState(NewEquipment);
  const [selectedBrandDropDown, setSelelctedBrandDropDown] = useState({});
  const [modelDropDown, setModelDropDown] = useState(NewEquipment);
  const [selectedModelDropDown, setSelelctedModelDropDown] = useState({});
  const [contractStartDate, setContractStartDate] = useState();
  const [contractEndDate, setContractEndDate] = useState(null);
  const [contractTypeDropDown, setContractTypeDropDown] =
    useState(NewEquipment);
  const [selectedContractTypeDropDown, setSelelctedContractTypeDropDown] =
    useState({});
  const [newContractType, setNewContractType] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const getWorkOrder = useSelector(
    (state) => state?.jobDetailReducers?.GetWorkOrderAppointment,
  );

  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const customeFieldsPanel = useSelector(
    (state) => state?.jobDetailReducers?.data?.CustomFields,
  );
  const equipmentList = useSelector(
    (state) =>
      state?.jobDetailReducers?.data?.GetJobEquipment
  );
  
  const existingEquipmentList = useSelector(
    (state) => state?.EquipmentReducer?.existingEquipment,
  );
  const ref=useRef()
  const [serial, setSerial] = useState('');
  const [value, setvalue] = useState();
  const [ck, setCk] = useState(0);
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [custom, setCustom] = useState('');
  const [customFields, setcustomFields] = useState([]);
  const [equipmentCustomFileds, setEquipmentCustomFileds] = useState({});
  const [equipmentId, setEquipmentId] = useState('');
  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [drop3, setDrop3] = useState(false);
  
  const [showQR, setShowQR] = useState(false);

  const [descriptionText, setDescriptionText] = useState('');
  const [type, setType] = useState({});
  const [valueCheck, setvalueCheck] = useState();
  const [showEquipmentExistsModal, setShowEquipmentExistsModal] =
    useState(false);
  const [contractTypeArray, setContractTypeArry] = useState([]);

  const toggleShowQR = () => {
    setShowQR(!showQR);
  };

  const toggleExistsEquipmentModal = () => {
    setShowEquipmentExistsModal(!showEquipmentExistsModal);
  };
  const handleEquipmentConfirm = () => {
    navigation.navigate('SelectEquipment');
    setShowEquipmentExistsModal(false);
  };
  useEffect(() => {
    const remarkCustom = customeFieldsPanel.filter(
      (e) => e.PanelName == 'Equipment',
    );
    setcustomFields(remarkCustom);
  }, [customeFieldsPanel]);

  useEffect(() => {
    fetchDataRealm();
  }, []);
  useEffect(() => {
    let data = [];
    if (title != 'Edit Equipment') {
      data = customeFieldsPanel?.filter((ele) => ele.PanelId == 31);
    } else {
      data = customeFieldsPanel?.filter((ele) => ele.PanelId == 32);
    }

    data?.length > 0 && setEquipmentCustomFileds(data[0]);
  }, [customeFieldsPanel]);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.BrandLists.map((obj) => {
          let data = {
            id: obj.BrandId,
            label: obj.Brand,
            value: obj.Brand,
          };
          return data;
        });

        if (result != undefined && result.length > 0) {
          setBrandDropDown(result);
        }

        const slaArr = res?.GetSlaPriority.map((obj) => {
          let object = JSON.parse(JSON.stringify(obj));
          object.id = obj.PriorityId;
          object.label = obj.PriorityName;
          object.value = obj.PriorityName;
          return object;
        });
        setSlaDropDown(slaArr);
        const resData = res?.ModelLists.map((obj) => {
          let object = {
            id: obj.ModelId,
            label: obj.Model,
            value: obj.Model,
            BrandId: obj.BrandId,
            Brand: obj.Brand
          };
          return object;
        });

        if (resData.length > 0) {
          setModelDropDown(resData);
          setModalList(resData);
        }
        const contractTypeData = res?.ContactTypes.map((obj) => {
          let object = {
            id: obj.ContactTypeId,
            label: obj.ContactTypeDesc,
            value: obj.ContactTypeDesc,
            ...obj,
          };
          return object;
        });

        setContractTypeDropDown(contractTypeData);
      })

      .catch((error) => { });
  };
  useEffect(() => {
    getContractList();
  }, []);
  const getContractList = () => {
    const apiPayload = {};
    const handleCallback = {
      success: (data) => {
        const contractType = data.map((obj) => {
          let object = {
            id: obj.ContractTypeId,
            label: obj.ContractType,
            value: obj.ContractType,
            ...obj,
          };
          return object;
        });
        setNewContractType(contractType);
      },
      error: (error) => {
        console.log({ error });
      },
    };

    let headers = Header(token);
    const endpoint = `${userInfo?.CompanyId}`;
    api.getContractList('', handleCallback, headers, endpoint);
  };

  const onSuccessQR = (e) => {
    try {
      e
        ? (setSerial(e?.data))
        : Alert.alert(strings('QRCodeUI.Serial_not_found'));
    } catch (error) {
      Alert.alert(`Something Went Wrong !!`);
    }
    setShowQR(!showQR);
  };

  useEffect(() => {
    const sortedWork = ModalList.filter(
      (ele) => ele.BrandId === selectedBrandDropDown.id,
    );

    setModelDropDown(sortedWork);
  }, [selectedBrandDropDown]);

  const headerRightIcons = [
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

  const toggleAddEquipment = () => {
    setShowAddEquipment(!showAddEquipment);
  };
  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
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
      setDayDiff(diffDays);
    } else {
      setSelectedDate('');
      setDayDiff('');
    }
  };

  const NestedUIFUN = () => {
    if (NestedUI == true) {
      setNestedUI(false);
    } else {
      setNestedUI(true);
    }
  };
  const onPressAddEquipment = () => {
    const handleCallback = {
      success: (data) => {
        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        navigation.goBack();
        dispatch({ type: SET_LOADER_FALSE });
      },
      error: (err) => {
        console.log('Error !!!', err);
        FlashMessageComponent('error', strings(`Response_code.${err}`));
        dispatch({ type: SET_LOADER_FALSE });
      },
    };

    dispatch({ type: SET_LOADER_TRUE });
    const data = {
      WoEquipmentEntity: [
        {
          WoEquipmentId: 0,
          CompanyId: getWorkOrder?.CompanyId,
          WorkOrderId: jobInfo?.WorkOrderId,
          WoAddressId: jobInfo?.WoAddressId,
          CustomerEquipmentId: 0,
          BrandId: selectedBrandDropDown?.id,
          Brand: selectedBrandDropDown?.label,
          ModelId: selectedModelDropDown?.id,
          Model: selectedModelDropDown?.label,
          SerialNo: serial,
          TagNo: tag,
          Description: description,
          IsActive: ck,
          InstallationDate: date1,
          CreatedBy: jobInfo?.CreatedBy,
          CreatedDate: jobInfo?.CreatedDate,
          LastChangedBy: 0,
          LastUpdate: null,
          WoJobId: jobInfo?.WoJobId,
          CustomerId: jobInfo?.CustomerId,
          CustAddressId: jobInfo?.CustAddressId,
          ContractStartDate: contractStartDate,
          ContractEndDate: contractEndDate,
          ContractTypeId: selectedContractTypeDropDown?.id ? selectedContractTypeDropDown?.id : type?.id,
          ContractType: selectedContractTypeDropDown?.value ? selectedContractTypeDropDown?.value : type?.value,
          ManufactureDate: date,
          WarrantyExpiryDate: date2,
          PriorityId: selectedSlaDropDown?.id,
          IsContractExpired: null,
          CreatedSourceId: 2,
          UpdatedSourceId: 2,
          CreatedSourceLoginId: null,
          UpdatedSourceLoginId: null,
        },
      ],
      CustomFieldEntity: equipmentCustomFileds,
    };
    const header = Header(token);
    api.addNewEquipment(data, handleCallback, header);
  };
 //**** update Equipment data  */
  const editEquipmentApi = () => {
    const testDate = contractStartDate != '' ? contractStartDate.split('-') : null
    const testDate2 = contractEndDate != '' ? contractEndDate.split('-') : null
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const apiPayload = {
        WoEquipmentEntity: [
          {
            WoEquipmentId: equipmentId,
            CompanyId: getWorkOrder?.CompanyId,
            WorkOrderId: jobInfo?.WorkOrderId,
            WoAddressId: jobInfo?.WoAddressId,
            CustomerEquipmentId: 0,
            BrandId: selectedBrandDropDown?.id,
            Brand: selectedBrandDropDown?.label,
            ModelId: selectedModelDropDown?.id,
            Model: selectedModelDropDown?.label,
            SerialNo: serial,
            TagNo: tag,
            Description: description,
            IsActive: ck,
            InstallationDate: date1,
            CreatedBy: jobInfo?.CreatedBy,
            CreatedDate: jobInfo?.CreatedDate,
            LastChangedBy: 0,
            LastUpdate: null,
            WoJobId: jobInfo?.WoJobId,
            CustomerId: jobInfo?.CustomerId,
            CustAddressId: jobInfo?.CustAddressId,
            ContractStartDate:
              testDate != null || testDate?.length > 1
                ? testDate[1] +
                '/' +
                testDate[2].split('T')[0] +
                '/' +
                testDate[0]
                : contractStartDate,
            ContractEndDate:
              testDate2 != null || testDate2?.length > 1
                ? testDate2[1] +
                '/' +
                testDate2[2].split('T')[0] +
                '/' +
                testDate2[0]
                : contractEndDate,
            ContractTypeId: selectedContractTypeDropDown?.id ? selectedContractTypeDropDown?.id : type?.id,

            ContractType: selectedContractTypeDropDown?.value ? selectedContractTypeDropDown?.value : type?.value,
            ManufactureDate: date,
            WarrantyExpiryDate: date2,
            PriorityId: selectedSlaDropDown?.id,
            IsContractExpired: null,
            CreatedSourceId: 1,
            UpdatedSourceId: 2,
            CreatedSourceLoginId: null,
            UpdatedSourceLoginId: null,
          },
        ],
        CustomFieldEntity: {
          EntityId: 3,
          EntityName: 'Technician Job Details',
          PanelId: 31,
          PanelName: 'Add Equipment Popup',
          JobId: null,
          TransactionId: null,
          CustomFields: [],
        },
      };
      const handleCallback = {
        success: (data) => {
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          navigation.goBack();
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      api.editEquipment(apiPayload, handleCallback, header);
    } catch (error) {
      FlashMessageComponent('reject', error);
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  useEffect(() => {
    if (route?.params?.data) {
      const {
        ContractStartDate,
        ContractEndDate,
        ManufactureDate,
        WarrantyExpiryDate,
        InstallationDate,
      } = route?.params?.data;
      const cntractStartEndDate =
        ContractStartDate == null
          ? ''
          : dateFormat(ContractStartDate, 'DD/MM/YYYY') +
          '-' +
          dateFormat(ContractEndDate, 'DD/MM/YYYY');
      setSelectedDate(cntractStartEndDate);
      setContractStartDate(ContractStartDate == null ? '' : ContractStartDate);
      setContractEndDate(ContractEndDate == null ? '' : ContractEndDate);
      setEquipmentId(route?.params?.data.WoEquipmentId);
      setDate(ManufactureDate == null ? '' : ManufactureDate);
      setDate1(InstallationDate == null ? '' : InstallationDate);
      setDate2(WarrantyExpiryDate == null ? '' : WarrantyExpiryDate);
      setSerial(route?.params?.data?.SerialNo);
      setTag(route?.params?.data?.TagNo);
      setDescription(route?.params?.data?.Description);
      let brandobj = {
        id: route?.params?.data?.BrandId,
        label: route?.params?.data?.Brand,
        value: route?.params?.data?.Brand,
      };
      setSelelctedBrandDropDown(brandobj);
      let modelobj = {
        id: route?.params?.data?.ModelId,
        label: route?.params?.data?.Model,
        value: route?.params?.data?.Model,
      };
      setSelelctedModelDropDown(modelobj);

      if (route?.params?.data?.ContractTypeId != 0) {
        let contractTypeObj = {
          id: route?.params?.data?.ContractTypeId,
          label: route?.params?.data?.ContractType,
          value: route?.params?.data?.ContractType,
        }
        setSelelctedContractTypeDropDown(contractTypeObj);
        setType(contractTypeObj)
      }


    }
  }, [route]);
  useEffect(() => {
    const slaAutofill = slaDropDown.filter(
      (ele) => ele?.id == route?.params?.data?.PriorityId,
    );

    if (slaAutofill.length > 0) {
      setSelelctedSlaDropDown(slaAutofill[0]);
    }
  }, [slaDropDown, route]);

  const validation = async () => {
    const brandEmpty = Object.keys(selectedBrandDropDown).length === 0;
    const modelEmpty = Object.keys(selectedModelDropDown).length === 0;
    const slaEmpty = Object.keys(selectedSlaDropDown).length === 0;

    let messages = [];
    if (brandEmpty == true) {
      FlashMessageComponent('warning', strings('SelectEquipment.Brand_must_be_selected'));
    } else if (modelEmpty == true) {
      FlashMessageComponent('warning', strings('SelectEquipment.Model_must_be_selected'));
    }

    // if (brandEmpty == true) {
    //   messages.push(strings('SelectEquipment.Brand_must_be_selected'));
    // }
    // if (modelEmpty == true) {
    //   messages.push(strings('SelectEquipment.Model_must_be_selected'));
    // }
    // if (slaEmpty == true) {
    //   await messages.push(strings('SelectEquipment.Sla_must_be_selected'));
    // }
    //alert(messages.length)
    else {
      let results = equipmentList?.filter(function (entry) {
        return entry.Brand === selectedBrandDropDown?.value;
      });
       results = results?.filter(function (entry) {
        return entry.Model === selectedModelDropDown?.value;
      });
      results = results?.filter(function (entry) {
        return entry.SerialNo === serial;
      });
      results = results?.filter(function (entry) {
        return entry.TagNo === tag;
      });

      if (results?.length > 0) {
        
        FlashMessageComponent('warning', strings('Equipments.Error1'),5000);
      } else if (existingEquipmentList?.length > 0) {
        let res1 = existingEquipmentList?.filter(function (entry) {
          return entry.BrandName === selectedBrandDropDown?.value;
        });
        res1 = res1?.filter(function (entry) {
          return entry.Model === selectedModelDropDown?.value;
        });
        res1 = res1?.filter(function (entry) {
          return entry.SerialNo === serial;
        });
        res1 = res1?.filter(function (entry) {
          return entry.TagNo === tag;
        });
        if (res1?.length > 0) {
          setShowEquipmentExistsModal(true);
        } else {
          onPressAddEquipment();
        }
      }
    }

  }

  const showDateError = (caseId) => {
    switch (caseId) {
      case 1: FlashMessageComponent(
        'warning',
        strings('flashmessage.Manufacture_Date_and_Expiry_Date_cannot_be_same'),
      );
        break;
      case 2: FlashMessageComponent(
        'warning',
        strings('flashmessage.Expiry_Date_cannot_be_before_Manufacture_Date_and'),
      );
        break;

    }

  };
  return (
    <>
      {!showQR ? (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
          <HeaderComponents
            title={title}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={isScrollable}>
            <View style={styles.mainView}>
              <View style={styles.oterView}>
                <View style={styles.label}>
                  <Text style={styles.star}>*</Text>
                  <Text align={'flex-start'} style={styles.txt}>
                    {''} {strings('Equipments.brand')}
                  </Text>
                </View>
                <Dropdown
                  style={styles.dropDownWrap}
                  hasBorder={true}
                  label={
                    // route?.params?.data?.Brand
                    //   ? route?.params?.data?.Brand
                    // :
                    selectedBrandDropDown.label
                  }
                  list={
                    brandDropDown.length > 0 ? brandDropDown : emptyDropDown
                  }
                  disable={title == 'Edit Equipment' ? true : false}
                  // title == 'Edit Equipment'
                  selectedItem={selectedBrandDropDown}
                  handleSelection={(selectedBrandDropDown) => {
                    setDrop1(false),
                      setSelelctedBrandDropDown(selectedBrandDropDown);
                  }}
                  zIndexVal={0}
                  align={'flex-start'}
                  placeholder={''}
                  dropDownContainer={styles.dropDownContainerStyle}
                  dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                  itemStyle={styles.dropdownTextStyle}
                  dropdownState={() => {
                    setDrop1(!drop1);
                    setDrop2(false);
                    setDrop3(false);
                  }}
                  dropdownOpen={drop1}
                  multiSelectDrop={true}
                />

                <View style={styles.label}>
                  <Text style={styles.star}>*</Text>
                  <Text align={'flex-start'} style={styles.txt}>
                    {''} {strings('Equipments.model')}
                  </Text>
                </View>
                <Dropdown
                  style={styles.dropDownWrap}
                  hasBorder={true}
                  label={
                    // route?.params?.data?.Model
                    //   ? route?.params?.data?.Model
                    //   :
                    selectedModelDropDown?.label
                  }
                  list={
                    modelDropDown.length > 0 ? modelDropDown : emptyDropDown
                  }
                  disable={title == 'Edit Equipment' ? true : false}
                  selectedItem={selectedModelDropDown}
                  handleSelection={(val) => {
                    setDrop2(false)
                    if(val.value!='Not Found'){
                      setSelelctedModelDropDown(val);
                  
                    }
                  }}
                  zIndexVal={0}
                  align={'flex-start'}
                  placeholder={''}
                  dropDownContainer={styles.dropDownContainerStyle}
                  dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                  itemStyle={styles.dropdownTextStyle}
                  dropdownState={() => {
                    setDrop2(!drop2);
                    setDrop1(false);
                    setDrop3(false);
                  }}
                  dropdownOpen={drop2}
                  multiSelectDrop={true}
                />

                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Equipments.serial')}
                </Text>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginHorizontal: normalize(10),
                      width: '100%',
                    },
                    styles.textInput,
                  ]}>
                  <Text style={{ width: '92%' }}>{serial}</Text>

                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      marginHorizontal: normalize(5),
                    }}
                    onPress={() => toggleShowQR()}>
                    <SerialSearchQRIcon
                      height={normalize(16)}
                      width={normalize(16)}
                    />
                  </TouchableOpacity>
                </View>

                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Equipments.tag')}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={tag}
                  onChangeText={(tag) => {
                    setTag(tag);
                  }}
                />

                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Equipments.Description')}
                </Text>
                <TextInput
                  style={[styles.textInput, { height: normalize(60) }]}
                  multiline={true}
                  value={description}
                  onChangeText={(description) => {
                    setDescription(description);
                  }}
                />

                <View style={{ paddingTop: normalize(10) }}>
                  <CheckBox
                    containerStyles={{
                      alignSelf: 'flex-start',
                    }}
                    value={value}
                    ckBoxStyle={styles.ckboxStyle2}
                    onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    tintColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    label={strings('Equipments.inactive')}
                    handleValueChange={(value) => {
                      setvalue(value);
                      if (value == true) {
                        setCk(1);
                      } else if (value == false) {
                        setCk(0);
                      }
                    }}
                  />
                </View>

                {/* <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Equipments.custom_field')}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={custom}
                  onChangeText={(custom) => {
                    setCustom(custom);
                  }}
                /> */}

                <View style={{ marginTop: normalize(10) }}>

                  <AllCustomeFields
                    CustomFields={equipmentCustomFileds}
                    setCustomFiledData={setEquipmentCustomFileds}
                  />
                </View>

                <View
                  style={{
                    paddingTop: normalize(20),
                    paddingBottom: normalize(15),
                  }}>
                  <TouchableOpacity onPress={() => NestedUIFUN()}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{ alignItems: 'flex-start' }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.bold,
                            fontSize:
                              Platform.OS === 'ios'
                                ? normalize(16)
                                : normalize(20),
                          }}>
                          {strings('Equipments.additional_details')}
                        </Text>
                      </View>

                      <View style={{ alignContent: 'flex-end' }}>
                        {NestedUI == true && (
                          <DownArrow
                            fill={'black'}
                            height={normalize(15)}
                            width={normalize(15)}
                            style={{ transform: [{ rotate: '180deg' }] }}
                          />
                        )}
                        {NestedUI == false && (
                          <DownArrow
                            fill={'black'}
                            height={normalize(15)}
                            width={normalize(15)}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {NestedUI == true && (
                  <View>
                    <Text
                      align={'flex-start'}
                      color={Colors?.black}
                      style={{ paddingLeft: normalize(5) }}>
                      {/* <Text color={Colors.red}>{'*  '}</Text> */}
                      {''} {strings('Equipments.sla')}{' '}
                    </Text>
                    <Dropdown
                      style={styles.dropDownWrap}
                      hasBorder={true}
                      label={selectedSlaDropDown?.label}
                      list={
                        slaDropDown.length > 0 ? slaDropDown : emptyDropDown
                      }
                      selectedItem={selectedSlaDropDown}
                      handleSelection={(val) => {
                        setSelelctedSlaDropDown(val), setDrop3(false);
                      }}
                      zIndexVal={0}
                      align={'flex-start'}
                      placeholder={''}
                      dropDownContainer={styles.dropDownContainerStyle}
                      dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                      itemStyle={styles.dropdownTextStyle}
                      dropdownState={() => {
                        setDrop3(!drop3);
                        setDrop2(false);
                        setDrop1(false);
                      }}
                      dropdownOpen={drop3}
                      multiSelectDrop={true}
                    />

                    <Text align={'flex-start'} style={styles.txt}>
                      {''} {strings('Equipments.contract_start_and_end_date')}
                    </Text>
                    <TouchableOpacity
                      style={[styles.dateInput, styles.calenderInputContainer]}
                      onPress={() => {
                        setopenCalender(true);
                      }}>
                      <Text style={styles.dateTxtStyles}>{selectedDate}</Text>
                      <AddPartsCalenderIcon
                        height={normalize(21)}
                        width={normalize(23)}
                      />
                    </TouchableOpacity>

                    <Text align={'flex-start'} style={styles.txt}>
                      {''} {strings('Equipments.contract_type')}
                    </Text>
                    <Dropdown
                      style={styles.dropDownWrap}
                      hasBorder={true}
                      label={
                        selectedContractTypeDropDown
                          ? Object.keys(type).length != 0
                            ? type?.label
                            : selectedContractTypeDropDown?.label
                          : type
                      }
                      list={
                        newContractType.length > 0
                          ? [...newContractType,...contractTypeArray]
                          : emptyDropDown
                      }
                      selectedItem={selectedContractTypeDropDown}
                      handleSelection={(val) => {
                        //setIsScrollable(true)
                        setType(val);
                        setSelelctedContractTypeDropDown(val);
                      }}
                      zIndexVal={0}
                      align={'flex-start'}
                      placeholder={''}
                      dropdownState={() => {
                        //setIsScrollable(!isScrollable)
                        setDrop2(false);
                        setDrop1(false);
                      }}
                      dropDownContainer={styles.dropDownContainerStyle}
                      dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                      itemStyle={styles.dropdownTextStyle}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        toggleAddEquipment();
                      }}>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          color: colors?.PRIMARY_BACKGROUND_COLOR,
                          fontSize:
                            Platform.OS === 'ios'
                              ? normalize(13)
                              : normalize(13),
                          fontFamily: fontFamily.bold,
                        }}>
                        + {strings('Equipments.add_contract')}
                      </Text>
                    </TouchableOpacity>

                    <View>
                      <Text align={'flex-start'} style={styles.txt}>
                        {''} {strings('Equipments.manufacture_date')}
                      </Text>

                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setflag(true);
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

                    <View>
                      <Text align={'flex-start'} style={styles.txt}>
                        {''} {strings('Equipments.installation_date')}
                      </Text>

                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setflag1(true);
                          toggleDatePicker();
                        }}
                        style={styles.calenderInputContainer}>
                        <Text style={styles.dateTxtStyles}>
                          {date1 != '' && date1 != null
                            ? dateFormat(date1, 'DD/MM/YYYY')
                            : ''}
                        </Text>
                        <AddPartsCalenderIcon
                          height={normalize(21)}
                          width={normalize(23)}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: 20 }}>
                      <Text align={'flex-start'} style={styles.txt}>
                        {''} {strings('Equipments.warranty_expiry_date')}
                      </Text>

                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setflag2(true);
                          toggleDatePicker();
                        }}
                        style={styles.calenderInputContainer}>
                        <Text style={styles.dateTxtStyles}>
                          {date2 != '' && date2 != null
                            ? dateFormat(date2, 'DD/MM/YYYY')
                            : ''}
                        </Text>
                        <AddPartsCalenderIcon
                          height={normalize(21)}
                          width={normalize(23)}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {showAddEquipment ? (
              <AddContractTypeModal
                visibility={showAddEquipment}
                handleModalVisibility={toggleAddEquipment}
                type={type?.label}
                description={descriptionText}
                setType={(val) => {
                  setType(val);
                  const data = [...contractTypeArray, val];
                  setContractTypeArry(data);
                }}
                setDescription={setDescriptionText}
                value={valueCheck}
                setvalue={setvalueCheck}
                contractTypeData={[...newContractType,...contractTypeArray]}
              />
            ) : null}
          </ScrollView>
          <PairButton
            title1={strings('pair_button.cancel')}
            title2={
              title == 'Edit Equipment'
                ? strings('pair_button.update')
                : strings('pair_button.add')
            }
            onPressBtn1={() => {
              navigation.goBack();
            }}
            onPressBtn2={() => {
              if (title == 'Edit Equipment') {
                editEquipmentApi();
              } else {
                validation();
              }
            }}
          />
          {showAddMore ? (
            <AddMoreModal
              visibility={showAddMore}
              handleModalVisibility={toggleAddMore}
            />
          ) : null}

          {showCalender ? (
            <dateModal
              visibility={showCalender}
              handleModalVisibility={toggleCalender}
            />
          ) : null}

          {showDatePicker ? (
            <DatePickerModal
              handleModalVisibility={toggleDatePicker}
              visibility={showDatePicker}
              setDate={(val) => {
                if (flag == true) {
                  setDate(val);
                  setflag(false);
                } else if (flag1 == true) {
                  setDate1(val);
                  setflag1(false);
                } else if (flag2 == true) {

                  if (date == val) {
                    showDateError(1);
                  } else if (date > val) {
                    showDateError(2);

                  } else {
                    setDate2(val);
                  }
                  setflag2(false);
                }
              }}
              selectedDate={() => {
                if (flag == true) {
                  date;
                } else if (flag1 == true) {
                  date1;
                } else if (flag2 == true) {
                  date2;
                }
              }}
            />
          ) : null}

          <ModalPopUp
            visible={openCalender}
            onCancle={() => setopenCalender(false)}
            pickerType={'Calender'}
            pickerTitle={strings('apply_timeOff.select_from_and_to_date')}
            startLable={strings('apply_timeOff.from')}
            endLable={strings('apply_timeOff.to')}
            selectedDate={(fromDate, toDate) => {
              setContractStartDate(fromDate);
              setContractEndDate(toDate);
              onSelectDate(fromDate, toDate);
            }}
            startDate={fromDate}
            endDate={endDate}
          />
          <Loader visibility={isLoading} />

          <ConfirmationModal
            visibility={showEquipmentExistsModal}
            handleModalVisibility={toggleExistsEquipmentModal}
            handleConfirm={handleEquipmentConfirm}
            title={strings('confirmation_modal.title')}
            // discription="This equipment cannot be saved because it already exists in the customer profile. Do you wish to auto add the existing equipment?"
            discription={ strings('confirmation_modal.Confirmation_AddEquipment')}
            handleCancle={toggleExistsEquipmentModal}
          />
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
export default MainHoc(AddNewEquipment);

const styles = StyleSheet.create({
  dateInput: {
    borderWidth: 1,
    borderRadius: normalize(10),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(5),
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  oterView: {
    padding: Platform.OS === 'ios' ? normalize(12) : normalize(15),
    backgroundColor: '#FFFFFF',
  },
  label: {
    flexDirection: 'row',
  },
  star: {
    color: '#FF0000',
    fontSize: Platform.OS === 'ios' ? normalize(13) : normalize(18),
    letterSpacing: 0,
    fontFamily: fontFamily.regular,
    marginTop: normalize(15),
    fontSize: normalize(14),
  },
  labelText: {
    fontSize: Platform.OS === 'ios' ? normalize(13) : normalize(18),
    letterSpacing: 0,
    fontFamily: fontFamily.regular,
  },
  textInput: {
    height: normalize(45),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    textAlignVertical: 'top',
    paddingLeft: normalize(10),
    paddingHorizontal: Platform.OS === 'ios' ? normalize(10) : normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  each: {
    color: '#8E8E8E',
    left: 140,
    bottom: 26,
  },
  ckboxStyle2: {
    height: 'auto',
    width: 'auto',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    borderWidth: normalize(1),
    borderRadius: normalize(4),
    borderColor: Colors?.borderGrey,
    // height: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    // width: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    // margin: normalize(5),
  },
  bottomView: {
    backgroundColor: '#F2F2F2',
    marginBottom: normalize(17),
    height: normalize(40),
    flexDirection: 'row',
    flex: 1,
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
    // textAlign: I18nManager.isRTL? 'right' :'left'
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(5),
    color: Colors.black,
  },
  dropDownBodyContainerstyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 10,
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(10),
  },
  txt: {
    marginTop: normalize(15),
    paddingBottom: normalize(2),
  },
  mainView: {
    marginBottom: normalize(15),
    marginHorizontal: normalize(10),
  },
});