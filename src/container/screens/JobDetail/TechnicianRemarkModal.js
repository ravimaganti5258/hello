import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  I18nManager
} from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import MultiButton from '../../../components/MultiButton';
import { strings } from '../../../lib/I18n';
import api from '../../../lib/api';
import { Header } from '../../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { useNetInfo } from '../../../hooks/useNetInfo';

const TechnicianRemarkModal = ({
  handleModalVisibility,
  visibility,
  title,
  text,
  getNoteId,
  edit,
  button,
  WorkOrderId,
  jobId,
  callback,
  type,
  list,
}) => {
  const { colors } = useColors();
  const { height } = useDimensions();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const [description, setDescription] = useState('');
  const { isConnected } = useNetInfo();
  const [recentIndex, setRecentIndex] = useState(0);
  const [hiddenKeyboards, sethiddenKeyboards] = useState(false);

  useEffect(() => {
    if (text) {
      setDescription(text);
    }
  }, [text]);

  useEffect(() => {
    if (type == 'Recent') {

      let data = list[recentIndex]
      setDescription(data?.Note);
    }

  }, [type, recentIndex, list]);

  const buttons = [
    {
      btnName: strings('technician_remark_modal.cancel'),
      onPress: () => {
        sethiddenKeyboards(false);
        handleModalVisibility(), setDescription('');
      },
      btnStyles: styles.cancelBtnStyles,
      btnTxtStyles: styles.cancelBtnTxtStyles,
    },
    {
      btnName: !edit ? strings('technician_remark_modal.save') : strings('technician_remark_modal.edit'),
      onPress: () => { handleSave(), sethiddenKeyboards(false); },
      btnStyles: { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
      btnTxtStyles: { ...styles.cancelBtnTxtStyles, color: Colors?.white },
    },
  ];
  const buttonCancel = [
    {
      btnName: strings('technician_remark_modal.cancel'),
      onPress: () => {
        handleModalVisibility();
      },
      btnStyles: styles.cancelBtnStyles,
      btnTxtStyles: styles.cancelBtnTxtStyles,
    },
  ];

  if (list?.length - 1 != recentIndex) {
    let obj = {
      btnName: strings('technician_remark_modal.next'),
      onPress: () => {
        if (list.length > 0) {
          setRecentIndex((prev) => prev + 1)
        }
        else {
          handleModalVisibility();
        }
      },
      btnStyles: { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
      btnTxtStyles: { ...styles.cancelBtnTxtStyles, color: Colors?.white },
    }
    buttonCancel.push(obj)
  }

  const handleSave = () => {
    if (description == '') {
      handleModalVisibility()
      FlashMessageComponent('warning', strings('Other_Information.Please_fill_the_mandatory_field'));
      return;
    }
    edit ? updateNotesApiCall() : insertNotesApiCall();
    handleModalVisibility();
  };

  //api function to insert notes
  const insertNotesApiCall = () => {
    const handleCallback = {
      success: (data) => {
        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        setDescription('');
        let cbId =
          title === 'Service Notes' ? 0 : title == 'Technician Remarks' ? 1 : 2;
        callback(cbId);
      },
      error: (error) => {
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : strings('rejectMsg.went_wrong'),
        );
        console.log({ error });
      },
    };

    const noteMasterID =
      title === 'Service Notes' ? 43 : title == 'Technician Remarks' ? 42 : 1;
    const primarykey =
      title === 'Service Notes'
        ? WorkOrderId
        : title === 'Technician Remarks'
          ? jobId
          : 28;

    let apiPayload = {
      NotesID: 0,
      NotesMasterId: noteMasterID,
      PrimaryKeyId: primarykey,
      CompanyId: userInfo.CompanyId,
      Note: description,
      CreatedBy: userInfo.sub,
      SouceTypeId: 1,
      CreatedSourceId: 2,
    };

    let headers = Header(token);

    if (isConnected) {
      api.insetNotes(apiPayload, handleCallback, headers);
    }
  };

  //api function for update notes
  const updateNotesApiCall = () => {
    const handleCallback = {
      success: (data) => {

        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        setDescription('');
        let cbId =
          title === 'Service Notes' ? 0 : title == 'Technician Remarks' ? 1 : 2;
        callback(cbId);
      },
      error: (error) => {
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : strings('rejectMsg.went_wrong'),
        );
      },
    };

    const noteMasterID =
      title === 'Service Notes' ? 43 : title === 'Technician Remarks' ? 42 : 1;

    const primarykey =
      title === 'Service Notes'
        ? WorkOrderId
        : title == 'Technician Remarks'
          ? jobId
          : 28;
    let apiPayload = {
      NotesID: getNoteId,
      NotesMasterId: noteMasterID,
      PrimaryKeyId: primarykey,
      CompanyId: userInfo.CompanyId,
      Note: description,
      CreatedBy: userInfo.sub,
      SouceTypeId: 1,
      CreatedSourceId: 2,
    };

    let headers = Header(token);
    api.updateNotes(apiPayload, handleCallback, headers);
  };

  const onFocusFun = () => {
    sethiddenKeyboards(true);
  };
  const onBlurFun = () => {
    sethiddenKeyboards(false);
  };
  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleModalVisibility}
      containerStyles={{
        top:
          hiddenKeyboards == true
            ? Platform.OS == 'ios'
              ? normalize(100)
              : normalize(50)
            : normalize(150),
      }}>
      <View style={[styles.viewContainer, { maxHeight: height / 2 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          style={{ flexGrow: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={'padding'}
            keyboardVerticalOffset={normalize(100)}>
            <Text style={styles?.remarkTxt}>{strings(`notes.${title}`)}</Text>
            {button !== 'cancel' ? (
              <TextInput
                editable={type == 'Recent' ? false : true}
                style={styles.txtAreaStyles}
                multiline={true}
                value={description}
                onFocus={() => {
                  onFocusFun();
                }}
                onBlur={() => onBlurFun()}
                onChangeText={setDescription}
              />
            ) : (
              <View style={styles.txtStyles}>
                <Text style={styles.description}>{description}</Text>
              </View>
            )}

            <MultiButton
              buttons={type !== 'Recent' ? buttons : buttonCancel}
              constinerStyles={styles.btnsContainer}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default TechnicianRemarkModal;

const styles = StyleSheet.create({
  viewContainer: {
    padding: normalize(20),
  },
  remarkTxt: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
  },
  btnsContainer: {
    marginTop: normalize(35),
    paddingHorizontal: normalize(20),
  },
  txtAreaStyles: {
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    marginTop: normalize(10),
    textAlignVertical: 'top',
    borderRadius: normalize(8),
    fontSize: normalize(14),
    padding: normalize(10),
    height: normalize(140),
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  description: {
    textAlign: 'center',
    textAlignVertical: 'top',
    fontSize: normalize(14),
    padding: normalize(10),
    height: normalize(140),
  },
  txtStyles: {
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    marginTop: normalize(10),
    borderRadius: normalize(8),
    fontSize: normalize(14),
    padding: normalize(10),
    height: normalize(140),
  },
  cancelBtnStyles: {
    backgroundColor: Colors?.silver,
  },
  cancelBtnTxtStyles: {
    fontSize: normalize(14),
  },
});
