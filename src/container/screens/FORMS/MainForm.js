import React, {useEffect, useState, memo, isValidElement} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  BlackMoreOptionIcon,
  Calender,
  AttchmentIcon,
  AttchemntIconRed,
} from '../../../assets/img';
import {Colors} from '../../../assets/styles/colors/colors';
import PairButton from '../../../components/Button/pairBtn';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import FormFields from '../../../components/FormCompoent/FormFields';
import HeaderComponent from '../../../components/header/index';
import MainHoc from '../../../components/Hoc';
import {ModalContainer} from '../../../components/Modal';
import QRCodeUI from '../../screens/JobDetail/PartsAttachments/QRCodeUI';
import {Text} from '../../../components/Text';
import api from '../../../lib/api';
import {Header} from '../../../lib/buildHeader';
import {
  dateFormat,
  fontFamily,
  normalize,
  normalizeHeight,
} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import {emptyDropDown} from '../../../util/helper';
import AttchmentPickerComponent from '../Attachment/AttchmentPicker';
import TaskForm from '../JobDetail/AddTask/TaskForm';
import DatePickerModal from '../JobDetail/PartsAttachments/DatePickerModal';
import AddMoreModal from '../JobList/addMore';
import {DataNotFound} from '../../../components/DataNotFound';
import {useNetInfo} from '../../../hooks/useNetInfo';
import CheckBoxComponent from '../../../components/CustomCheckbox/index';
import Loader from '../../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  fetchJobDetails,
  saveJobDetails,
} from '../../../redux/jobDetails/action';
import {useIsFocused} from '@react-navigation/native';

import {getStatus} from '../../../lib/getStatus';
import {color} from 'react-native-reanimated';
import {useColors} from '../../../hooks/useColors';
const MainForm = ({navigation, route}) => {
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [title, setTitle] = useState([
    {id: 1, selected: false},
    {id: 2, selected: true},
    {id: 3, selected: false},
  ]);
  const [onToggleAttchment, setOnToggleAttchment] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);

  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const [dynamicForm, setdynamicForm] = useState([]);
  const [showDatePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState('');
  const {screenName, data, preview, flag} = route?.params;
  const [saveDyaForm, setSaveDyaForm] = useState([]);
  const [dateIndex, setDateIndex] = useState(-1);
  const [enableErrMsg, setEnableErrMsg] = useState(false);
  const {isConnected} = useNetInfo();
  const dispatch = useDispatch();
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const [showQR, setShowQR] = useState(false);
  const [countSave, setCountSave] = useState(0);
  const [QRCodeIndex, setQRCodeIndex] = useState(-1);
  const [QRCodeSubFormIndex, setQRCodeSubformIndex] = useState({
    index: -1,
    subFormIndex: -1,
  });
  const [dropdownDetail, setDropdownDetail] = useState([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimeIndex, setDateTimeIndex] = useState(-1);
  const [attachmentItem, setAttachmentItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [disableFileds, setDisableFileds] = useState(preview);
  const location = {
    latitude: jobDetail?.ZipLat,
    longitude: jobDetail?.ZipLon,
  };
  const {colors} = useColors();
  const editable = getStatus('forms', jobDetail.JobStatus, location);
  const toggleShowQR = (index) => {
    setQRCodeIndex(index);
    setShowQR(!showQR);
  };
  const toggleShowQRSubForm = (index, subFormIndex) => {
    setQRCodeSubformIndex({index: index, subFormIndex: subFormIndex});
    setShowQR(!showQR);
  };

  const onSuccess = (e) => {
    try {
      Alert.alert(e ? `Successful: ${e?.data}` : 'Scan unidentify');
      if (QRCodeSubFormIndex.subFormIndex == -1) {
        updateValue(data, QRCodeIndex);
      } else {
        updateSubFormValue(
          data,
          QRCodeSubFormIndex.index,
          QRCodeSubFormIndex.subFormIndex,
        );
      }
    } catch (error) {
      Alert.alert(`Something Went Wrong !!`);
    }
    setShowQR(!showQR);
  };

  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
  };

  const toggleDateTimePicker = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };
  const callBack = (data) => {
    dispatch(saveJobDetails(data[0]));

    const res = data[0]?.GetDynamicChecklist;

    const list = res.filter(
      (e) =>
        e?.ChklistMastId == data?.ChklistMastId &&
        e?.WoJobId == data?.WoJobId &&
        e?.WoJobChklistId == data?.WoJobChklistId,
    );

    if (list?.length > 0) {
      setdynamicForm(list);
    } else {
      setEnableErrMsg(true);
    }
  };

  useEffect(() => {
    if (preview || !editable) {
      setDisableFileds(true);
    } else {
      setDisableFileds(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let dataset = {
        token: token,
        TechId: userInfo?.sub,
        WojobId: jobDetail?.WoJobId,
        CompanyId: userInfo?.CompanyId,
        customFieldentity: '3,16',
      };
      fetchJobDetails(dataset, callBack);
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (preview) {
        getPreviewData();
      } else {
      }
    }, []),
  );

  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      if (preview) {
        getPreviewData();
      } else {
        getDynamicChecklist1();
      }
    }
  }, [IsFocused]);
  useEffect(() => {
    getDynamicChecklist1();
  }, []);

  /* getting Perview data */

  const getPreviewData = () => {
    setLoading(true);
    const apiPayload = {};
    const handleCallback = {
      success: (data) => {
        if (data?.ChklistDetaillist.length > 0) {
          setdynamicForm(data.ChklistDetaillist);
        } else {
          setEnableErrMsg(true);
        }
        setLoading(false);
      },
      error: (error) => {
        console.log({error});
        setLoading(false);
      },
    };

    let headers = Header(token);
    const endPoint = `?CompanyId=${userInfo?.CompanyId}&ChecklistmasterId=${data.ChklistMastId}`;
    api.getChecklistQuestions('', handleCallback, headers, endPoint);
  };

  /* getting DynamicChecklist data */

  const getDynamicChecklist1 = () => {
    setLoading(true);
    const apiPayload = {};
    const handleCallback = {
      success: (data) => {
        if (data?.length > 0) {
          const dynamicFormTemp = data?.map((form, index) => {
            return {
              ...form,
              AttachmentCount:
                dynamicForm?.length > index
                  ? dynamicForm[index]?.AttachmentCount < form?.AttachmentCount
                    ? form?.AttachmentCount
                    : dynamicForm[index]?.AttachmentCount
                  : form?.AttachmentCount,
              TextValue:
                dynamicForm?.length > index
                  ? dynamicForm[index]?.TextValue
                  : form?.TextValue,
              ValueList:
                dynamicForm?.length > index
                  ? dynamicForm[index]?.ValueList
                  : form?.ValueList,
              BooleanValue:
                dynamicForm?.length > index
                  ? dynamicForm[index]?.BooleanValue
                  : form?.BooleanValue,
            };
          });
          setdynamicForm(dynamicFormTemp);
        } else {
          setEnableErrMsg(true);
        }
        setLoading(false);
      },
      error: (error) => {
        console.log({error});
        setLoading(false);
      },
    };

    let headers = Header(token);
    const endpoint = `?CompanyId=${userInfo?.CompanyId}&WoJobChecklistId=${data?.WoJobChklistId}&ChklistMastId=${data.ChklistMastId}&Wojobid=${jobDetail?.WoJobId}`;
    api.getDynamicCheckListDetails1('', handleCallback, headers, endpoint);
  };
  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };
  const onPressAttchment = (item) => {
    setAttachmentItem(item);
    setOnToggleAttchment(!onToggleAttchment);
  };

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];

  const renderSeprator = () => {
    return <View style={styles.itemSeperator} />;
  };

  const HeaderLabel = ({label, containerStyle, bold = true}) => {
    return (
      <View style={[containerStyle]}>
        <Text
          align={'flex-start'}
          fontFamily={bold ? fontFamily.bold : fontFamily.medium}
          size={normalize(16)}>
          {label}
        </Text>
        {renderSeprator()}
      </View>
    );
  };

  const _handleNavigationOnCamera = (item) => {
    setOnToggleAttchment(false);
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: 'imageUpload',
      screenName: screenName,
      formDetail: attachmentItem,
    });
  };
  const _handleNavigationOnGallery = (item) => {
    setOnToggleAttchment(false);
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: 'imageUpload',
      screenName: screenName,
      formDetail: attachmentItem,
    });
  };
  const _handleNavigationOnDocument = (item) => {
    setOnToggleAttchment(false);
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: 'docUpload',
      screenName: screenName,
      formDetail: attachmentItem,
    });
  };

  const onPressCheckbox = (index) => {
    const data = [...title];
    data[index].selected = !data[index].selected;
    setTitle(data);
  };
  const handleData = (form) => {
    form.map((item) => {
      switch (item.FieldTypeId) {
        case 28:
          /* Dropdown Data change */
          return handleDropdownData(item);
          break;
        case 328:
          /* CheckList data change */
          return handleChecklistData(item);
          break;
        case 352:
          /* Sub Form */
          return handleData(item.SubFormList);
          break;
        default:
          break;
      }
    });
    return form;
  };
  const handleDropdownData = (item) => {
    const newData = item?.ValueList;
    item.ValueList = newData != null ? newData?.value : null;
    return item;
  };
  const handleChecklistData = (item) => {
    const newData = item?.ValueList;
    item.ValueList = newData != null ? newData?.ValueList : null;
    return item;
  };

  /* Dynamic vallidations */

  const dynamicValidation = (item, subForm) => {
    if (item?.IsOptional == 0 && item.ParentQuestionAnswerId == 0) {
      const {flag} = validationOnFeildsType(item);
      if (flag) {
        return item;
      }
    } else if (item?.AllowAttachment == 2 && item.ParentQuestionAnswerId == 0) {
      const {flag, AllowAttachment} = validationOnFeildsType(item);
      if (AllowAttachment) {
        return item;
      }
    } else if (item.ParentQuestionAnswerId != 0 && subForm) {
      let flag1 = dropdownDetail?.filter(
        (res) => res.id == item.ParentQuestionAnswerId,
      );
      if (flag1.length > 0) {
        if (item?.IsOptional == 0) {
          const {flag} = validationOnFeildsType(item);
          if (flag) {
            return item;
          }
        }
      }
    }
  };

  const validation1 = (data) => {
    let subFormvalidation = [];
    let isDependant = [];
    const madItem = data.map((item) => {
      if (item?.SubFormList.length > 0) {
        let flag = dropdownDetail?.filter(
          (res) => res.id == item.ParentQuestionAnswerId,
        );
        if (flag.length > 0) {
          const abd = item.SubFormList.map((ele) => {
            const res1 = dynamicValidation(ele, true);
            return res1;
          });
          const filterSubform = abd?.filter((ele) => ele != undefined);
          subFormvalidation = filterSubform;
        }
      } else {
        return dynamicValidation(item, false);
      }
    });

    const filterItem = madItem.filter((ele) => ele != undefined);
    const finalData = filterItem.concat(subFormvalidation);

    return finalData;
  };

  /* FeildsType validations */

  const validationOnFeildsType = (val) => {
    let flag = false;
    let dependancy;
    let AllowAttachment;

    switch (val?.FieldTypeId) {
      //dropDown
      case 28:
        flag = val.ValueList == null || val.ValueList == '' ? true : false;
        dependancy = val.ValueList;
        AllowAttachment =
          val?.AllowAttachment == 2 && val?.AttachmentCount == 0 ? true : false;
        break;
      //checkbox
      case 328:
        flag = val.ValueList == null || val.ValueList == '' ? true : false;
        dependancy = val.ValueList;
        AllowAttachment =
          val?.AllowAttachment == 2 && val?.val?.AttachmentCount == 0
            ? true
            : false;
        break;

      case 352:
        flag = val.ValueList == null || val.ValueList == '' ? true : false;
        dependancy = val.ValueList;
        AllowAttachment =
          val?.AllowAttachment == 2 && val?.val?.AttachmentCount == 0
            ? true
            : false;
        break;

      default:
        flag = val.TextValue == null || val.TextValue == '' ? true : false;
        dependancy = val.TextValue;
        AllowAttachment =
          val?.AllowAttachment == 2 && val?.AttachmentCount == 0 ? true : false;
        break;
    }

    let obj = {
      flag: flag,
      dependancy: dependancy,
      AllowAttachment: AllowAttachment,
    };
    return obj;
  };
  const formOnSubmitValidation = () => {
    const form = handleData(dynamicForm);
    const prerr = validation1(dynamicForm);

    if (prerr.length > 0) {
      FlashMessageComponent('warning', strings('Validation_Msg.PFRD'));
    } else {
      setLoading(true);
      onPressSave();
    }
  };

  /* For Save DaynamicCheckListDetails */

  const onPressSave = () => {
    setLoading(true);
    const form = handleData(dynamicForm);
    const handleCallback = {
      success: (data) => {
        setLoading(false);

        if (data?.Message?.MessageCode) {
          const msgCode = data?.Message?.MessageCode;
          if (msgCode.length > 5) {
            FlashMessageComponent('reject', msgCode);
          } else if (msgCode.charAt(0) === '1') {
            if (countSave == 0) {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
              setTimeout(() => {
                navigation.goBack();
              }, 600);
              setCountSave(countSave + 1);
            }
          } else {
            FlashMessageComponent('reject', msgCode);
          }
        }
      },
      error: (error) => {
        setLoading(false);

        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : strings('rejectMsg.went_wrong'),
        );
      },
    };

    let apiPayload = {
      Questions: form,
      CommonData: {
        CustomerId: jobDetail?.CustomerId,
        WorkOrderId: jobDetail?.WorkOrderId,
        WoJobId: jobDetail?.WoJobId,
        CompanyId: userInfo?.CompanyId,
      },
    };
    let headers = Header(token);
    api.saveDaynamicCheckListDetails(apiPayload, handleCallback, headers);
  };

  const updateValue = (val, index) => {
    const form = [...dynamicForm];
    form[index].TextValue = val;
    setdynamicForm(form);
  };
  const handleDropdown = (val, index) => {
    const data = {...val, fromIndex: index};
    const present = dropdownDetail.findIndex((id) => id.fromIndex == index);
    if (present == -1) {
      dropdownDetail.push(data);
    } else {
      dropdownDetail[present].id = val.id;
      dropdownDetail[present].value = val.value;
      dropdownDetail[present].label = val.label;
    }
  };

  const updateDropDownValue = (val, index) => {
    handleDropdown(val, index);

    const form = [...dynamicForm];
    form[index].ValueList = val;
    form[index].WoChklistDdId = val.id;
    setdynamicForm(form);
  };
  const updatePressData = (val, id, index, singleVal) => {
    val.selected = true;
    let form = [...dynamicForm];
    form[index].ValueList = val;
    form[index].TextValue = singleVal;
    form[index].dropdownvalues.map((item, idx) => {
      if (idx == id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    setdynamicForm(form);
  };

  const updateSubFormValue = (val, index, subFormIndex) => {
    let form = [...dynamicForm];

    form[index].SubFormList[subFormIndex].TextValue = val;

    setdynamicForm(form);
  };
  const updateSubFormDropdownValue = (val, index, subFormIndex) => {
    handleDropdown(val, subFormIndex);
    let form = [...dynamicForm];

    form[index].SubFormList[subFormIndex].ValueList = val;

    setdynamicForm(form);
  };
  const onPressSingleCheckBox = (index) => {
    let form = [...dynamicForm];

    form[index].show = !form[index].show;
    let value = !form[index].BooleanValue ? 1 : 0;
    form[index].BooleanValue = value;
    setdynamicForm(form);
  };
  const onPressSingleCheckBoxSubForm = (index, subFormIndex) => {
    let form = [...dynamicForm];

    form[index].SubFormList[subFormIndex].show =
      !form[index].SubFormList[subFormIndex].show;
    let value = !form[index].SubFormList[subFormIndex].BooleanValue ? 1 : 0;
    form[index].SubFormList[subFormIndex].BooleanValue = value;
    setdynamicForm(form);
  };

  const DynamicFormComponents = memo(
    ({props, index, onUpdateData, subForm = false, sunFormIndex}) => {
      const [input, setinput] = useState(props?.TextValue);

      const [checklist, setChecklist] = useState([...props?.dropdownvalues]);

      switch (props?.FieldTypeId) {
        case 26:
          /* Alpha Numeric Textbox Fields */
          return (
            <FormFields
              label={props?.Question}
              rightIcon={
                props?.AllowAttachment == 0 || props.AllowAttachment == null
                  ? false
                  : true
              }
              attachmentCount={props?.AttachmentCount}
              attchmentCumplusory={props?.AllowAttachment == 2 ? true : false}
              complusory={props?.IsOptional == 1 ? false : true}
              containerStyle={{marginVertical: normalize(5)}}
              maxLength={props?.maxLength}
              onPressRightIcon={() => {
                props?.AttachmentCount == 0
                  ? onPressAttchment(props)
                  : navigation.navigate('FormAttachmentList', {
                      formData: props,
                    });
              }}
              onEndEditing={() => onUpdateData(input, index)}
              value={input}
              setValue={setinput}
              editable={!disableFileds}
            />
          );
        case 25:
          /* Header Fields*/
          return (
            <HeaderLabel
              label={props?.Question}
              containerStyle={{
                paddingVertical: normalize(15),
              }}
            />
          );

        case 28:
          /* DropDwon Fields */
          let dynamicSelectedValue = {};
          const dropdownList =
            props?.dropdownvalues.length > 0
              ? props?.dropdownvalues.map((item, index) => {
                  let obj = {
                    id: item.ChklistDdDtlId,
                    value: item.ValueList,
                    label: item.ValueList,
                  };
                  if (item.ChklistDdDtlId == props?.WoChklistDdId) {
                    dynamicSelectedValue = obj;
                  }
                  return obj;
                })
              : emptyDropDown;
          let selectedValue = props?.ValueList || dynamicSelectedValue;
          return (
            <View style={styles.mainformContainer}>
              <View style={styles.mainformMiniContainer}>
                <TaskForm
                  label={props?.Question}
                  list={dropdownList}
                  seletedField={selectedValue}
                  setItem={(val) => {
                    !subForm
                      ? updateDropDownValue(val, index)
                      : updateSubFormDropdownValue(val, index, sunFormIndex);
                  }}
                  type={'Main form'}
                  isDisable={disableFileds}
                  mandatory={props.IsOptional != 1}
                />
              </View>
              {props?.AllowAttachment == 0 ||
              props.AllowAttachment == null ? null : (
                <View style={styles.formAttchmentListView}>
                  <TouchableOpacity
                    disabled={disableFileds}
                    onPress={() => {
                      props?.AttachmentCount == 0
                        ? onPressAttchment(props)
                        : navigation.navigate('FormAttachmentList', {
                            formData: props,
                          });
                    }}
                    style={styles.attachmentButton}>
                    {props.AllowAttachment == 2 ? (
                      <AttchemntIconRed
                        height={normalize(18)}
                        width={normalize(17)}
                        color={colors.PRIMARY_BACKGROUND_COLOR}
                      />
                    ) : (
                      <AttchmentIcon
                        height={normalize(18)}
                        width={normalize(17)}
                        color={colors.PRIMARY_BACKGROUND_COLOR}
                      />
                    )}

                    {props?.AttachmentCount > 0 && (
                      <View style={styles.attachmentCountStyle}>
                        <Text color={Colors.white}>
                          {props?.AttachmentCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        case 399:
          /* Date Time Picker Fields */
          return (
            <View style={[styles?.marginTopStyles]}>
              <Text align={'flex-start'} color={'#000000'} style={styles.star}>
                {props.IsOptional != 1 && (
                  <Text color={Colors.red}>{'*  '}</Text>
                )}
                {props?.Question}
              </Text>

              <TouchableOpacity
                activeOpacity={1}
                disabled={disableFileds}
                onPress={() => {
                  setDateTimeIndex(index);
                  toggleDateTimePicker();
                }}
                style={styles.calenderInputContainer}>
                <Text style={styles.dateTxtStyles}>
                  {props?.TextValue
                    ? props?.TextValue == '' ||
                      props?.TextValue == null ||
                      props?.TextValue == undefined
                      ? ''
                      : flag == 1
                      ? input
                      : props?.TextValue
                    : props?.ValueList == '' ||
                      props?.ValueList == null ||
                      props?.ValueList == undefined
                    ? ''
                    : props?.ValueList}
                </Text>
                <Calender height={normalize(21)} width={normalize(23)} />
              </TouchableOpacity>
            </View>
          );
        case 350:
          /* Date  Picker Fields */
          return (
            <View style={[styles?.marginTopStyles]}>
              <Text align={'flex-start'} color={'#000000'} style={styles.star}>
                {props.IsOptional != 1 && (
                  <Text color={Colors.red}>{'*  '}</Text>
                )}
                {props?.Question}
              </Text>

              <TouchableOpacity
                disabled={disableFileds}
                activeOpacity={1}
                onPress={() => {
                  setDateIndex(index);
                  toggleDatePicker();
                }}
                style={styles.calenderInputContainer}>
                <Text style={styles.dateTxtStyles}>
                  {props?.TextValue
                    ? props?.TextValue == '' ||
                      props?.TextValue == null ||
                      props?.TextValue == undefined
                      ? ''
                      : dateFormat(props?.TextValue, 'DD/MM/YYYY')
                    : props?.ValueList == '' ||
                      props?.ValueList == null ||
                      props?.ValueList == undefined
                    ? ''
                    : dateFormat(props?.ValueList, 'DD/MM/YYYY')}
                </Text>
                <Calender height={normalize(21)} width={normalize(23)} />
              </TouchableOpacity>
            </View>
          );
        case 328:
          /* Checkbox Fields  */
          return (
            <FormFields
              label={props?.Question}
              checkbox={true}
              titleList={checklist}
              rightIcon={
                props?.AllowAttachment == 0 || props.AllowAttachment == null
                  ? false
                  : true
              }
              complusory={props?.IsOptional == 1 ? false : true}
              attachmentCount={props?.AttachmentCount}
              attchmentCumplusory={props?.AllowAttachment == 2 ? true : false}
              onPressRightIcon={() => {
                props?.AttachmentCount == 0
                  ? onPressAttchment(props)
                  : navigation.navigate('FormAttachmentList', {
                      formData: props,
                    });
              }}
              onPressCheckbox={(item, id) => {
                updatePressData(item, id, index, item.ValueList);
                const val = {
                  id: item.ChklistDdDtlId,
                  value: item.ValueList,
                  label: item.ValueList,
                };
                handleDropdown(val, index);
              }}
              containerStyle={styles.topmargin}
              editable={!disableFileds}
            />
          );
        case 330:
          /* Sub Header Fields */
          return (
            <HeaderLabel
              label={props?.Question}
              containerStyle={styles.headerPadding}
              bold={false}
            />
          );

        case 352:
          /* sub Form */
          return (
            <>
              <HeaderLabel
                label={props?.Question}
                containerStyle={styles.headerPadding}
              />
              {props?.SubFormList?.map((ele, i) => {
                let flag = dropdownDetail?.filter(
                  (item) => item.id == ele.ParentQuestionAnswerId,
                );

                return (
                  <>
                    {ele.ParentQuestionAnswerId == 0 ||
                    ele.ParentQuestionAnswerId == null ||
                    flag.length > 0 ? (
                      <DynamicFormComponents
                        props={ele}
                        index={index}
                        subForm={true}
                        key={i.toString()}
                        onUpdateData={(val, index) => {
                          updateSubFormValue(val, index, i);
                        }}
                        sunFormIndex={i}
                      />
                    ) : null}
                  </>
                );
              })}
            </>
          );
        case 356:
          //Rich Text editor
          return (
            <FormFields
              label={props?.Question}
              richTextEditor={true}
              rightIcon={
                props.AllowAttachment == 0 || props.AllowAttachment == null
                  ? false
                  : true
              }
              attchmentCumplusory={props?.AllowAttachment == 2 ? true : false}
              onPressRightIcon={() => {
                props?.AttachmentCount == 0
                  ? onPressAttchment(props)
                  : navigation.navigate('FormAttachmentList', {
                      formData: props,
                    });
              }}
              complusory={props.IsOptional == 1 ? false : true}
              containerStyle={{marginVertical: normalize(5)}}
              maxLength={props.maxLength}
              onEndEditing={() => onUpdateData(input, index)}
              value={input}
              setValue={setinput}
              editable={!disableFileds}
              attachmentCount={props?.AttachmentCount}
            />
          );
        case 27:
          /* Numeric textBox */
          return (
            <FormFields
              label={props?.Question}
              rightIcon={
                props.AllowAttachment == 0 || props.AllowAttachment == null
                  ? false
                  : true
              }
              attchmentCumplusory={props?.AllowAttachment == 2 ? true : false}
              complusory={props.IsOptional == 1 ? false : true}
              onPressRightIcon={() => {
                props?.AttachmentCount == 0
                  ? onPressAttchment(props)
                  : navigation.navigate('FormAttachmentList', {
                      formData: props,
                    });
              }}
              containerStyle={{marginVertical: normalize(5)}}
              maxLength={props.maxLength}
              onEndEditing={() => onUpdateData(input, index)}
              value={input}
              setValue={setinput}
              keyboardType={'numeric'}
              editable={!disableFileds}
              attachmentCount={props?.AttachmentCount}
            />
          );
        case 329:
          /* Multiline text box */
          return (
            <FormFields
              label={props?.Question}
              rightIcon={
                props?.AllowAttachment == 0 || props.AllowAttachment == null
                  ? false
                  : true
              }
              attchmentCumplusory={props?.AllowAttachment == 2 ? true : false}
              complusory={props.IsOptional == 1 ? false : true}
              onPressRightIcon={() => {
                props?.AttachmentCount == 0
                  ? onPressAttchment(props)
                  : navigation.navigate('FormAttachmentList', {
                      formData: props,
                    });
              }}
              containerStyle={{marginVertical: normalize(5)}}
              maxLength={props.maxLength}
              onEndEditing={() => onUpdateData(input, index)}
              value={input}
              setValue={setinput}
              multiline={true}
              editable={!disableFileds}
              attachmentCount={props?.AttachmentCount}
            />
          );
        case 380:
          /* GPS Co-ordinates */
          return (
            <FormFields
              label={props?.Question}
              complusory={props.IsOptional == 1 ? false : true}
              containerStyle={{marginVertical: normalize(5)}}
              maxLength={props.maxLength}
              onEndEditing={() => onUpdateData(input, index)}
              value={input}
              setValue={setinput}
              editable={!disableFileds}
              attachmentCount={props?.AttachmentCount}
            />
          );
        case 320:
          /* Barcode / QR Code Textbox */
          return (
            <View style={[styles?.marginTopStyles]}>
              <Text
                align={'flex-start'}
                color={'#000000'}
                style={{paddingLeft: normalize(5), marginTop: normalize(5)}}>
                <Text color={Colors.red}>{'*  '}</Text>
                {props?.Question}
              </Text>

              <TouchableOpacity
                disabled={disableFileds}
                activeOpacity={1}
                onPress={() => {
                  !subForm
                    ? toggleShowQR(index)
                    : toggleShowQRSubForm(index, sunFormIndex);
                }}
                style={styles.barcodeContainer}>
                <Text style={styles.dateTxtStyles}>{props?.TextValue}</Text>
                <Image
                  style={styles.barCodeImage}
                  source={require('../../../assets/images/scanIcon.png')}
                />
              </TouchableOpacity>
            </View>
          );
        case 355:
          /* label */
          return (
            <View>
              <Text
                align={'flex-start'}
                color={'#000000'}
                style={styles.questionStyle}>
                {props?.Question}
              </Text>
            </View>
          );
        case 351:
          //Custom field
          return <View></View>;
        //single checkbox
        case 29:
          let check = props?.BooleanValue == 0 ? false : true;
          return (
            <View style={styles.paddingLft}>
              <CheckBoxComponent
                onChange={() => {
                  !subForm
                    ? onPressSingleCheckBox(index)
                    : onPressSingleCheckBoxSubForm(index, sunFormIndex);
                }}
                check={check}
                label={props?.Question}
                containerStyle={{
                  padding: normalize(10),
                }}
                labelStyle={{fontFamily: fontFamily.semiBold}}
              />
            </View>
          );
        default:
          return <View></View>;
      }
    },
  );

  return (
    <View style={styles.container}>
      {!showQR ? (
        <>
          <HeaderComponent
            title={screenName}
            // title={strings('forms.header_title')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />

          <View style={{flex: 1}}>
            {dynamicForm.length > 0 ? (
              <>
                {Platform.OS == 'ios' ? (
                  <KeyboardAwareScrollView
                    extraScrollHeight={10}
                    enableOnAndroid={true}
                    extraHeight={10}
                    contentContainerStyle={{flexGrow: 1}}>
                    <View style={{margin: normalize(25)}}>
                      {dynamicForm?.map((item, id) => {
                        let flag = dropdownDetail?.filter(
                          (i) => i.id == item.ParentQuestionAnswerId,
                        );

                        return (
                          <View style={{}} key={id.toString()}>
                            {item.ParentQuestionAnswerId == 0 ||
                            item.ParentQuestionAnswerId == null ||
                            flag.length > 0 ? (
                              <DynamicFormComponents
                                props={item}
                                index={id}
                                onUpdateData={(val, index) =>
                                  updateValue(val, index)
                                }
                              />
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                  </KeyboardAwareScrollView>
                ) : (
                  <KeyboardAvoidingView
                    keyboardVerticalOffset={-60}
                    behavior={Platform.OS === 'ios' ? 'position' : null}
                    enableOnAndroid={true}
                    style={{flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={{margin: normalize(25)}}>
                        {dynamicForm?.map((item, id) => {
                          let flag = dropdownDetail?.filter(
                            (i) => i.id == item.ParentQuestionAnswerId,
                          );

                          return (
                            <View style={{}} key={id.toString()}>
                              {item.ParentQuestionAnswerId == 0 ||
                              item.ParentQuestionAnswerId == null ||
                              flag.length > 0 ? (
                                <DynamicFormComponents
                                  props={item}
                                  index={id}
                                  onUpdateData={(val, index) =>
                                    updateValue(val, index)
                                  }
                                />
                              ) : null}
                            </View>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </KeyboardAvoidingView>
                )}
              </>
            ) : (
              enableErrMsg && <DataNotFound />
            )}
          </View>

          {!preview && dynamicForm.length > 0 && editable && (
            <View style={styles.footer}>
              <PairButton
                title1={strings('pair_button.cancel')}
                title2={strings('pair_button.save')}
                onPressBtn2={() => {
                  formOnSubmitValidation();
                  // onPressSave();
                  // navigation.navigate('MainForm', {screenName: 'Main Form'});
                }}
                onPressBtn1={() => {
                  {
                    countSave == 0
                      ? (navigation.goBack(), setCountSave(1))
                      : null;
                  }
                }}
              />
            </View>
          )}
        </>
      ) : (
        <QRCodeUI
          onSuccess={onSuccess}
          onCancel={toggleShowQR}
          onDone={onSuccess}
        />
      )}
      {showMoreOpt ? (
        <AddMoreModal
          visibility={showMoreOpt}
          handleModalVisibility={toggleShowMoreOpt}
        />
      ) : null}
      <View style={{justifyContent: 'center'}}>
        <ModalContainer
          visibility={onToggleAttchment}
          containerStyles={styles.modalContainerStyles}
          handleModalVisibility={() => setOnToggleAttchment(false)}>
          <View>
            <AttchmentPickerComponent
              // iconColor={colors.PRIMARY_BACKGROUND_COLOR}
              containerStyle={{
                margin: normalize(30),
                backgroundColor: 'white',
              }}
              onSelectFromCamera={_handleNavigationOnCamera}
              onSelectGallery={_handleNavigationOnGallery}
              onSelectDoc={_handleNavigationOnDocument}
              iconColor={colors?.PRIMARY_BACKGROUND_COLOR}
            />
          </View>
        </ModalContainer>
      </View>
      {showDatePicker ? (
        <DatePickerModal
          handleModalVisibility={toggleDatePicker}
          visibility={showDatePicker}
          // selectedDate={dynamicForm[dateIndex]?.TextValue ?? '2022-11-11'}
          setDate={(val) => {
            const abc = dynamicForm.map((e, i) => {
              return {
                ...e,
                TextValue: i === dateIndex ? val : e.TextValue,
              };
            });

            setdynamicForm(abc);
          }}
          selectedDate={dynamicForm[dateIndex]?.TextValue}
        />
      ) : null}

      {showDateTimePicker ? (
        <DatePickerModal
          handleModalVisibility={toggleDateTimePicker}
          visibility={showDateTimePicker}
          setDate={(val) => {}}
          flag={flag}
          selectedDate={
            dynamicForm[dateTimeIndex]?.TextValue != '' ?? '2022-11-11'
          }
          dateTimePicker={true}
          setStartTimePicked={(val) => {}}
          startTimePicked={new Date()}
          selectedDateTimeValue={(val) => {
            const abc = dynamicForm?.map((e, i) => {
              return {
                ...e,
                TextValue: i === dateTimeIndex ? val : e?.TextValue,
              };
            });
            setdynamicForm(abc);
          }}
        />
      ) : null}
      <Loader visibility={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    flex: 1,
  },
  bodyContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors?.appGray,
  },
  BtnWrap: {
    flexDirection: 'row',
    backgroundColor: Colors?.white,
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(50),
    elevation: normalize(10),
    shadowColor: Colors?.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: normalize(0.8),
    shadowRadius: normalize(2),
    borderRadius: normalize(7),
  },
  itemSeperator: {
    height: normalize(2),
    backgroundColor: Colors.borderColor,
    marginVertical: normalize(5),
  },
  modalContainerStyles: {
    borderRadius: normalize(8),
  },
  footer: {
    justifyContent: 'flex-end',
    //  flex: 0.07,
    paddingBottom: Platform.OS == 'ios' ? normalize(20) : normalize(14),
    marginTop: 10,
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
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    borderRadius: normalize(8),
    marginTop: normalize(10),
    paddingRight: normalize(10),
  },
  dateTxtStyles: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(10),
    textAlign: 'left',
  },
  imageNodata: {
    width: normalize(250),
  },
  barCodeImage: {
    width: normalize(20),
    height: normalize(20),
  },
  awaitingText: {
    fontSize: normalize(18),
    color: Colors.greyBtnBorder,
  },
  attachmentCountStyle: {
    position: 'absolute',
    top: normalize(15),
    left: normalize(7),
    backgroundColor: Colors.primaryColor,
    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainformContainer: {
    flexDirection: 'row',
  },
  mainformMiniContainer: {
    flex: 1,
  },
  formAttchmentListView: {
    justifyContent: 'flex-start',
    flex: 0.25,
    margin: normalize(10),
  },
  attachmentButton: {
    position: 'absolute',
    top: normalizeHeight(30),
  },
  star: {
    paddingLeft: normalize(5),
    marginTop: normalize(3),
  },
  topmargin: {
    marginTop: normalize(15),
  },
  headerPadding: {
    paddingVertical: normalize(15),
  },
  questionStyle: {
    paddingLeft: normalize(5),
    marginTop: normalize(5),
  },
  paddingLft: {
    padding: normalize(10),
  },
});

export default MainHoc(MainForm);
