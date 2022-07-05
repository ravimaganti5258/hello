import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  // Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Platform,
  ScrollView,
  I18nManager,
} from 'react-native';
import HeaderComponent from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc';
import {Input} from '../../../components/Input/index';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {strings} from '../../../lib/I18n/index.js';
import {BlackMoreOptionIcon, StarFill} from '../../../assets/img/index.js';
import CustomRatingBar from '../../../components/CustomRatingBar/CustomRatingBar';
import {Text} from '../../../components/Text';
import {useColors} from '../../../hooks/useColors';
import Switch from '../../../components/Switch';
import {Colors} from '../../../assets/styles/colors/colors';
import AddMoreModal from '../../screens/JobList/addMore';
import PairButton from '../../../components/Button/pairBtn.js';
import LabelComponent from '../../../components/LableComponent/index';
import api from '../../../lib/api/index.js';
import {buildHeader, Header} from '../../../lib/buildHeader.js';
import {FlashMessageComponent} from '../../../components/FlashMessge/index.js';
import {useSelector} from 'react-redux';
import {IsoFormat} from '../../../util/helper.js';
import ManuaSign from './ManualSign.js';
import ManualSign from './ManualSign.js';
import Loader from '../../../components/Loader';
import {accessPermission} from '../../../database/MobilePrevi/index.js';

const {width, height} = Dimensions.get('window');
const SignatureAndFeedback = ({navigation}) => {
  const {colors} = useColors();

  const [showAddMore, setShowAddMore] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [signatureValue, setSignatureValue] = useState('');
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [signture, setSignture] = useState('');
  const [signByName, setSignByName] = useState('');
  const [remark, setRemark] = useState('');
  const [feedbackProvidedBy, setFeedbackProvidedBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [defaultRating, setdefaultRating] = useState(0);
  const [imagePerview, setimagePerview] = useState(false);
  const [imgUrl, setimgUrl] = useState('');
  const [permission, setPermission] = useState({});

  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const jobDetail = useSelector((state) => state?.jobDetailReducers?.data);

  const GetCustomerFeedback = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetCustomerFeedback,
  );
  const GetWOJobSignature = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetWOJobSignature,
  );
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const [disableScroll, setDisableScroll] = useState(true);

  useEffect(() => {
    GetFeedbackOnlineApi();
  }, []);
  useEffect(() => {
    GetWojobSignOnlineApi();
  }, []);
  const GetFeedbackOnlineApi = () => {
    try {
      const handleCallback = {
        success: (res) => {
          dispatch(saveJobDetails({...jobDetail, GetCustomerFeedback: res}));
        },
        error: (Err) => {},
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetFeedbackOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({error});
    }
  };
  const GetWojobSignOnlineApi = () => {
    try {
      const handleCallback = {
        success: (res) => {
          dispatch(saveJobDetails({...jobDetail, GetWOJobSignature: res}));
        },
        error: (Err) => {},
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetWojobSignOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({error});
    }
  };

  useEffect(() => {
    if (GetCustomerFeedback != null) {
      setRemark(GetCustomerFeedback?.Feedback),
        setFeedbackProvidedBy(GetCustomerFeedback?.FeedbackBy);
      setStarRating(GetCustomerFeedback?.Rating);
      setdefaultRating(GetCustomerFeedback?.Rating);
    }
    if (GetWOJobSignature) {
      setIsEnabled(!GetWOJobSignature?.IsCustomerSignatureReq);
      setSignByName(
        GetWOJobSignature?.SignByName != null
          ? GetWOJobSignature?.SignByName
          : '',
      );
      const base64Image = GetWOJobSignature?.CustomerSignature
        ? `data:image/png;base64,${
            GetWOJobSignature?.CustomerSignature != null
              ? GetWOJobSignature?.CustomerSignature
              : ''
          }`
        : undefined;
      setSignture(GetWOJobSignature?.CustomerSignature);
      setimagePerview(
        GetWOJobSignature?.CustomerSignature != '' ? true : false,
      );
      setimgUrl(base64Image);
    }
  }, []);
  const refSign = useRef();

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  const onSubmitValidation = () => {
    if (starRating != 0) {
      if (starRating <= 3 && (remark == '' || remark == null)) {
        return false;
      } else if (
        starRating <= 3 &&
        (feedbackProvidedBy == '' || feedbackProvidedBy == null)
      ) {
        return false;
      } else return true;
    } else {
      if (starRating == 0 && (remark == '' || remark == null)) {
        return false;
      } else if (
        starRating == 0 &&
        (feedbackProvidedBy == '' || feedbackProvidedBy == null)
      ) {
        return false;
      } else return true;
    }
  };

  const _onPressSave = () => {
    try {
      const handleCallback = {
        success: (data) => {
          setIsLoading(false);
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          setTimeout(() => {
            navigation.goBack();
          }, 3000);
        },
        error: (error) => {
          setIsLoading(false);
          console.log({error}),
            FlashMessageComponent(
              'reject',
              error?.error_description
                ? error?.error_description
                : strings('rejectMsg.went_wrong'),
            );
        },
      };

      let data = {
        WoAppointmentId: jobDetail?.GetWorkOrderAppointment?.WoAppointmentId,
        CompanyId: parseInt(userInfo?.CompanyId),
        LastChangedBy: userInfo.sub,
        LastUpdate: IsoFormat(new Date()),
        CustomerSignature: signture,
        IsCustomerSignatureReq: !isEnabled,
        SignByName: signByName,
        customerfeedBack: {
          CustomerFeedbackId:
            GetCustomerFeedback?.CustomerFeedbackId != undefined &&
            GetCustomerFeedback?.CustomerFeedbackId != null
              ? GetCustomerFeedback?.CustomerFeedbackId
              : 0,
          CompanyId: parseInt(userInfo?.CompanyId),
          WoJobId: jobDetail?.GetWorkOrderAppointment?.WoJobId,
          WorkOrderId: jobDetail?.GetWorkOrderAppointment?.WorkOrderId,
          VendorId: parseInt(userInfo?.VendorId),
          CustomerId: jobDetail?.TechnicianJobInformation?.CustomerId,
          TechId: parseInt(userInfo?.sub),
          Rating: starRating,
          Feedback: remark,
          FeedbackBy: feedbackProvidedBy,
          CreatedBy: jobDetail?.TechnicianJobInformation?.CreatedBy,
          CreatedDate: jobDetail?.TechnicianJobInformation?.CreatedDate,
          LastChangedBy: null,
          LastUpdate: null,
        },
      };
      if (onSubmitValidation()) {
        setIsLoading(true);
        let headers = Header(token);
        api.saveSignAndFeedback(data, handleCallback, headers);
      } else {
        FlashMessageComponent(
          'reject',
          strings('signature_feedback.Please_fill_proper_details'),
        );
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    accessPermission('Signature & Feedback').then((res) => setPermission(res));
  }, []);

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];

  const SwitchContainer = ({
    text = '',
    onChange,
    value,
    trackColor = Colors.blue,
    disabled = false,
    textStyles,
    containerStyles,
  }) => {
    return (
      <View
        style={{
          paddingTop: normalize(5),
          ...containerStyles,
        }}>
        <Text
          align={'flex-start'}
          style={{flex: 2, ...textStyles}}
          size={textSizes.h11}>
          {text}
        </Text>
        <Switch
          value={value}
          onChange={onChange}
          trackColor={trackColor}
          disabled={jobInfo?.SubmittedSource != 2 ? disabled : true}
        />
      </View>
    );
  };
  const scrollFunction = (item) => {
    setSignByName(item);
    // setDisableScroll(true)
  };
  const customSign = () => {
    return (
      <View style={{flex: 1}}>
        <ManualSign
          setSignture={setSignture}
          preview={imagePerview}
          img={imgUrl}
          themeColor={colors.PRIMARY_BACKGROUND_COLOR}
          scrolling={(val) => {
            setDisableScroll(val);
          }}
          jobInfo={jobInfo}
        />

        <LabelComponent
          label={strings('signature_feedback.Name')}
          style={{marginLeft: normalize(5)}}
        />
        <View style={styles.dateInput}>
          <TextInput
            value={signByName}
            onChangeText={(text) => {
              scrollFunction(text);
            }}
            style={{...styles.textInputstyle, paddingLeft: Platform?.OS == 'ios' ? normalize(0) : normalize(2)}}
            editable={jobInfo?.SubmittedSource != 2 ? true : false}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <HeaderComponent
          title={strings('signature_feedback.header_title')}
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

        <View style={styles.container}>
          <ScrollView
            scrollEnabled={disableScroll}
            showsVerticalScrollIndicator={false}>
            <LabelComponent
              label={strings('signature_feedback.Signature')}
              labelStyle={styles.labelStyle}
            />
            <View style={styles.signatureSwitchContainer}>
              <SwitchContainer
                text={strings('signature_feedback.Signature_Not_Required')}
                onChange={toggleSwitch}
                value={isEnabled}
                trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
                containerStyles={styles.signatureSwitchContainer}
              />
            </View>

            {!isEnabled && customSign()}
            <LabelComponent
              label={strings('signature_feedback.Feedback')}
              labelStyle={styles.feeddbacklabelStyle}
              style={{marginVertical: normalize(7)}}
            />
            <LabelComponent
              label={strings('signature_feedback.Customer_Rating')}
              labelStyle={styles.CustomerRatingLabel}
              style={{marginTop: normalize(10)}}
            />

            <View style={styles.starratingStyle}>
              <CustomRatingBar
                setRating={setStarRating}
                Rating={defaultRating}
                jobInfo={jobInfo}
              />
            </View>

            <LabelComponent
              label={strings('signature_feedback.Remark')}
              labelStyle={styles.TxtInputLabel}
              required={starRating <= 3 ? true : false}
            />
            <TextInput
              value={remark}
              onChangeText={setRemark}
              multiline={true}
              style={{
                ...styles.remarkStyle,
                paddingLeft:
                  Platform?.OS == 'ios' ? normalize(5) : normalize(5),
              }}
              editable={jobInfo?.SubmittedSource != 2 ? true : false}
            />

            <LabelComponent
              label={strings('signature_feedback.Feedback_Provided_by')}
              labelStyle={styles.TxtInputLabel}
              style={{marginVertical: normalize(5)}}
              required={starRating <= 3 ? true : false}
            />
            <View style={styles.dateInput}>
              <TextInput
                value={feedbackProvidedBy}
                onChangeText={setFeedbackProvidedBy}
                multiline={true}
                style={{
                  ...styles.textInputstyle,
                  paddingRight:
                    Platform.OS == 'ios' ? normalize(0) : normalize(0),
                }}
                editable={jobInfo?.SubmittedSource != 2 ? true : false}
              />
            </View>
          </ScrollView>
        </View>

        <PairButton
          title1={strings('signature_feedback.Cancel')}
          title2={strings('signature_feedback.Save')}
          onPressBtn1={() => navigation.goBack()}
          onPressBtn2={() => {
            jobInfo?.SubmittedSource != 2 && permission?.Edit && _onPressSave();
          }}
          containerStyle={{marginVertical: normalize(15)}}
          disable={
            jobInfo?.SubmittedSource == 2 && permission?.Edit ? true : false
          }
          btn2Style={{
            backgroundColor:
              jobInfo?.SubmittedSource == null && permission?.Edit
                ? colors?.PRIMARY_BACKGROUND_COLOR
                : Colors?.darkGray,
          }}
        />
      </View>

      <Loader visibility={isLoading} />
    </>
  );
};

export default MainHoc(SignatureAndFeedback);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: width,
    alignSelf: 'center',
    paddingHorizontal: normalize(17),
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
    fontFamily: fontFamily.bold,
    // // fontFamily: fontFamily.bold,
  },
  feeddbacklabelStyle: {
    marginVertical: normalize(7),
    fontSize: normalize(17),
    marginTop: normalize(17),
    fontFamily: fontFamily.bold,
  },
  signatureSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  content: {
    fontSize: normalize(15),
    fontFamily: fontFamily.regular,
  },
  CustomerRatingLabel: {
    fontSize: normalize(14),
    marginVertical: normalize(10),
    fontFamily: fontFamily.regular,
  },
  starratingStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: normalize(10),
    marginBottom: normalize(20),
  },
  star: {
    height: normalize(23),
    width: normalize(28),
    resizeMode: 'contain',
    marginLeft: normalize(7),
  },
  TxtInputLabel: {
    fontSize: normalize(15),
    marginTop: normalize(14),
    fontFamily: fontFamily.regular,
  },
  buttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    borderRadius: 40,
    fontFamily: fontFamily.bold,
  },
  savebuttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002C71',
    borderRadius: 40,
    fontFamily: fontFamily.bold,
  },

  dateInput: {
    borderWidth: 1,
    borderRadius: normalize(7),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(0),
    marginVertical: normalize(5),
    borderRadius: normalize(8),
  },
  remarkStyle: {
    borderWidth: 1,
    borderColor: Colors?.borderGrey,
    height: height * 0.1,
    paddingLeft: normalize(5),
    borderRadius: 8,
    marginVertical: normalize(10),
    textAlignVertical: 'top',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  signatureStyles: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors?.borderGrey,
    height: height * 0.2,
    padding: normalize(5),
    marginHorizontal: normalize(2),
  },
  textInputstyle: {
    height: Platform.OS == 'ios' ? normalize(40) : null,
    // paddingTop: Platform.OS == 'ios' ? normalize(0) : normalize(7),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  signature: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 1,
  },
});
