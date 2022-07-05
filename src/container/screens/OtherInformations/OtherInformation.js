import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import {BlackMoreOptionIcon} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors.js';
import HeaderComponents from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import AddMoreModal from '../../screens/JobList/addMore';
import {Header} from '../../../lib/buildHeader';
import {strings} from '../../../lib/I18n/index.js';
import PairButton from '../../../components/Button/pairBtn.js';
import {useDispatch, useSelector} from 'react-redux';

import api from '../../../lib/api/index.js';
import {FlashMessageComponent} from '../../../components/FlashMessge/index.js';
import Loader from '../../../components/Loader/index.js';
import AllCustomeFields from '../../../components/AllCustomFields/index.js';
import {accessPermission} from '../../../database/MobilePrevi/index.js';
import {useColors} from '../../../hooks/useColors.js';
import {saveJobDetails} from '../../../redux/jobDetails/action';
import {DataNotFound} from '../../../components/DataNotFound/index.js';
const {width, height} = Dimensions.get('window');

const OtherInformation = ({navigation}) => {
  const {colors} = useColors();
  const [showAddMore, setShowAddMore] = useState(false);
  const [loading, setLoading] = useState('');
  const [otherPanelFields, setOtherPanelFields] = useState([]);
  const token = useSelector((state) => state?.authReducer?.token);
  const [permission, setPermission] = useState({});
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobInform = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const dispatch = useDispatch();
  const customeFields = useSelector(
    (state) => state?.jobDetailReducers?.data?.CustomFields,
  );

  const jobInfo = useSelector((state) => state?.jobDetailReducers?.data);

  useEffect(() => {
    fetchOtherInfoFields();
  }, [customeFields]);

  useEffect(() => {
    accessPermission('Other Information').then((res) => setPermission(res));
  }, []);

  const fetchOtherInfoFields = () => {
    const data = customeFields.filter((ele) => ele.PanelId == 33);
    data?.length > 0 && setOtherPanelFields(data[0]);
  };

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];

  const saveInfo = () => {
    const errRes = otherPanelFields?.CustomFields?.map((ele) => {
      if (
        ele?.IsMandatory == true &&
        (ele?.Value == null || ele?.Value == '' || ele?.Value == '0')
      ) {
        return true;
      } else {
        return false;
      }
    });

    let checkerMandatory = errRes.some((v) => v === true);

    if (otherPanelFields.CustomFields[2].Value != 0) {
      onSave();
    } else {
      FlashMessageComponent(
        'warning',
        strings('Other_Information.Please_fill_the_mandatory_field'),
      );
    }
  };

  /* for get CustomFieldsCallBack    */

  const getCustomFieldsCallBack = () => {
    let endPoint = `?CompanyId=${userInfo?.CompanyId}&woJobId=${jobInfo?.TechnicianJobInformation?.WoJobId}`;
    const cb = {
      success: (data) => {
        let res = {...jobInfo, CustomFields: data?.CustomFields};
        dispatch(saveJobDetails(res));
      },
      error: (error) => {
        console.log({error});
      },
    };
    let headers = Header(token);
    api?.GetCustomFeildsMobileOnline('', cb, headers, endPoint);
  };
  /*  CustomFieldsInsert   */

  const onSave = () => {
    const handleCallback = {
      success: (data) => {
        setLoading(false);
        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        setTimeout(() => {
          navigation.goBack();
        }, 3000);
        getCustomFieldsCallBack();
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

    setLoading(true);
    let data = otherPanelFields;
    const header = Header(token);
    api.insertcustomFields(data, handleCallback, header);
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          keyboardShouldPersistTaps="handled">
          <HeaderComponents
            title={strings('Other_Information.header_title')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
          {showAddMore ? (
            <AddMoreModal
              handleModalVisibility={toggleAddMore}
              visibility={showAddMore}
            />
          ) : null}
          <View style={styles.minicontainer}>
            {Object.keys(otherPanelFields).length > 0 ? (
              <AllCustomeFields
                CustomFields={otherPanelFields}
                setCustomFiledData={(data) => setOtherPanelFields(data)}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <DataNotFound />
              </View>
            )}
          </View>
        </ScrollView>
        <PairButton
          title1={strings('Other_Information.Cancel')}
          title2={strings('Other_Information.Save')}
          onPressBtn1={() => navigation.goBack()}
          onPressBtn2={() => {
            permission?.Edit && jobInform?.SubmittedSource != 2 && saveInfo();
          }}
          containerStyle={{marginVertical: normalize(15)}}
          btn2Style={{
            backgroundColor:
              permission?.Edit && jobInform?.SubmittedSource != 2
                ? colors?.PRIMARY_BACKGROUND_COLOR
                : Colors?.darkGray,
          }}
        />
      </View>

      <Loader visibility={loading} />
    </>
  );
};
export default MainHoc(OtherInformation);

const styles = StyleSheet.create({
  minicontainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: width,
    alignSelf: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  labelStyle: {
    marginVertical: normalize(7),
    fontSize: normalize(17),
    marginTop: normalize(10),
    fontFamily: fontFamily.regular,
  },
  content: {
    fontSize: normalize(15),
    fontFamily: fontFamily.regular,
  },
  TxtInputLabel: {
    fontSize: normalize(15),
    marginTop: normalize(17),
    fontFamily: fontFamily.regular,
    paddingLeft: 3,
  },
  buttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    borderRadius: 40,
  },
  savebuttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002C71',
    borderRadius: 40,
  },
  locationsField: {
    width: width * 0.95,
    height: height * 0.05,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 5,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  dropdownstyle: {
    width: width * 0.95,
    height: height * 0.05,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 15,
  },
  inputStyle: {
    width: width * 0.95,
    height: height * 0.05,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 5,
    paddingHorizontal: 9,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: normalize(7),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(5),
    marginVertical: normalize(5),
    borderRadius: normalize(8),
  },
  textInputstyle: {
    padding: Platform.OS === 'ios' ? normalize(15) : normalize(7),
    height: normalize(45),
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
});
