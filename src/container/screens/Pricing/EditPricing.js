import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  TextInput,
} from 'react-native';
import HeaderComponent from '../../../components/header/index.js';
import { fontFamily, normalize, dateFormat } from '../../../lib/globals';
import { Colors } from '../../../assets/styles/colors/colors.js';
import AddMoreModal from '../JobList/addMore.js';
import { BlackMoreOptionIcon } from '../../../assets/img/index.js';
import { Dropdown } from '../../../components/Dropdown/index.js';
import PairButton from '../../../components/Button/pairBtn.js';
import MainHoc from '../../../components/Hoc/index.js';
import { Text } from '../../../components/Text/index.js';
import { strings } from '../../../lib/I18n/index.js';
import { emptyDropDown } from '../../../util/helper.js';
import api from '../../../lib/api';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { Header } from '../../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import { pricing1 } from '../../../assets/jsonData/index.js';
import { queryAllRealmObject } from '../../../database/index.js';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { saveJobDetails } from '../../../redux/jobDetails/action';
import { NestedDropDown } from '../../../components/NestedDropDown/index.js';
import Loader from '../../../components/Loader';

const current = new Date();
const initialDate = dateFormat(current, 'YYYY-MM-DD');

const Warranty = [
  { id: 1, label: 'Yes', value: 'Yes' },
  { id: 0, label: 'No', value: 'No' },
];
const Hour = [
  { id: 1, label: '01 Hrs', value: 1 },
  { id: 2, label: '02 Hrs', value: 2 },
  { id: 3, label: '03 Hrs', value: 3 },
  { id: 4, label: '04 Hrs', value: 4 },
  { id: 5, label: '05 Hrs', value: 5 },
  { id: 6, label: '06 Hrs', value: 6 },
  { id: 7, label: '07 Hrs', value: 7 },
  { id: 8, label: '08 Hrs', value: 8 },
  { id: 9, label: '09 Hrs', value: 9 },
  { id: 10, label: '10 Hrs', value: 10 },
];
const Min = [
  { id: 1, label: '15 Min', value: 15 },
  { id: 2, label: '30 Min', value: 30 },
  { id: 3, label: '45 Min', value: 45 },
];
const Unit = [
  { id: 417, label: 'Each', value: 'Each' },
  { id: 418, label: 'Hourly', value: 'Hourly' },]
const list = [
  { id: '1', value: 'Non Taxable', selected: false, label: 'Non Taxable' },
  { id: '2', value: 'Taxes', selected: false, label: 'Taxes' },
  { id: '3', value: 'Tax Group', selected: false, label: 'Tax Group' },
];
const EditPricing = ({ navigation, route }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [priceTypeDropDown, setPriceTypeDropDown] = useState(pricing1);
  const [selectedPriceTypeDropDown, setSelelctedPriceTypeDropDown] = useState(
    {},
  );
  const [taskDropDown, setTaskDropDown] = useState([]);
  const [selectedTaskDropDown, setSelelctedTaskDropDown] = useState({});
  const [warrantyDropDown, setWarrantyDropDown] = useState(Warranty);
  const [selectedWarrantyDropDown, setSelelctedWarrantyDropDown] = useState({});
  const [discountDropDown, setDiscountDropDown] = useState([]);
  const [selectedDiscountDropDown, setSelelctedDiscountDropDown] = useState({});
  const [unitDropDown, setUnitDropDown] = useState(Unit);
  const [taxDropDown, setTaxDropDown] = useState(pricing1);
  const [hourDropDown, setHourDropDown] = useState(Hour);
  const hourVal = Hour.filter(i => i.value == route?.params?.data?.HoursPerTask)
  const [selectedHourDropDown, setSelelctedHourDropDown] = useState(hourVal[0]);
  const [minDropDown, setMinDropDown] = useState(Min);
  const minVal = Min.filter(i => i.value == route?.params?.data?.MinutesPerTask)
  const [selectedMinDropDown, setSelelctedMinDropDown] = useState(minVal[0]);
  const [item, setItem] = useState(route?.params?.data);
  const [description, setDescription] = useState(route?.params?.data?.Description);
  const [qty, setQty] = useState(`${route?.params?.data?.Qty}`);
  const [unitPrice, setUnitPrice] = useState(`${route?.params?.data?.UnitPrice}`);
  const [discount, setDiscount] = useState(route?.params?.data?.Discount);
  const [taskName, setTaskName] = useState('')
  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [nestedDropDown, setNestedDropDown] = useState(false);
  var uprice = Unit.filter(i => i.id == route?.params?.data?.PricingUnitId)
  const [selectedUnitDropDown, setSelelctedUnitDropDown] = useState(uprice[0]);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const jobDetailsList = useSelector(
    (state) => state?.jobDetailReducers?.data?.WOJobDetails,
  );
  const [selectedItem, setSelectedItem] = useState({});
  const [taxItem, setTaxItem] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState({});
  const [subTaxDropDown, setSubTaxDropDown] = useState([]);
  const [SUBTOTAL, setSUBTOTAL] = useState(0);
  const [FINALTOTAL, setFINALTOTAL] = useState(0);
  const [edit, setEdit] = useState(false);
  const routeData = route?.params?.data

  useEffect(() => {
    fetchDataRealm();
  }, []);

  useEffect(() => {
    if (Object.keys(routeData).length != 0) {
      const unitDr = Unit.filter(i => i.id == routeData?.PricingUnitId)

      setSelelctedUnitDropDown(unitDr[0])
      setUnitPrice(routeData?.UnitPrice?.toString())
    }
  }, [route])

  useEffect(() => {
    let price = ''
    if (routeData?.PricingUnit == 'Hourly') {
      var check = isNaN((selectedMinDropDown?.value / 60 + selectedHourDropDown?.value) *
        unitPrice)

      if (check == false) {
        price = (selectedMinDropDown?.value / 60 + selectedHourDropDown?.value) *
          unitPrice
      } else {
        price = 0
      }
    }
    else {
      var check = isNaN(qty * unitPrice)

      if (check == false) {
        price = qty * unitPrice
      }
      else {
        price = 0
      }
    }
    setSUBTOTAL(price)

  }, [selectedHourDropDown, selectedMinDropDown, qty])

  useEffect(() => {
    setItem(route?.params?.data)
    let dis = discountDropDown.filter((ele) => ele.label == routeData?.DiscountType)
    let war = Warranty.filter(e => e.id == route?.params?.data?.Warranty)

    setSelelctedDiscountDropDown(dis[0])
    setSelelctedWarrantyDropDown(war[0])
    dis.length > 0 && setSelelctedDiscountDropDown(dis[0])
    war.length > 0 && setSelelctedWarrantyDropDown(war[0])

    if (routeData?.tax == '0' || routeData?.TaxTypeId == 0) {
      setSelectedItem(list[0])
    }
    else {
      if (subTaxDropDown?.length > 0 && subTaxDropDown != undefined) {
        const filterdData = subTaxDropDown?.filter(ele => ele.TaxValue == route?.params?.data?.Tax)
        setSelectedItem(filterdData[0])
      }
      else {
        setTaxItem(routeData.Tax)
      }
    }
  }, [route, subTaxDropDown, discountDropDown])

  useEffect(() => {
    let price = ''
    if (routeData?.PricingUnit == 'Each' || routeData?.PricingUnit == null) {
      var eachSubtotalCheck = isNaN(qty * unitPrice)
      if (eachSubtotalCheck == false) {
        price = qty * unitPrice
      } else {
        price = 0
      }
      setSUBTOTAL(price)
    }
    else if (routeData?.PricingUnit == 'Hourly') {
      var eachSubtotalCheck = isNaN((routeData?.MinutesPerTask != null && routeData?.MinutesPerTask != 0 ? routeData?.MinutesPerTask / 60 : 0 + routeData.HoursPerTask != 0 && routeData.HoursPerTask != null ?
        routeData.HoursPerTask : 0) * unitPrice)
      if (eachSubtotalCheck == false) {
        price = ((routeData?.MinutesPerTask != null && routeData?.MinutesPerTask != 0 ? routeData?.MinutesPerTask / 60 : 0 + routeData.HoursPerTask != 0 && routeData.HoursPerTask != null ?
          routeData.HoursPerTask : 0) * unitPrice)
      } else {
        price = 0
      }
      setSUBTOTAL(price)
    }
  }, [qty])

  useEffect(() => {
    let totalVal =
      routeData?.DiscountType == 'Flat' ? parseInt(SUBTOTAL) - routeData?.Discount : parseInt(SUBTOTAL) - ((parseInt(SUBTOTAL) * routeData?.Discount) / 100)
    if (totalVal < 0) {
      totalVal = 0;
    }
    if (isNaN(totalVal) === true) {
      totalVal = 0
    }
    setFINALTOTAL(totalVal)
  }, [routeData])

  useEffect(() => {
    if (edit) {
      let data = selectedDiscountDropDown?.label == 'Flat' ? parseInt(SUBTOTAL) - (discount) : parseInt(SUBTOTAL) - (parseInt(SUBTOTAL) * discount) / 100
      let dataTax = 0
      if (selectedItem && selectedItem?.taxValue != '') {
        dataTax = data + ((data * selectedItem?.taxValue) / 100)
      }
      else {
        dataTax = data
      }
      if (dataTax < 0) {
        dataTax = 0;
      }
      if (isNaN(dataTax) === true) {
        dataTax = 0
      }
      setFINALTOTAL(dataTax)
    }
  }, [selectedDiscountDropDown, discount, edit, qty, SUBTOTAL])

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.PriceTypes.map((obj) => {
          let data = {
            id: obj?.PriceTypeId,
            label: obj?.PriceType,
            value: obj?.PriceType,
            ...obj,
          };
          return data;
        });
        if (result != undefined && result.length > 0) {
          setPriceTypeDropDown(result);
        }

        const result1 = res?.Taxes.map((obj) => {
          let object = JSON.parse(JSON.stringify(obj));
          object.id = obj?.TaxId,
            object.label = obj?.TaxName + ' [ ' + obj?.TaxPercent + '%' + ' ] ',
            object.value = obj?.TaxName + ' [ ' + obj?.TaxPercent + '%' + ' ] ',
            object.taxValue = obj?.TaxPercent,
            object.IsActive = obj?.IsActive,
            object.TaxValue = obj.TaxValue,
            object.TaxId = obj?.TaxId,
            object.TaxPercent = obj?.TaxPercent,
            object.mainValue = 'Taxes'
          return object;
        });

        const resultTax = res?.TaxGroups.map((obj) => {
          let object = JSON.parse(JSON.stringify(obj));
          object.id = obj?.TaxId,
            object.label = obj?.TaxName + ' [ ' + obj?.TaxPercent + '%' + ' ] ',
            object.value = obj?.TaxName + ' [ ' + obj?.TaxPercent + '%' + ' ] ',
            object.taxValue = obj?.TaxPercent,
            object.IsActive = obj?.IsActive,
            object.TaxValue = obj.TaxValue,
            object.TaxId = obj?.TaxId,
            object.TaxPercent = obj?.TaxPercent,
            object.mainValue = 'Tax Group'
          return object;
        });

        const finalData = result1.concat(resultTax);
        if (finalData.length > 0) {
          setSubTaxDropDown(finalData);
          setTaxDropDown(result1);
        }
        const result2 = res?.AllWorkTask.map((obj) => {
          let data = {
            id: obj?.WorkTaskId,
            label: obj?.WorkTask,
            value: obj?.WorkTask,
            ...obj,
          };
          return data;
        });

        const finalTaskArray = []
        result2.map((obj) => {
          jobDetailsList.map((obj2) => {
            if (obj.id == obj2.WorkTaskId) {
              finalTaskArray.push(obj)
            }
          })
        })

        if (finalTaskArray != undefined && finalTaskArray.length > 0) {
          setTaskDropDown(finalTaskArray);
        }

        const result3 = res?.GetConfigDetail.map((obj) => {
          let data = {
            id: obj?.ConfigDtlId,
            label: obj?.Description,
            value: obj?.Description,
            ...obj,
          };
          return data;
        });

        if (result3 != undefined && result3.length > 0) {
          const discountArr = result3.filter((ele) => ele?.id == 80 || ele?.id == 81)
          const unitArr = result3.filter((ele) => ele?.id == 417 || ele?.id == 418)
          discountArr.length > 0 && setDiscountDropDown(discountArr);
          unitArr.length > 0 && setUnitDropDown(unitArr)
        }
      })

      .catch((error) => { });
  };

  useEffect(() => {
    taskDropDown?.filter(function (res) {
      if (res?.id == item?.TaskNo) {
        setTaskName(res?.label)
      }
    })
  }, [taskDropDown])


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

  //api function for editing price
  const editPriceApi = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const apiData = {
        "WoJobPriceId": route?.params?.data.WoJobPriceId,
        "CompanyId": userInfo?.CompanyId,
        "WoJobId": jobInfo?.WoJobId,
        "WoJobDetailsId": route?.params?.data?.WoJobDetailsId != 0 ? route?.params?.data?.WoJobDetailsId : 19251671,
        "WorkTypeId": route?.params?.data.WorkTypeId == null ? null : route?.params?.data.WorkTypeId,
        "WorkTaskId": route?.params?.data.WorkTaskId == null ? null : route?.params?.data.WorkTaskId,
        "PriceTypeId": route?.params?.data.PriceTypeId,
        "Qty": parseInt(qty),
        "UnitPrice": parseInt(unitPrice),
        "Description": description,
        "DiscountTypeId": selectedDiscountDropDown?.id,
        "Discount": parseInt(discount),
        "TaskNo": 1,
        "CreatedBy": route?.params?.data?.CreatedBy,
        "CreatedDate": initialDate,
        "LastChangedBy": null,
        "LastUpdate": initialDate,
        "CreatedSourceId": 2,
        "UpdatedSourceId": 2,
        "TaxTypeId": selectedItem?.id,
        "TaxIdGroupId": route?.params?.data.TaxIdGroupId,
        "Tax": selectedItem?.TaxValue != undefined ? selectedItem?.TaxValue : route?.params?.data?.Tax,
        "TaxPercent": selectedItem?.TaxPercent != undefined ? selectedItem?.TaxPercent : route?.params?.data?.TaxPercent,
        "TaxId": null,
        "ExistWoJobPriceId": null,
        "Warranty": selectedWarrantyDropDown?.id,
        "PricingUnitId": route?.params?.data?.PricingUnitId,
        "DaysPerTask": 0,
        "HoursPerTask": selectedHourDropDown?.value != null ? selectedHourDropDown?.value : 0,
        "MinutesPerTask": selectedMinDropDown?.value != null ? selectedMinDropDown?.value : 0,
        "isApprovalQueue": null,
        "QOJobPriceId": null,
        "QOJobDetailsId": null,
        "MarkupPercentage": route?.params?.MarkupPercentage != null ? route?.params?.MarkupPercentage : null,
        "MenuId": null
      }
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
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
            navigation.navigate('PriceDetails');
            dispatch({ type: SET_LOADER_FALSE });
          }
        },
        error: (error) => {
          console.log(error)
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
      api.editPrice(apiData, handleCallback, header);
    } catch (err) {
      console.log(err)

      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  useEffect(() => {
    finalTotalValCal()
  }, [selectedDiscountDropDown, discount, selectedItem])

  // function to calculate final total value
  const finalTotalValCal = () => {
    let totalVal = '';
    if (
      (selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' || item.PriceTypeId == 400 ||
        selectedUnitDropDown?.value === 'Each') &&
      selectedDiscountDropDown?.label === 'Percentage'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalEachPercentage +
        (totalEachPercentage * selectedItem?.taxValue) / 100
        : totalEachPercentage;
    } else if (
      selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' || item.PriceTypeId == 400 ||
      selectedUnitDropDown?.value === 'Each'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalEachFlat + ((totalEachFlat * selectedItem?.taxValue) / 100)
        : totalEachFlat;
    } else if (
      (selectedUnitDropDown?.value === 'Hourly' || item.PricingUnit == 'Hourly') &&
      selectedDiscountDropDown?.label === 'Flat'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalHourlyFlat + ((totalHourlyFlat * selectedItem?.taxValue) / 100)
        : totalHourlyFlat;
    } else if (
      (selectedUnitDropDown?.value === 'Hourly' || item.PricingUnit == 'Hourly') &&
      selectedDiscountDropDown?.label === 'Percentage'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalHourlyPercentage +
        ((totalHourlyPercentage * selectedItem?.taxValue) / 100)
        : totalHourlyPercentage;

    }
    else {
      totalVal = selectedItem?.taxValue != undefined && selectedItem?.taxValue ?
        selectedDiscountDropDown?.label === 'Flat' ? (totalEachFlat + ((totalEachFlat * selectedItem?.taxValue) / 100)) :
          (totalEachPercentage + ((totalEachPercentage * selectedItem?.taxValue) / 100)) : taxItem != null && selectedItem?.value != 'Non Taxable' ?
          selectedDiscountDropDown?.label === 'Flat' ? (totalEachFlat + ((totalEachFlat * routeData?.Percentage) / 100)) :
            (totalEachPercentage + ((totalEachPercentage * routeData?.Percentage) / 100)) : selectedDiscountDropDown?.label === 'Flat' ? (parseInt(SUBTOTAL) - discount) :
            (SUBTOTAL - (SUBTOTAL * (discount / 100)))
    }
    if (isNaN(totalVal)) {
      totalVal = '0.00'
    }
    if (totalVal < 0) {
      totalVal = '0.00'
    }
    let totalRes = totalVal != '' ? parseFloat(totalVal).toFixed(2) : totalVal == 0 && selectedItem?.value == 'Non Taxable' ?
      selectedDiscountDropDown?.label === 'Flat' ? parseFloat(totalEachFlat).toFixed(2) : parseFloat(totalEachPercentage).toFixed(2) : totalVal
    setFINALTOTAL(totalRes)
    return totalVal != '' ? parseFloat(totalVal).toFixed(2) : totalVal;
  };

  const totalEachPercentage =
    qty * unitPrice - (qty * unitPrice * discount) / 100;
  const totalEachFlat = (qty * unitPrice) - discount;
  const totalHourlyPercentage =
    (routeData.MinutesPerTask / 60 + routeData.HoursPerTask) * unitPrice -
    ((routeData.MinutesPerTask / 60 + routeData.HoursPerTask) * unitPrice *
      discount) / 100;
  const totalHourlyFlat =
    (routeData.MinutesPerTask / 60 + routeData.HoursPerTask) * unitPrice - discount;

  //ui design for edit pricing
  return (
    <View style={styles.head}>
      <HeaderComponent
        title={strings('Pricing.edit_pricing')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.oterView}>
            <View style={styles.label}>
              <Text style={styles.star}>*</Text>
              <Text align={'flex-start'} style={styles.txt}>
                {''} {strings('Pricing.price_type')}
              </Text>
            </View>

            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={selectedPriceTypeDropDown?.label || item?.PriceType}
              list={
                priceTypeDropDown.length > 0 ? priceTypeDropDown : emptyDropDown
              }
              selectedItem={selectedPriceTypeDropDown}
              handleSelection={(val) => setSelelctedPriceTypeDropDown(val)}
              zIndexVal={0}
              align={'flex-start'}
              disable={true}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
            />

            <View style={styles.label}>
              <Text style={styles.star}>*</Text>
              <Text align={'flex-start'} style={styles.txt}>
                {''} {strings('Pricing.price_description')}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              multiline={true}
              value={description}
              editable={false}
              onChangeText={(val) => {
                setDescription(val);
              }}
            />

            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.task')}
            </Text>
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              disable={true}
              label={selectedTaskDropDown?.label || taskName}
              list={taskDropDown.length > 0 ? taskDropDown : emptyDropDown}
              selectedItem={selectedTaskDropDown}
              handleSelection={(val) => setSelelctedTaskDropDown(val)}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
            />

            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.warranty')}
            </Text>
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={
                selectedWarrantyDropDown?.label || strings('Pricing.select')
              }
              list={
                warrantyDropDown.length > 0 ? warrantyDropDown : emptyDropDown
              }
              selectedItem={selectedWarrantyDropDown}
              handleSelection={(val) => { setSelelctedWarrantyDropDown(val), setDrop1(false); }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownState={() => {
                setDrop1(!drop1)
                setNestedDropDown(false)
                setDrop2(false);
              }}
              dropdownOpen={drop1}
              multiSelectDrop={true}
            />

            {item.PricingUnit != 'Hourly' ||
              selectedUnitDropDown?.value !== 'Hourly' ? (
              <View>
                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Pricing.qty')}
                </Text>
                <TextInput
                  editable={routeData?.PriceType == 'Part Price' ? false : true}
                  style={[styles.textInput1, { color: 'black' }]}
                  value={qty}
                  onChangeText={(val) => {
                    setQty(val);
                    setEdit(true)
                  }}
                />
              </View>
            ) : null}

            {selectedUnitDropDown?.value !== 'Hourly' || item.PricingUnit != 'Hourly' ? null : (
              <View>
                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Pricing.duration')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Dropdown
                    style={styles.dropDownWrap}
                    hasBorder={true}
                    width={normalize(187)}
                    label={
                      selectedHourDropDown?.label || strings('Pricing.select')
                    }
                    list={
                      hourDropDown.length > 0 ? hourDropDown : emptyDropDown
                    }
                    selectedItem={selectedHourDropDown}
                    handleSelection={(val) => { setSelelctedHourDropDown(val), setEdit(true) }}
                    zIndexVal={0}
                    align={'flex-start'}
                    placeholder={'Hour'}
                    dropDownContainer={styles.dropDownContainerStyle}
                    dropDownBodyContainer={[styles.dropDownBodyContainerstyle]}
                    itemStyle={styles.dropdownTextStyle}
                  />
                  <Dropdown
                    style={styles.dropDownWrap}
                    hasBorder={true}
                    width={normalize(187)}
                    label={
                      selectedMinDropDown?.label || strings('Pricing.select')
                    }
                    list={minDropDown.length > 0 ? minDropDown : emptyDropDown}
                    selectedItem={selectedMinDropDown}
                    handleSelection={(val) => { setSelelctedMinDropDown(val), setEdit(true) }}
                    zIndexVal={0}
                    align={'flex-start'}
                    placeholder={'Minute'}
                    dropDownContainer={styles.dropDownContainerStyle}
                    dropDownBodyContainer={[styles.dropDownBodyContainerstyle]}
                    itemStyle={styles.dropdownTextStyle}
                  />
                </View>
              </View>
            )}

            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.unit_price')}
            </Text>
            <TextInput
              style={styles.textInput1}
              value={unitPrice}
              editable={false}
              onChangeText={(val) => {
                if (isNaN(val) === false) {
                  setUnitPrice(val);
                }
              }}
            />

            {item?.PricingUnit === 'Each' ? (
              <Text style={styles.each}>{strings('Pricing.each')}</Text>
            ) : null}

            {item?.PricingUnit === 'Hourly' ? (
              <Text style={styles.each}>{strings('Pricing.hourly')}</Text>
            ) : null}
          </View>
          <View
            style={[
              styles.bottomView,
              { marginBottom: normalize(0), marginTop: normalize(10) },
            ]}>
            <Text style={styles.subtotal}>
              {strings('Pricing.sub_total')}
            </Text>
            <Text style={styles.final} >${parseFloat(SUBTOTAL).toFixed(2)}</Text>
          </View>
          <View style={styles.oterView}>
            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.discount')}
            </Text>
            <View
              style={styles.discounts}>
              <Dropdown
                style={styles.dropDownWrap}
                hasBorder={true}
                width={normalize(170)}
                label={selectedDiscountDropDown?.label || item?.DiscountType || strings('Pricing.select')}
                list={
                  discountDropDown.length > 0 ? discountDropDown : emptyDropDown
                }
                selectedItem={(val) => { selectedDiscountDropDown(val), setEdit(true) }}
                handleSelection={(val) => { setSelelctedDiscountDropDown(val), setDrop2(false); }}
                zIndexVal={0}
                align={'flex-start'}
                placeholder={'Select'}
                dropDownContainer={styles.dropDownContainerStyle}
                dropDownBodyContainer={[styles.dropDownBodyContainerstyle]}
                itemStyle={styles.dropdownTextStyle}

                dropdownState={() => {
                  setDrop2(!drop2)

                  setNestedDropDown(false)
                  setDrop1(false);


                }}
                dropdownOpen={drop2}
                multiSelectDrop={true}
              />
              {selectedDiscountDropDown?.label === 'Percentage' ? (
                <TextInput
                  style={styles.textInput2}
                  maxLength={2}
                  value={discount.toString()}
                  keyboardType='numeric'
                  onChangeText={(val) => {
                    if (isNaN(val) === false) {
                      setDiscount(val);
                    }
                    setEdit(true)
                  }}
                />
              ) : (
                <TextInput
                  style={styles.textInput2}
                  value={discount.toString()}
                  keyboardType='numeric'
                  onChangeText={(val) => {
                    if (isNaN(val) === false) {
                      setDiscount(val);

                    }
                    setEdit(true)
                  }}
                />
              )}
            </View>

            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.tax_percent')}
            </Text>
            <NestedDropDown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={selectedItem?.label ? selectedItem?.label : taxItem || strings('Pricing.select')}
              list={list}
              subList={subTaxDropDown}
              selectedItem={selectedItem}
              handleSelection={(val) => { setSelectedItem(val) }}
              selectedCategory={selectedCategory}
              handleSelectionCategory={setSelectedCategory}
              zIndexVal={0}
              align={'flex-start'}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerStyle}
              itemStyle={styles.dropdownTextStyle}
              placeholder={'Select'}
              showDropDown={nestedDropDown}
              dropdownState={() => {

                setNestedDropDown(true)
                setDrop1(false);
                setDrop2(false)
              }}
            />

          </View>
          <View style={styles.bottomView}>
            <Text style={styles.jobprice}>
              {strings('Pricing.total_job_price')}
            </Text>
            <Text style={styles.final}>
              {' '}${parseFloat(FINALTOTAL).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <PairButton
            title1={strings('pair_button.cancel')}
            title2={strings('pair_button.update')}
            onPressBtn1={() => {
              navigation.goBack();
            }}
            onPressBtn2={() => {
              editPriceApi();
            }}
          />
        </View>
      </ScrollView>
      {showAddMore ? (
        <AddMoreModal
          visibility={showAddMore}
          handleModalVisibility={toggleAddMore}
        />
      ) : null}
      <Loader visibility={isLoading} />
    </View>

  );

};
export default MainHoc(EditPricing);

const styles = StyleSheet.create({
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
  jobprice: {
    flex: 1,
    marginLeft: normalize(150),
    marginTop: 0
  },
  subtotal: {
    flex: 0.8,
    marginLeft: normalize(240),
    marginTop: 0
  },
  final: {
    flex: 0.5,
    marginTop: 0
  },
  star: {
    left: 0,
    color: '#FF0000',
    fontSize: Platform.OS === 'ios' ? normalize(13) : normalize(18),
    letterSpacing: 0,
    fontFamily: fontFamily.regular,
    marginTop: normalize(15),
  },
  labelText: {
    left: 10,
    fontSize: Platform.OS === 'ios' ? normalize(13) : normalize(18),
    letterSpacing: 0,
    fontFamily: fontFamily.regular,
  },
  discounts: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  textInput: {
    height: normalize(60),
    borderWidth: 1,
    borderRadius: 10,
    color: 'gray',
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    paddingLeft: normalize(10),
  },
  textInput1: {
    height: normalize(40),
    color: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    paddingLeft: normalize(10),
  },
  textInput2: {
    marginTop: 4,
    height: normalize(50),
    width: normalize(210),
    color: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    marginLeft: normalize(10),
    paddingLeft: normalize(10),
  },
  each: {
    color: '#8E8E8E',
    left: 140,
    bottom: 26,
  },
  bottomView: {
    backgroundColor: '#F2F2F2',
    marginBottom: normalize(17),
    height: normalize(40),
    flexDirection: 'row',
    flex: 1,
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
  button: {
    marginBottom: normalize(50),
    marginTop: normalize(20),
  },
  txt: {
    marginTop: normalize(15),
    paddingBottom: normalize(2),
  },
  dropDownBodyContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 2,
  },
  head: {
    backgroundColor: '#FFFFFF',
    marginBottom: 40
  }
});