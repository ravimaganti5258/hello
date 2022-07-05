import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  BlackMoreOptionIcon,
  MinusIcon,
  PlusIconMD,
} from '../../../../assets/img/index.js';
import { minDropDown, totalHrs } from '../../../../assets/jsonData';
import { Colors } from '../../../../assets/styles/colors/colors';
import PairButton from '../../../../components/Button/pairBtn';
import { Dropdown } from '../../../../components/Dropdown/index.js';
import { FlashMessageComponent } from '../../../../components/FlashMessge';
import HeaderComponent from '../../../../components/header';
import MainHoc from '../../../../components/Hoc/index';
import Loader from '../../../../components/Loader';
import { Text } from '../../../../components/Text';
import { queryAllRealmObject } from '../../../../database/index';
import { MASTER_DATA } from '../../../../database/webSetting/masterSchema';
import api from '../../../../lib/api';
import { Header } from '../../../../lib/buildHeader';
import { fontFamily, normalize } from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';
import AddMoreModal from '../../JobList/addMore';
import TaskForm from './TaskForm';
import { useColors } from '../../../../hooks/useColors.js';
import {
  SET_LOADER_FALSE,
  SET_LOADER_TRUE,
} from '../../../../redux/auth/types.js';
import { emptyDropDown } from '../../../../util/helper.js';
import { accessPermission } from '../../../../database/MobilePrevi/index.js';

const AddTask = ({ navigation, route }) => {
  const [permission, setPermission] = useState({});
  const { colors } = useColors();
  const [showAddMore, setShowAddMore] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState({});
  const [selectedWorkRequest, setSelectedWorkRequest] = useState({});
  const [workType, setWorkType] = useState([
    { id: 1, label: 'Mr', value: 'Mr' },
    { id: 2, label: 'Miss', value: 'Miss' },
  ]);
  const [workRequest, setWorkRequest] = useState([
    { id: 1, label: 'Sales', value: 'Sales' },
    { id: 2, label: 'Sales', value: 'Sales' },
  ]);
  const [allWorkRequest, setAllWorkRequest] = useState([]);
  const [hrs, setHrs] = useState(totalHrs(23, 'Hrs'));
  const [min, setMin] = useState(minDropDown(59, 'Mins'));
  const [quantity, setQuantity] = useState(1);
  const [selectedHrs, setSelectedHrs] = useState({});
  const [selectedMin, setSelectedMin] = useState({});
  const [onChangeWorkRequets, setonChangeWorkRequets] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countSave, setCountSave] = useState(0);
  const [currentDropDownId, setCurrentDropDownId] = useState(1);

  const token = useSelector((state) => state?.authReducer?.token);
  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [drop3, setDrop3] = useState(false);
  const [drop4, setDrop4] = useState(false);

  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const { data, list, edit, jobDetail } = route?.params;
  const dispatch = useDispatch();
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  useEffect(() => {
    const hours = totalHrs(23, 'Hrs');
    setHrs(hours);
    const Mins = minDropDown(59, 'Mins');
    setMin(Mins);
  }, []);

  useEffect(() => {
    fetchDataRealm();
  }, []);
  //****** fetch  dropdown option from master data stored in realm db *** */

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((resp) => {
        const res = resp[0];
        const workTypeDropDown = res?.AllWorkType.map((obj) => {
          let data = {
            id: obj.WorkTypeId,
            label: obj.WorkType,
            value: obj.WorkType,
            ...obj,
          };
          return data;
        });

        if (workTypeDropDown != undefined && workTypeDropDown.length > 0) {
          // const sortedWork = workTypeDropDown.filter(
          //   (ele) => ele.WoCategoryId === data?.WoCategoryId,
          // );

          setWorkType(workTypeDropDown);
        }
        const workTask = res?.AllWorkTask.map((obj) => {
          return obj;
        });
        setAllWorkRequest(workTask);
      })

      .catch((error) => { });
  };

  useEffect(() => {
    if (route?.params) {
      const { data, edit } = route?.params;
      if (edit) {
        setLoading(true);
        autoCompleteDropDown(data);
        setQuantity(data?.Qty ? data.Qty : 1);
        const sortedHours = hrs.filter((val) => val.value == data?.Hours);
        setSelectedHrs(sortedHours[0]);
        const sortedMin = min.filter((val) => val.value == data?.Minutes);
        setSelectedMin(sortedMin[0]);
      }
    }
  }, [route?.params, workType, allWorkRequest]);

  useEffect(() => {
    const data = allWorkRequest.filter(
      (e) => e.WorkTypeId == selectedWorkType.id,
    );
    const taskRequest = data.map((obj) => {
      // let obj = {
      //   id: e.WorkTaskId,
      //   label: e.WorkTask,
      //   value: e.WorkTask,
      //   ...e,
      // };
      // return obj;
      let object = JSON.parse(JSON.stringify(obj));
      object.id = obj.WorkTaskId;
      object.label = obj.WorkTask;
      object.value = obj.WorkTask;
      return object;
    });
    setWorkRequest(taskRequest);
  }, [selectedWorkType]);

  useEffect(() => {
    const defaultHrs = hrs.filter(
      (ele) => ele?.value == JSON.stringify(selectedWorkRequest?.HoursPerTask),
    );
    const defaultMin = min.filter(
      (ele) =>
        ele?.value == JSON.stringify(selectedWorkRequest?.MinutesPerTask),
    );
    setSelectedHrs(defaultHrs?.[0]);
    setSelectedMin(defaultMin?.[0]);
  }, [onChangeWorkRequets]);

  useEffect(() => {
    accessPermission('Job Details').then((res) => {
      setPermission(res)
    })
  }, []);

  //******Autofill dropdown with already selectd value*****//
  const autoCompleteDropDown = (data) => {
    const sortedType = []
    if (workType.length > 0) {
      workType?.map((obj) => {
        if (obj.id == data?.WorkTypeId) { sortedType.push(obj); }
      });
    }
    const sortedRequest = []
    if (allWorkRequest.length > 0) {
      allWorkRequest?.map((obj) => {
        if (obj.WorkTaskId == data?.WorkTaskId) { sortedRequest.push(obj); }
      });
    }
    const taskRequest = sortedRequest?.map((obj) => {
      // let obj = {
      //   id: e.WorkTaskId,
      //   label: e.WorkTask,
      //   value: e.WorkTask,
      //   ...e,
      // };
      // return obj;
      let object = JSON.parse(JSON.stringify(obj));
      object.id = obj.WorkTaskId;
      object.label = obj.WorkTask;
      object.value = obj.WorkTask;
      return object;
    });

    sortedType.length > 0 && setSelectedWorkType(sortedType[0]);
    sortedRequest.length > 0 && setSelectedWorkRequest(taskRequest[0]);
    setLoading(false);
  };

  const increment = (type) => {
    setQuantity((prev) =>
      type == 'plus'
        ? parseInt(prev) + 1
        : parseInt(prev) > 1
          ? parseInt(prev) - 1
          : 1,
    );
  };

  //**** Add-Task and Edit -Task Api call   */
  const onPressAdd = () => {
    setLoading(true);
    const handleCallback = {
      success: (data) => {
        setLoading(false);
        if (data?.Message?.MessageCode) {
          const msgCode = data?.Message?.MessageCode;

          if (msgCode.length > 5) {
            FlashMessageComponent('Warning', strings(`Response_code.${msgCode}`));
          } else if (msgCode.charAt(0) === '1') {
            if (countSave == 0) {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
              setTimeout(() => {
                navigation.goBack();
              }, 1900);
              setCountSave(countSave + 1);
            }
          } else {
            FlashMessageComponent(
              'warning',
              strings(`Response_code.${msgCode}`),
            );
            setTimeout(() => {
              navigation.goBack();
            }, 1700);

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

    if (
      selectedWorkType?.value != undefined &&
      selectedWorkRequest?.value != undefined &&
      selectedHrs?.value != undefined &&
      selectedMin?.value != undefined 
    ) {
    
        if(list?.length > 0) { 
          setLoading(false);
          let results;
          if(edit && data?.WorkType == selectedWorkType?.value && data?.WorkTask == selectedWorkRequest?.value ){
             results = [];
          } else {
            results = list?.filter(function (entry) {
              return entry.WorkType === selectedWorkType?.value;
            });
            results = results?.filter(function (entry) {
              return entry.WorkTask === selectedWorkRequest?.value;
            });
          }
          if (results?.length > 0) {
            FlashMessageComponent('warning', strings('add_new_task.ErrorTask'),5000);
          } else {
          if(parseInt(quantity) >= 1){
            let apiPayload = {
              WorkRequestSaveModel: {
                WoJobDetailsId: edit ? data?.WoJobDetailsId : 0,
                CompanyId: userInfo?.CompanyId,
                WoJobId: jobDetail?.jobId,
                WorkTypeId: selectedWorkType?.id,
                WorkTaskId: selectedWorkRequest?.id,
                Days: 0,
                Hours: selectedHrs?.id,
                Minutes: selectedMin?.id,
                CreatedBy: userInfo?.sub,
                CreatedDate: null,
                LastChangedBy: 0,
                LastUpdate: null,
                TaskNo: edit ? data?.TaskNo : null,
                CustomerPrice: selectedWorkRequest?.CustomerPrice,
                WorkTask: selectedWorkRequest?.WorkTask,
                isOffline: 0,
                CreatedSourceId: 1,
                UpdatedSourceId: 2,
                WorkOrderId: jobDetail?.woOrderId,
                TaxTypeId: 0,
                TaxIdGroupId: 0,
                IsCreatedByClientPortal: null,
                WorkTypePriorityId: edit ? null : selectedWorkType?.PriorityId,
                CustomerId: jobDetail?.CustomerId,
                Qty: parseInt(quantity),
                PricingUnitId: selectedWorkRequest?.PricingUnitId,
                VendorId: edit ? null : userInfo?.VendorId,
                menuid: null,
                TechId: userInfo?.sub,
              },
              CustomFieldEntity: null,
            };
          let headers = Header(token);
          edit
            ? api.updateTask(apiPayload, handleCallback, headers)
            : api.addTask(apiPayload, handleCallback, headers);
        } else {
            setLoading(false);
            setCountSave(0);
            FlashMessageComponent('warning', strings('Quantity.Fill_proper_quantity'));
          }
        }
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setCountSave(0);
      FlashMessageComponent('warning', strings('Pricing.Fill_the_required_details'));
    }
  };

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

  //*** Header Icon array */
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];
  return (
    <View style={styles.container}>
      <HeaderComponent
        title={
          !edit
            ? strings('add_new_task.header_title')
            : strings('add_new_task.Edit_Task')
        }
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
        HeaderRightIcon={headerRightIcons}
      />

      <View style={{ margin: normalize(20), flex: normalize(0.9) }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TaskForm
            label={'work_type'}
            mandatory
            list={workType.length > 0 ? workType : emptyDropDown}
            seletedField={selectedWorkType}
            onPressCb={() => { setCurrentDropDownId(1) }}
            showDropdown={currentDropDownId == 1 ? true : false}
            dropdownState={() => {
              setDrop1(!drop1);
              setDrop2(false);
              setDrop3(false)
              setDrop4(false)
            }}
            setItem={(val) => {
              setDrop1(false);
              setCurrentDropDownId(1),
                setSelectedWorkType(val),
                setSelectedWorkRequest({});
            }}
            dropdownOpen={drop1}
            multiSelectDrop={true}


          />

          <TaskForm
            label={'work_request'}
            mandatory
            dropdownOpen={drop2}
            list={workRequest.length > 0 ? workRequest : emptyDropDown}
            seletedField={selectedWorkRequest}

            setItem={(val) => {
              setDrop2(false);
              setCurrentDropDownId(2);
              setSelectedWorkRequest(val),
                setonChangeWorkRequets((prev) => !prev);
            }}
            onPressCb={() => { setCurrentDropDownId(2) }}
            selectedWorkType={selectedWorkType}
            showDropdown={currentDropDownId == 2 ? true : false}


            dropdownState={() => {
              setDrop2(!drop2);
              setDrop1(false);
              setDrop3(false)
              setDrop4(false)
            }}
            multiSelectDrop={true}
          />
          <View style={{ padding: normalize(5) }}>
            <Text align={'flex-start'}>
              <Text color={Colors.red}>{'* '}</Text>
              {strings('add_new_task.qauntity')}
            </Text>
            <View style={styles.quantityWrap}>
              <TouchableOpacity
                style={styles.alignStyle}
                disabled={quantity > 1 ? false : true}
                onPress={() => {
                  quantity && quantity > 1 ? increment('minus') : null;
                }}>
                {quantity > 1 ? (
                  <MinusIcon
                    width={normalize(16)}
                    height={normalize(16)}
                    style={{color:colors.PRIMARY_BACKGROUND_COLOR}}
                    // fill={colors?.PRIMARY_BACKGROUND_COLOR}
                  />
                ) : (
                  <View
                    style={{
                      width: normalize(16),
                      height: normalize(4),
                      backgroundColor: Colors.borderGrey,
                    }}></View>
                )}
              </TouchableOpacity>
              {/* :null} */}
              <TextInput
                style={styles.quantityTextInputWrap}
                fontFamily={fontFamily.semiBold}
                keyboardType={'numeric'}
                value={quantity.toString()}
                onChangeText={(text) => {
                  setQuantity(text);
                  deCimalCheck(text);
                }}
              />
              <TouchableOpacity
                style={styles.alignStyle}
                onPress={() => increment('plus')}>
                <PlusIconMD
                  width={normalize(16)}
                  height={normalize(16)}
                  style={{color:colors.PRIMARY_BACKGROUND_COLOR}}
                  // fill={colors?.PRIMARY_BACKGROUND_COLOR}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TaskForm
            label={'duration'}
            mandatory
            list={hrs}
            seletedField={selectedHrs}
            setItem={(val) => {
              setDrop3(false),
                setSelectedHrs(val), setCurrentDropDownId(3);
            }}
            list2={min}
            selectedField2={selectedMin}
            setItem2={(val) => {
              setDrop4(false)
              setSelectedMin(val), setCurrentDropDownId(4);
            }}
            dropdownState={() => {

              setDrop3(!drop3);
              setDrop4(false)
              setDrop1(false);
              setDrop2(false)

            }}
            dropdownState2={() => {
              setDrop4(!drop4)
              setDrop3(false);
              setDrop1(false);
              setDrop2(false)

            }}
            dropdownOpen={drop3}
            dropDownOpen2={drop4}
            multiSelectDrop={true}
          />
        </ScrollView>
      </View>

      {/* footer section */}
      <View style={styles.footer}>
        <PairButton
          title1={strings('pair_button.cancel')}
          title2={
            !edit ? strings('pair_button.add') : strings('pair_button.update')
          }
          onPressBtn2={() => {
            edit && permission?.Edit
              ? onPressAdd()
              : !edit && permission?.Add
                ? onPressAdd()
                : null
          }}
          onPressBtn1={() =>
            countSave == 0 ? (navigation.goBack(), setCountSave(1)) : null
          }
          btn2Style={{
            backgroundColor: edit && permission?.Edit
              ? colors?.PRIMARY_BACKGROUND_COLOR
              : !edit && permission?.Add
                ? colors?.PRIMARY_BACKGROUND_COLOR
                : Colors.darkGray
          }}
        />
      </View>
      <Loader visibility={loading} />

      {showAddMore ? (
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}
          title={''}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: normalize(1),
  },
  inputFieldStyle: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: normalize(1),
  },
  InputWrap: {
    borderWidth: 1,
    borderRadius: normalize(10),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(5),
    width: normalize(200),
  },
  labelStyles: {
    padding: normalize(5),
  },
  quantityWrap: {
    flexDirection: 'row',
    paddingVertical: normalize(10),
    paddingLeft: normalize(5),
  },
  quantityTextInputWrap: {
    borderWidth: 1,
    width: normalize(160),
    padding: Platform.OS === 'ios' ? normalize(12) : normalize(5),
    borderRadius: normalize(8),
    borderColor: Colors.borderGrey,
    marginHorizontal: normalize(20),
    textAlign: 'center',
  },
  alignStyle: {
    alignSelf: 'center',
  },
  footer: {
    justifyContent: 'flex-end',
    paddingBottom: normalize(20),
    flex: normalize(0.1),
  },
});

export default MainHoc(AddTask);
