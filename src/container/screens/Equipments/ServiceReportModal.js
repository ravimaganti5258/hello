import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  I18nManager,
} from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import Button from '../../../components/Button';
import { strings } from '../../../lib/I18n/index.js';
import api from '../../../lib/api';
import Loader from '../../../components/Loader/index.js';
import { FlashMessageComponent } from '../../../components/FlashMessge/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { serviceReportdisable } from '../../../redux/serviceReport/action';
import { EMAIL_REGX } from '../../../lib/validations/regex';
import LabelComponent from '../../../components/LableComponent/index';
import { useNavigation } from '@react-navigation/core';

const ServiceReportDetailsModal = ({
  visibility,
  handleModalVisibility,
  themeColor = '#17338d'
}) => {
  const { height, width } = useDimensions();
  const [loader, setLoader] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetails = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('Lorem ipsum dolor sit amet,consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore');
  const [attachment, setAttachment] = useState({});
  const [errVisible, setErrVisible] = useState(false);
  const [send, setSend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const base64PdfData = useSelector(
    (state) => state?.ServiceReportReducer?.getPdfBase64,
  );
  const htmlData = useSelector(
    (state) => state?.ServiceReportReducer?.htmlData,
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  //api function for service report email
  const serviceReportEmail = () => {
    setLoader(true);
    try {
      const userData = {
        CustomerName: jobDetails?.CustomerName,
        To: email,
        Subject: subject,
        AttachementContent: htmlData,
        Body: message,
        IsInvoice: false,
        InvoiceId: '',
        SourceId: null,
        LoginId: userInfo?.sub,
        CompanyId: userInfo?.CompanyId,
        WoJobId: jobDetails?.WoJobId,
        WorkOrderId: jobDetails?.WorkOrderId,
      };
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent(
                'success',
                strings('Response_code.EMAILSENDSUCCESS'),
                handleModalVisibility(false),
              );
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
                handleModalVisibility(false),
              );
            } else {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
                handleModalVisibility(false),
              );
            }
          }
          setLoader(false);
          handleModalVisibility();
          dispatch(serviceReportdisable(false));
        },
        error: (error) => {
          console.log(error);
          setLoader(false);
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
        },
      };
      setLoader(false);
      api.serviceReportEmail(userData, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (er) {
      console.log(er);
    }
  };

  //input validation for email
  const checkInputValidation = () => {
    const emailLength = email.length;
    if (emailLength == 0) {
      setErrVisible(true);
      setErrorMsg(strings('Response_code.EMAILISREQUIRED'));
    } else if (!EMAIL_REGX.test(email)) {
      setErrVisible(true);
      setErrorMsg(strings('Response_code.INVALIDEMAILADD'));
    } else {
      setErrVisible(false);
      serviceReportEmail();
      return errVisible;
    }
  };

  const viewPDF = async () => {
    handleModalVisibility(false);
    dispatch(serviceReportdisable(false));
    navigation.navigate('PdfViewer', { htmlData });
  };

  return (
    <>
      <Loader visibility={loader} />
      <ModalContainer
        visibility={visibility}
        handleModalVisibility={handleModalVisibility}
        containerStyles={styles.topcont}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[styles.container, { maxHeight: height / 1.4 }]}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <View
                style={styles.service}>
                <View>
                  <Text style={styles.optTxtStyles1}>
                    {' '}
                    {strings('Equipment_modal.service_report')}
                  </Text>

                  <LabelComponent
                    label={strings('Equipment_modal.email')}
                    labelStyle={{ fontSize: normalize(13) }}
                    style={styles.vertical}
                    required={true}
                  />
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setEmail(text)}
                  />

                  <LabelComponent
                    label={strings('Equipment_modal.subject')}
                    labelStyle={{ fontSize: normalize(13) }}
                    style={styles.mesage}
                    required={false}
                  />
                  <View style={{ ...styles.textInput, flexDirection: 'row' }}>
                    <Text>{I18nManager.isRTL ? `: ${jobDetails?.WoJobId}` : `${jobDetails?.WoJobId} :`}</Text>
                    <TextInput
                      style={styles.modal}
                      value={subject}
                      onChangeText={(text) => setSubject(text)}
                    />
                  </View>
                  <LabelComponent
                    label={strings('Equipment_modal.message')}
                    labelStyle={{ fontSize: normalize(13) }}
                    style={styles.mesage}
                    required={false}
                  />
                  <TextInput
                    multiline
                    numberOfLines={4}
                    style={[styles.textInput, { height: normalize(84) }]}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                  />
                  <Text
                    style={[
                      styles.optTxtStyles,
                      { textDecorationLine: 'underline' },
                    ]}
                    onPress={viewPDF}>
                    {base64PdfData?.fileName !== null
                      ? base64PdfData?.fileName
                      : `Service Report.pdf`}
                  </Text>

                  {errVisible ? (
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  ) : (
                    <Text>{''}</Text>
                  )}

                  <View style={styles.top}>
                    <Button
                      backgroundColor={themeColor}
                      title={strings('Equipment_modal.Send')}
                      txtColor={'#FFFFFF'}
                      fontSize={normalize(14)}
                      width={width / 1.27}
                      onClick={() => checkInputValidation()}
                    />
                  </View>
                </View>

              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </ModalContainer>
    </>
  );
};

export default ServiceReportDetailsModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(15),
    paddingVertical: normalize(20),
    flex: 1,
  },
  modalContainer: {
    borderRadius: normalize(8),
    width: 'auto',
  },
  top: {
    marginTop: normalize(5)
  },
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
  dividerStyles: {
    borderWidth: 0.7,
    borderColor: Colors?.greyBorder,
    marginVertical: normalize(16),
  },
  optTxtStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.regular,
    alignSelf: 'flex-start',
    marginTop: normalize(10),
    marginLeft: normalize(4),
  },
  optTxtStyles1: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
    marginBottom: normalize(15),
  },
  optBtnStyles: {
    paddingRight: normalize(70),
  },
  topcont: {
    top: "10%"
  },
  textInput: {
    height: normalize(54),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: Colors.appGray,
    borderColor: '#D9D9D9',
    width: normalize(325),
    paddingHorizontal: normalize(10),
    textAlignVertical: 'top',
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  errorText: {
    color: Colors?.red,
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
    alignSelf: 'flex-start',
    marginBottom: normalize(10),
    marginTop: normalize(-10),
    paddingLeft: normalize(4)
  },
  modal: {
    width: '80%',
    paddingLeft: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  service: {
    flexDirection: 'row',
    paddingRight: normalize(20),
    paddingHorizontal: normalize(7),
  },
  mesage: {
    marginTop: normalize(30),
    paddingLeft: normalize(5)
  },
  vertical: {
    marginVertical: normalize(2)
  },
});
