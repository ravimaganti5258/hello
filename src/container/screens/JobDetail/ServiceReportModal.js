import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  I18nManager,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import { useDimensions } from '../../../hooks/useDimensions';
import {
  dateFormat,
  fontFamily,
  normalize,
  textSizes,
} from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import api from '../../../lib/api';
import { Header } from '../../../lib/buildHeader';
import { useSelector } from 'react-redux';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { useNetInfo } from '../../../hooks/useNetInfo';
import {
  CloseWhiteIcon,
  Note,
} from '../../../assets/img/index';

const { width, height } = Dimensions.get('window');

const ServiceReportModel = ({
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
  const { isConnected, isInternetReachable } = useNetInfo();
  const [recentIndex, setRecentIndex] = useState(0);
  useEffect(() => {
    if (text) {
      setDescription(text);
    }
  }, [text]);

  useEffect(() => {
    if (type == 'Recent') {
      let data = list[recentIndex];
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
      btnName: !edit
        ? strings('technician_remark_modal.save')
        : strings('technician_remark_modal.edit'),
      onPress: () => {
        handleSave(), sethiddenKeyboards(false);
      },
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
          setRecentIndex((prev) => prev + 1);
        } else {
          handleModalVisibility();
        }
      },
      btnStyles: { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
      btnTxtStyles: { ...styles.cancelBtnTxtStyles, color: Colors?.white },
    };
    buttonCancel.push(obj);
  }

  const handleSave = () => {
    if (description == '') {
      FlashMessageComponent(
        'warning',
        strings('Other_Information.Please_fill_the_mandatory_field'),
      );
      return;
    }
    edit ? updateNotesApiCall() : insertNotesApiCall();
    handleModalVisibility();
  };

//api function for insert notes
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

  //api function for update note and remark
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

  const [hiddenKeyboards, sethiddenKeyboards] = useState(false);

  const renderItem = ({ item, index }) => {

    var formtDate = item?.LastUpdatesmobile ? item?.LastUpdatesmobile.split(' ')[0] : item?.CreatedDatesmobile.split(' ')[0]
    var frmtTime = item?.LastUpdatesmobile ? item?.LastUpdatesmobile.split(' ')[1] : item?.CreatedDatesmobile.split(' ')[1]
    var timezone = item?.LastUpdatesmobile ? item?.LastUpdatesmobile.split(' ')[2] : item?.CreatedDatesmobile.split(' ')[2]
    return (
      <View style={styles.renderContainer}>
        <View style={styles.notesIcconView}>
          <Note
            style={{
              alignSelf: 'center',
            }}
            height={normalize(19)}
            width={normalize(19)}
          />
        </View>
        <View style={styles.notesView}>
          <Text
            style={{
              color: Colors?.black,
              fontSize: normalize(14),
              fontFamily: fontFamily.bold,
            }}>
            {formtDate +
              ' ' +
              frmtTime + ' ' + timezone +
              ' ' +
              item?.CreatedByName +
              ' ' +
              item?.Note}
          </Text>

        </View>

      </View>
    );
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
        borderRadius: normalize(0),
      }}>
      <View style={[styles.viewContainer, { maxHeight: height / 2 }]}>
        <View
          style={[styles.note, {
            backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR
          }]}>
          <Text
            style={styles.service}>
            {strings(`notes.${title}`)}
          </Text>

          <TouchableOpacity
            onPress={() => {
              sethiddenKeyboards(false);
              handleModalVisibility(), setDescription('');
            }}>
            <View>
              <CloseWhiteIcon height={normalize(13)} width={normalize(13)} />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ModalContainer>
  );
};

export default ServiceReportModel;

const styles = StyleSheet.create({
  viewContainer: {
    borderRadius: 0,
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
    textAlign: I18nManager.isRTL ? 'right' : 'left',
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
  note: {
    height: height * 0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
    alignItems: 'center',
  },
  renderContainer: {
    width: width * 0.97,
    height: height * 0.1,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.6,
    justifyContent: 'center',
  },
  notesIcconView: {
    height: height * 0.09,
    width: width * 0.15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  notesView: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 0.8,
    flexWrap: 'wrap',
    paddingRight: normalize(10),
  },
  service:{
    color: Colors?.white,
    fontSize: normalize(15),
    fontFamily: fontFamily.bold,
  },
});
