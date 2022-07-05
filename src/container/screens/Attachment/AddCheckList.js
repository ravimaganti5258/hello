import React, {memo, useState, useEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Colors} from '../../../assets/styles/colors/colors';
import {fontFamily, normalize, normalizeHeight} from '../../../lib/globals';
import {BlackMoreOptionIcon, CheckListEyeIcon} from '../../../assets/img';
import {checkListData} from '../../../assets/jsonData';
import MainHoc from '../../../components/Hoc';
import CheckBox from '../../../components/CheckBox';
import HeaderComponents from '../../../components/header';
import {strings} from '../../../lib/I18n';
import PairButton from '../../../components/Button/pairBtn';
import {useSelector} from 'react-redux';
import {__esModule} from 'styled-components/native';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import AddMoreModal from '../JobList/addMore';
import {useColors} from '../../../hooks/useColors';
import {DataNotFound} from '../../../components/DataNotFound';
import {queryAllRealmObject} from '../../../database/index';
import {MASTER_DATA} from '../../../database/webSetting/masterSchema';
import {Header} from '../../../lib/buildHeader';
import api from '../../../lib/api';
import Loader from '../../../components/Loader';
import {getStatus} from '../../../lib/getStatus';

const CheckItemComponent = ({item, index, onPressIcon, navigation}) => {
  const {colors} = useColors();
  return (
    <>
      <View style={styles?.renderItemContainer}>
        <View style={styles?.checkBoxContainer}>
          <CheckBox
            containerStyles={styles.checkBoxContainerStyle}
            value={item?.selected}
            ckBoxStyle={styles.ckboxStyle}
            onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
            onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
            handleValueChange={onPressIcon}
            tintColor={colors?.PRIMARY_BACKGROUND_COLOR}
          />
          <View style={styles.detailContainer}>
            <Text numberOfLines={1} style={styles.titleTxt}>
              {item?.ChklistName}
            </Text>
            <Text numberOfLines={1} style={styles.descTxt}>
              {item?.Description}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => {
            navigation.navigate('MainForm', {
              screenName: item?.ChklistName,
              data: item,
              preview: true,
              flag: 0,
            });
          }}>
          <CheckListEyeIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.borderLine} />
    </>
  );
};

const AddCheckList = ({navigation}) => {
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [enableErrMsg, setEnableErrMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countSave, setCountSave] = useState(0);
  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];
  const [data, setData] = useState(checkListData);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const jobChecklist = useSelector(
    (state) => state?.jobDetailReducers?.GetWOJobChecklist,
  );
  const location = {
    latitude: jobDetail?.ZipLat,
    longitude: jobDetail?.ZipLon,
  };
  const editable = getStatus('add Checklist', jobDetail.JobStatus, location);
  const [jobCheckListRealm, setjobCheckListRealm] = useState([]);
  const [jobList, setJobList] = useState([]);

  useEffect(() => {
    fetchDataRealm();
  }, []);
  const fetchDataRealm = () => {
    setLoading(true);
    queryAllRealmObject(MASTER_DATA).then((data) => {
      const res = data[0];
      const result = res?.GetCheckListMaster.map((obj) => {
        let data = {
          ChklistMastId: obj?.ChklistMastId,
          ChklistName: obj?.ChklistName,
          Description: obj?.Description,
          IsActive: obj?.IsActive,
          Mandatory: obj?.Mandatory,
          ...obj,
        };
        return data;
      });
      if (result != undefined && result.length > 0) {
        setjobCheckListRealm(result);
        let data = [...result];
        jobChecklist.map((item) => {
          data = data.filter((e) => e.ChklistMastId != item.ChklistMastId);
        });
        setJobList(data);
      }
      setEnableErrMsg(true);
      setLoading(false);
    });
    setLoading(false);
  };
  const renderItem = ({item, index}) => {
    const handleOnPress = (index) => {
      handleSelection(index);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.rowContainer}
        disabled={true}>
        <CheckItemComponent
          item={item}
          index={index}
          navigation={navigation}
          onPressIcon={() => handleOnPress(index)}
        />
      </TouchableOpacity>
    );
  };

  const handleSelection = (selectedIndex) => {
    try {
      const reqData = jobList.map((item, index) => {
        if (index == selectedIndex) {
          return {
            ...item,
            selected: item?.selected ? !item?.selected : true,
          };
        } else {
          return item;
        }
      });
      setJobList(reqData);
    } catch (error) {}
  };

  const onAddForms = (previewVal) => {
    try {
      let selectedForm = jobList.filter((obj) => obj?.selected === true);
      const screenName = selectedForm[0]?.ChklistName;
      if (selectedForm?.length > 0) {
        let successCallbacks = 0;
        const handleCallback = {
          success: (data) => {
            setLoading(false);
            if (data?.Message?.MessageCode) {
              successCallbacks += 1;
              const msgCode = data?.Message?.MessageCode;
              if (msgCode?.length > 5) {
                FlashMessageComponent(
                  'warning',
                  strings(`Response_code.${msgCode}`),
                );
              } else if (msgCode.charAt(0) === '1') {
                if (countSave == 0) {
                  FlashMessageComponent(
                    'success',
                    strings(`Response_code.${msgCode}`),
                  );

                  if (selectedForm.length == successCallbacks) {
                    setTimeout(() => {
                      navigation.goBack();
                    }, 1900);
                  }

                  setCountSave(countSave + 1);
                }
              } else {
                FlashMessageComponent(
                  'warning',
                  strings(`Response_code.${msgCode}`),
                );
              }
            }
          },
          error: (error) => {
            console.log({error});
            setLoading(false);

            FlashMessageComponent('reject', strings('rejectMsg.went_wrong'));
            navigation.goBack();
          },
        };
        selectedForm.map((sel) => {
          const apiPayload = {
            WoJobId: jobDetail?.WoJobId,
            WorkOrderId: jobDetail?.WorkOrderId,
            CustomerId: jobDetail?.CustomerId,
            ChklistMastId: sel?.ChklistMastId,
            CompanyId: userInfo?.CompanyId,
            CreatedBy: jobDetail?.TechId,
            TechId: jobDetail?.TechId,
            JobStatusId: jobDetail?.JobStatusid,
            IsMobile: 1,
            CreatedSourceId: 2,
          };
          let headers = Header(token);
          setLoading(true);
          api.insertWOJobChecklistDetails(apiPayload, handleCallback, headers);
        });
      } else {
        FlashMessageComponent(
          'warning',
          strings('flashmessage.Please_select_a_checklist'),
        );
      }
    } catch (e) {}
  };
  const keyExtractor = (item, index) => `ID-${index}`;
  return (
    <>
      <HeaderComponents
        title={strings('AddCheckList.header')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <Loader visibility={loading} />
      {showMoreOpt ? (
        <AddMoreModal
          visibility={showMoreOpt}
          handleModalVisibility={toggleShowMoreOpt}
        />
      ) : null}
      {jobList?.length > 0 ? (
        <>
          <View style={styles.container}>
            <FlatList
              data={jobList}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </View>
          <View style={styles.footer}>
            {editable && (
              <PairButton
                title1={strings('pair_button.cancel')}
                title2={strings('pair_button.add')}
                onPressBtn2={() => {
                  onAddForms(false);
                }}
                onPressBtn1={() => {
                  {
                    countSave == 0
                      ? (navigation.goBack(), setCountSave(1))
                      : null;
                  }
                }}
              />
            )}
          </View>
        </>
      ) : (
        enableErrMsg && <DataNotFound />
      )}
    </>
  );
};

export default MainHoc(AddCheckList);

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  imageNodata: {
    height: normalizeHeight(200),
    width: normalize(250),
  },
  container: {
    flex: 1,
    backgroundColor: Colors?.white,
    marginVertical: normalize(10),
  },
  renderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
  },
  borderLine: {
    borderTopWidth: normalize(1),
    borderTopColor: Colors?.borderGrey,
    height: normalize(1),
    marginTop: normalize(16),
  },
  titleTxt: {
    fontSize: normalize(14),
    fontFamily: fontFamily.bold,
  },
  descTxt: {
    fontSize: normalize(13),
    color: '#656565',
    marginTop: normalize(10),
  },
  eyeBtn: {
    padding: normalize(10),
  },
  detailContainer: {
    alignSelf: 'center',
    marginLeft: normalize(10),
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 0.1,
    paddingBottom: normalize(20),
  },
  ckboxStyle: {
    height: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    width: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    margin: normalize(5),
  },
  checkBoxContainerStyle: {
    alignSelf: 'flex-start',
  },
});
