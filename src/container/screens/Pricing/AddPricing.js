import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  TextInput,
  I18nManager,
} from 'react-native';
import HeaderComponent from '../../../components/header/index.js';
import { fontFamily, dateFormat, normalize } from '../../../lib/globals';
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
import { queryAllRealmObject } from '../../../database/index.js';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { NestedDropDown } from '../../../components/NestedDropDown/index.js';

const current = new Date();
const initialDate = dateFormat(current, 'YYYY-MM-DD');

const Warranty = [
  { id: 1, label: strings('pricing_Dropdown.Yes'), value: strings('pricing_Dropdown.Yes') },
  { id: 0, label: strings('pricing_Dropdown.No'), value: strings('pricing_Dropdown.No') },
];
const Unit = [
  { id: 417, label: strings('pricing_Dropdown.Each'), value: strings('pricing_Dropdown.Each') },
  { id: 418, label: strings('pricing_Dropdown.Hourly'), value: strings('pricing_Dropdown.Hourly') },
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

const list = [
  { id: '1', value: strings('pricing_Dropdown.Non_Taxable'), selected: false, label: strings('pricing_Dropdown.Non_Taxable') },
  { id: '2', value: strings('pricing_Dropdown.Taxes'), selected: false, label: strings('pricing_Dropdown.Taxes') },
  { id: '3', value: strings('pricing_Dropdown.Tax_Group'), selected: false, label: strings('pricing_Dropdown.Tax_Group') },
];

//add pricing ui for adding price
const AddPricing = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [priceTypeDropDown, setPriceTypeDropDown] = useState({});
  const [selectedPriceTypeDropDown, setSelelctedPriceTypeDropDown] = useState({});
  const [taskDropDown, setTaskDropDown] = useState({});
  const [selectedTaskDropDown, setSelelctedTaskDropDown] = useState({});
  const [warrantyDropDown, setWarrantyDropDown] = useState(Warranty);
  const [selectedWarrantyDropDown, setSelelctedWarrantyDropDown] = useState({});
  const [discountDropDown, setDiscountDropDown] = useState({});
  const [selectedDiscountDropDown, setSelelctedDiscountDropDown] = useState({});
  const [unitDropDown, setUnitDropDown] = useState(Unit);
  const [selectedUnitDropDown, setSelelctedUnitDropDown] = useState({});
  const [taxDropDown, setTaxDropDown] = useState({});
  const [hourDropDown, setHourDropDown] = useState(Hour);
  const [selectedHourDropDown, setSelelctedHourDropDown] = useState({});
  const [minDropDown, setMinDropDown] = useState(Min);
  const [selectedMinDropDown, setSelelctedMinDropDown] = useState({});
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const dispatch = useDispatch();
  const [subTaxDropDown, setSubTaxDropDown] = useState([]);

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetailsList = useSelector(
    (state) => state?.jobDetailReducers?.data?.WOJobDetails,
  );
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});

  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [drop3, setDrop3] = useState(false);
  const [drop4, setDrop4] = useState(false);
  const [drop5, setDrop5] = useState(false);
  const [drop6, setDrop6] = useState(false);
  const [drop7, setDrop7] = useState(false);
  const [netedDp, setNestDp] = useState(false);

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const totalEachPercentage =
    qty * unitPrice - (qty * unitPrice * discount) / 100;
  const totalEachFlat = qty * unitPrice - discount;
  const totalHourlyPercentage =
    (selectedMinDropDown.value / 60 + selectedHourDropDown.value) * unitPrice -
    ((selectedMinDropDown.value / 60 + selectedHourDropDown.value) *
      unitPrice *
      discount) /
    100;
  const totalHourlyFlat =
    (selectedMinDropDown.value / 60 + selectedHourDropDown.value) * unitPrice -
    discount;

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
        if (finalData?.length > 0) {
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

  //validation function for hitting add price api
  const addPrice = () => {

    if (qty != '' && parseInt(qty) < 1) {
      FlashMessageComponent('warning', strings('Quantity.Fill_proper_quantity'));
    } else {
      if (
        selectedPriceTypeDropDown?.value !== undefined &&
        description?.length > 0
      ) {
        if (selectedDiscountDropDown?.label === 'Percentage' && discount > 100) {
          FlashMessageComponent('warning', strings('Pricing.Percentage_should_be_upto_100'));
        } else {
          SavePrice();
        }
      } else {
        FlashMessageComponent('warning', strings('Pricing.Fill_the_required_details'));
      }
    }
  };

  //add price api to add price in detail
  const SavePrice = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });

      const data = {
        WoJobPriceId: 0,
        CompanyId: userInfo?.CompanyId,
        WoJobId: jobDetailsList[0]?.WoJobId,
        WoJobDetailsId: jobDetailsList[0]?.WoJobDetailsId,
        WorkTypeId: jobDetailsList[0]?.WorkTypeId,
        WorkTaskId: jobDetailsList[0]?.WorkTaskId,
        PriceTypeId: selectedPriceTypeDropDown?.id,
        Qty: qty,
        UnitPrice: unitPrice,
        Description: description,
        DiscountTypeId: selectedDiscountDropDown?.id,
        Discount: discount ? parseInt(discount) : null,
        TaskNo: selectedTaskDropDown?.id,
        CreatedBy: userInfo?.sub,
        CreatedDate: initialDate,
        LastChangedBy: userInfo?.sub,
        LastUpdate: initialDate,
        CreatedSourceId: 2,
        UpdatedSourceId: 2,
        TaxTypeId: selectedItem?.id,
        TaxIdGroupId: 0,
        Tax: selectedItem?.TaxValue,
        TaxPercent: selectedItem?.TaxPercent,
        TaxId: selectedItem?.TaxId,
        ExistWoJobPriceId: null,
        Warranty: selectedWarrantyDropDown?.id,
        PricingUnitId: selectedUnitDropDown?.id,
        DaysPerTask: 0,
        HoursPerTask: selectedHourDropDown?.value,
        MinutesPerTask: selectedMinDropDown?.value,
        isApprovalQueue: null,
        QOJobPriceId: null,
        QOJobDetailsId: null,
        MarkupPercentage: null,
        MenuId: null,
      };
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
            } else if (msgCode.charAt(0) == '1') {
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
      api.addPrice(data, handleCallback, header);
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  //function for calculating total value
  const finalTotalValCal = () => {
    let totalVal = 0;
    if (
      (selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' ||
        selectedUnitDropDown?.value === 'Each') &&
      selectedDiscountDropDown?.label === 'Percentage'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalEachPercentage +
        (totalEachPercentage * selectedItem?.taxValue) / 100
        : totalEachPercentage;
    } else if (
      selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' ||
      selectedUnitDropDown?.value === 'Each'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalEachFlat + (totalEachFlat * selectedItem?.taxValue) / 100
        : totalEachFlat;
    } else if (
      selectedUnitDropDown?.value === 'Hourly' &&
      selectedDiscountDropDown?.label === 'Flat'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalHourlyFlat + (totalHourlyFlat * selectedItem?.taxValue) / 100
        : totalHourlyFlat;
    } else if (
      selectedUnitDropDown?.value === 'Hourly' &&
      selectedDiscountDropDown?.label === 'Percentage'
    ) {
      totalVal = selectedItem?.taxValue
        ? totalHourlyPercentage +
        (totalHourlyPercentage * selectedItem?.taxValue) / 100
        : totalHourlyPercentage;
    }
    else {
      totalVal = selectedItem?.taxValue
        ? totalHourlyPercentage +
        (totalHourlyPercentage * selectedItem?.taxValue) / 100
        : totalHourlyPercentage;
    }

    if (totalVal < 0) {
      totalVal = 0;
    }
    if (isNaN(totalVal) === true) {
      totalVal = 0
    }
    return parseFloat(totalVal).toFixed(2);
  };

  //function to calculate sub total
  const subTotalCalcu = () => {
    let price = '';
    if (selectedUnitDropDown?.value === 'Each') {
      price = qty * unitPrice;
    } else if (selectedUnitDropDown?.value === 'Hourly') {
      price =
        (selectedMinDropDown?.value / 60 + selectedHourDropDown?.value) *
        unitPrice;
    }
    return price;
  };

  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <HeaderComponent
        title={strings('Pricing.Add_Pricing')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
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
              label={
                selectedPriceTypeDropDown?.label || strings('Pricing.select')
              }
              list={
                priceTypeDropDown?.length > 0
                  ? priceTypeDropDown
                  : emptyDropDown
              }
              selectedItem={selectedPriceTypeDropDown}
              handleSelection={(val) => { setSelelctedPriceTypeDropDown(val), setDrop1(false); }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownOpen={drop1}
              dropdownState={() => {
                setDrop1(!drop1);
                setDrop2(false);
                setDrop3(false)
                setDrop4(false)
                setDrop5(false)
                setDrop6(false)
                setDrop7(false)
                setNestDp(false)
              }}
              multiSelectDrop={true}
            />

            <View style={styles.label}>
              <Text style={styles.star}>*</Text>
              <Text align={'flex-start'} style={styles.txt}>
                {''} {strings('Pricing.price_description')}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={(val) => {
                setDescription(val);
              }}
              multiline={true}
            />
            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.task')}
            </Text>
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={
                taskDropDown?.length === 1
                  ? taskDropDown[0]?.label || strings('Pricing.select')
                  : selectedTaskDropDown?.label || strings('Pricing.select')
              }
              list={taskDropDown?.length > 0 ? taskDropDown : emptyDropDown}
              selectedItem={selectedTaskDropDown}
              handleSelection={(val) => { setSelelctedTaskDropDown(val), setDrop2(false); }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownOpen={drop2}

              dropdownState={() => {
                setDrop2(!drop2);
                setDrop1(false);
                setDrop3(false)
                setDrop4(false)
                setDrop5(false)
                setDrop6(false)
                setDrop7(false)
                setNestDp(false)
              }}
              multiSelectDrop={true}
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
                warrantyDropDown?.length > 0 ? warrantyDropDown : emptyDropDown
              }
              selectedItem={selectedWarrantyDropDown}
              handleSelection={(val) => { setSelelctedWarrantyDropDown(val), setDrop3(false) }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownOpen={drop3}
              dropdownState={() => {
                setDrop3(!drop3);
                setDrop1(false);
                setDrop2(false)
                setDrop4(false)
                setDrop5(false)
                setDrop6(false)
              }}
              multiSelectDrop={true}
            />
            {selectedPriceTypeDropDown?.label !== 'Miscellaneous Parts' ? (
              <>
                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Pricing.unit')}
                </Text>
                <Dropdown
                  style={styles.dropDownWrap}
                  hasBorder={true}
                  label={
                    selectedUnitDropDown?.label || strings('Pricing.select')
                  }
                  list={unitDropDown?.length > 0 ? unitDropDown : emptyDropDown}
                  selectedItem={selectedUnitDropDown}
                  handleSelection={(val) => { setSelelctedUnitDropDown(val), setDrop4(false) }}
                  zIndexVal={0}
                  align={'flex-start'}
                  placeholder={''}
                  dropDownContainer={styles.dropDownContainerStyle}
                  dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                  itemStyle={styles.dropdownTextStyle}
                  dropdownOpen={drop4}
                  dropdownState={() => {
                    setDrop4(!drop4);
                    setDrop1(false);
                    setDrop2(false)
                    setDrop3(false)
                    setDrop5(false)
                    setDrop6(false)
                    setDrop7(false)
                    setNestDp(false)
                  }}
                  multiSelectDrop={true}

                />
              </>
            ) : null}

            {selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' ||
              selectedUnitDropDown?.value === 'Each' ? (
              <View>
                <Text align={'flex-start'} style={styles.txt}>
                  {''} {strings('Pricing.qty')}
                </Text>
                <TextInput
                  style={styles.textInput1}
                  value={qty}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    if (isNaN(val) === false) {
                      setQty(val);
                    }
                  }}
                />
              </View>
            ) : null}

            {selectedUnitDropDown?.value === 'Hourly' && selectedPriceTypeDropDown?.label !== 'Miscellaneous Parts' ? (
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
                      hourDropDown?.length > 0 ? hourDropDown : emptyDropDown
                    }
                    selectedItem={selectedHourDropDown}
                    handleSelection={(val) => { setSelelctedHourDropDown(val), setDrop5(false) }}
                    zIndexVal={0}
                    align={'flex-start'}
                    placeholder={'Hour'}
                    dropDownContainer={styles.dropDownContainerStyle}
                    dropDownBodyContainer={[styles.dropDownBodyContainerstyle]}
                    itemStyle={styles.dropdownTextStyle}
                    dropdownOpen={drop5}
                    dropdownState={() => {
                      setDrop5(!drop5);
                      setDrop1(false);
                      setDrop2(false)
                      setDrop3(false)
                      setDrop4(false)
                      setDrop6(false)
                    }}
                    multiSelectDrop={true}
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
                    handleSelection={(val) => { setSelelctedMinDropDown(val), setDrop6(false) }}
                    zIndexVal={0}
                    align={'flex-start'}
                    placeholder={'Minute'}
                    dropDownContainer={styles.dropDownContainerStyle}
                    dropDownBodyContainer={[styles.dropDownBodyContainerstyle]}
                    itemStyle={styles.dropdownTextStyle}
                    dropdownOpen={drop6}

                    dropdownState={() => {
                      setDrop6(!drop6);
                      setDrop1(false);
                      setDrop2(false)
                      setDrop3(false)
                      setDrop4(false)
                      setDrop5(false)
                      setDrop7(false)
                      setNestDp(false)
                    }}
                    multiSelectDrop={true}
                  />
                </View>
              </View>
            ) : null}

            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Pricing.unit_price')}
            </Text>
            <TextInput
              style={[styles.textInput1, { marginBottom: normalize(15), paddingRight: normalize(50) }]}
              value={unitPrice}
              editable={true}
              keyboardType="numeric"
              onChangeText={(val) => {
                if (isNaN(val) === false) {
                  setUnitPrice(val);
                }
              }}
            />
            {selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' ||
              selectedUnitDropDown?.value === 'Each' ? (
              <Text style={styles.each}>{strings('Pricing.each')}</Text>
            ) : null}

            {selectedUnitDropDown?.value === 'Hourly' && selectedPriceTypeDropDown?.label !== 'Miscellaneous Parts' ? (
              <Text style={styles.each}>{strings('Pricing.hourly')}</Text>
            ) : null}
          </View>
          <View style={styles.bottomView}>
            <Text
              style={styles.subtotal}>
              {strings('Pricing.sub_total')}
            </Text>
            {selectedUnitDropDown?.value === 'Each' ||
              selectedPriceTypeDropDown?.label === 'Miscellaneous Parts' ? (
              <Text style={styles.subvalue}>${parseFloat(qty * unitPrice).toFixed(2)}</Text>
            ) : null}
            {selectedUnitDropDown?.value === 'Hourly' && selectedPriceTypeDropDown?.label !== 'Miscellaneous Parts' ? (
              <Text style={styles.subvalue}>
                $
                {Object.keys(selectedHourDropDown).length != 0 && Object.keys(selectedMinDropDown).length == 0 ?
                  isNaN(selectedHourDropDown?.value * unitPrice) == true ?
                    '0.00' :
                    selectedHourDropDown?.value * unitPrice
                  : Object.keys(selectedHourDropDown).length == 0 && Object.keys(selectedMinDropDown)?.length != 0 ?
                    isNaN((selectedMinDropDown?.value / 60) * unitPrice) == true ?
                      '0.00' :
                      (selectedMinDropDown?.value / 60) * unitPrice
                    : isNaN((selectedMinDropDown?.value / 60 + selectedHourDropDown?.value) * unitPrice) == true ? '0.00'
                      : parseFloat(((selectedMinDropDown.value / 60) + selectedHourDropDown.value) *
                        unitPrice).toFixed(2)}
              </Text>
            ) : null}
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
                label={
                  selectedDiscountDropDown?.label || strings('Pricing.select')
                }
                list={
                  discountDropDown?.length > 0
                    ? discountDropDown
                    : emptyDropDown
                }
                selectedItem={selectedDiscountDropDown}
                handleSelection={(val) => { setSelelctedDiscountDropDown(val), setDrop7(false); }}
                zIndexVal={0}
                align={'flex-start'}
                placeholder={''}
                dropDownContainer={styles.dropDownContainerStyle}
                dropDownBodyContainer={[styles.dropDownBodyContainerstyle]}
                itemStyle={styles.dropdownTextStyle}
                dropdownOpen={drop7}

                dropdownState={() => {
                  setDrop7(!drop7);
                  setDrop1(false);
                  setDrop2(false)
                  setDrop3(false)
                  setDrop4(false)
                  setDrop5(false)
                  setDrop6(false);
                  setNestDp(false)
                }}
                multiSelectDrop={true}

              />
              {selectedDiscountDropDown?.label === 'Percentage' ? (
                <TextInput
                  style={styles.textInput2}
                  maxLength={2}
                  value={discount}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    if (isNaN(val) === false) {
                      setDiscount(val);
                    }
                  }}
                />
              ) : (
                <TextInput
                  style={styles.textInput2}
                  value={discount}
                  onChangeText={(val) => {
                    if (isNaN(val) === false) {
                      if (
                        selectedDiscountDropDown.label == 'Flat' &&
                        subTotalCalcu() > discount
                      ) {
                        setDiscount('');
                      }
                      setDiscount(val);
                    }
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
              label={selectedItem?.label || strings('Pricing.select')}
              list={list}
              subList={subTaxDropDown}
              selectedItem={selectedItem}
              showDropDown={netedDp}
              handleSelection={(val) => {
                setSelectedItem(val)
              }}
              selectedCategory={selectedCategory}
              handleSelectionCategory={setSelectedCategory}
              zIndexVal={0}
              align={'flex-start'}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerStyle}
              itemStyle={styles.dropdownTextStyle}
              topAbove={true}
              placeholder={'Select'}
              dropdownState={() => {
                  setNestDp(true),
                  setDrop6(false),
                  setDrop1(false),
                  setDrop2(false),
                  setDrop3(false),
                  setDrop4(false),
                  setDrop5(false),
                  setDrop7(false)
              }}
            />
          </View>
        </View>
        <View style={styles.bottomView}>
          <Text
            style={styles.total}>
            {strings('Pricing.total_job_price')}
          </Text>
          <Text
            style={styles.subvalue}>
            {' '}
            ${finalTotalValCal()}
          </Text>
        </View>
        <View style={styles.button}>
          <PairButton
            title1={strings('Pricing.Cancel')}
            title2={strings('Pricing.Add')}
            onPressBtn1={() => {
              navigation.goBack();
            }}
            onPressBtn2={() => {
              addPrice();
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
    </View>
  );
};
export default MainHoc(AddPricing);

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
  },
  label: {
    flexDirection: 'row',
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
    left: normalize(10),
    fontSize: Platform.OS === 'ios' ? normalize(13) : normalize(18),
    letterSpacing: 0,
    fontFamily: fontFamily.regular,
  },
  actual: {
    marginTop: 4,
    height: normalize(45),
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    paddingLeft: Platform.OS === 'ios' ? normalize(10) : normalize(0),
  },
  subtotal: {
    flex: 0.8,
    marginLeft: I18nManager.isRTL ? normalize(100) : normalize(230),
    marginTop: 0,
  },
  subvalue: {
    flex: 0.5,
    marginTop: 0,
    marginRight: I18nManager.isRTL ? normalize(20) : normalize(0),
  },
  textInput: {
    height: normalize(54),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: normalize(8),
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  textInput1: {
    height: normalize(45),
    width: normalize(385),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: normalize(8),
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  textInput2: {
    marginTop: 4,
    height: normalize(45),
    width: normalize(210),
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    marginLeft: normalize(10),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  each: {
    color: '#8E8E8E',
    bottom: normalize(45),
    alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-end',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  bottomView: {
    backgroundColor: '#F2F2F2',
    padding: normalize(10),
    height: normalize(40),
    flexDirection: 'row',
    flex: 1,
    marginBottom: normalize(10),
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  total:{
    flex: 1,
    marginTop: 0,
    marginLeft: I18nManager.isRTL ? normalize(20) : normalize(150),
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
    marginBottom: normalize(80),
    marginTop: normalize(20),
  },
  discounts: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  txt: {
    marginTop: normalize(12),
    paddingBottom: normalize(2),
  },
  dropDownBodyContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 2,
  },
});
