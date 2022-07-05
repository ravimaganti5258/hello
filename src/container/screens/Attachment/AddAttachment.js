import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {BlackMoreOptionIcon, EditBlackIcon} from '../../../assets/img';
import {Colors} from '../../../assets/styles/colors/colors';
import PairButton from '../../../components/Button/pairBtn';
import {Dropdown} from '../../../components/Dropdown';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import HeaderComponent from '../../../components/header/index';
import MainHoc from '../../../components/Hoc';
import ImageEditorComponent from '../../../components/ImgEditor/ImageEditor';
import {Input} from '../../../components/Input';
import Loader from '../../../components/Loader';
import {Text} from '../../../components/Text';
import {queryAllRealmObject} from '../../../database';
import {MASTER_DATA} from '../../../database/webSetting/masterSchema';
import {useColors} from '../../../hooks/useColors';
import api from '../../../lib/api';
import {Header} from '../../../lib/buildHeader';
import {
  convertFrom24To12Format,
  dateFormat,
  fontFamily,
  normalize,
  textSizes,
} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import AddMoreModal from '../JobList/addMore';
const TAGS = [
  {id: 1, label: 'Before Job', value: 'Before Job'},
  {id: 2, label: 'After Job', value: 'After Job'},
];
const AddAttachment = ({navigation, route}) => {
  const {attchmentDetail, edit, type, screenName, formDetail, Path} =
    route?.params;
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [tagArr, setTagArr] = useState(TAGS);
  const [selectedTag, setSelectedTag] = useState({});
  const [fileName, setFileName] = useState(attchmentDetail?.FileName || '');
  const [description, setDescription] = useState(
    attchmentDetail?.Description || '',
  );
  const [image, setImage] = useState({});
  const [imgView, setimgView] = useState(false);
  const [Edit, setEdit] = useState(false);
  const {colors} = useColors();
  const onFocusOut = () => {};
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetail = useSelector((state) => state?.jobDetailReducers);
  const [attchementDetails, setattchementDetails] = useState({});
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const dispatch = useDispatch();
  const [uploadedFromAttch, setuploadedFromAttch] = useState(null);
  const [capturDate, setcaptureDate] = useState(null);
  const [imgbasesipath, setImgbasesipath] = useState(null);
  const [typeOfImg, settypeOfImg] = useState(null);
  const [imagepath, setimagepath] = useState(null);
  const [imageFileName, setimageFileName] = useState(null);

  useEffect(() => {
    fetchDataRealm();
  }, [route]);
  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };

  useEffect(() => {
    if (route?.params?.attchmentDetail) {
      setFileName(attchmentDetail?.fileName);
      setImage(attchmentDetail);
      setuploadedFromAttch(route?.params?.attchmentDetail?.UploadedFrom);
      setcaptureDate(route?.params?.attchmentDetail?.date);
      setImgbasesipath(route?.params?.attchmentDetail?.base64);
      settypeOfImg(route?.params?.attchmentDetail?.type);
      setimageFileName(route?.params?.attchmentDetail?.fileName);
      setimagepath(route?.params?.attchmentDetail?.path);
      type === 'imageUpload' ? setimgView(true) : setimgView(false);
    }
    if (edit) {
      //setting imageview false to avoid edit option for edit image.
      setimgView(false);
      setEdit(edit);
      setFileName(attchmentDetail?.FileName);
      setattchementDetails(attchmentDetail);
      setImage({
        ...image,
        base64: `data:image/png;base64,${
          attchmentDetail?.AttachmentTumbnail
            ? attchmentDetail?.AttachmentTumbnail
            : attchmentDetail?.Attachment
        }`,
        path: attchmentDetail?.FilePath,
      });
      let sortTag = [];
      tagArr.map((ele) => {
        if (ele?.id == attchmentDetail?.AttachementTypeId) {
          sortTag.push(ele);
        }
      });

      sortTag.length > 0 && setSelectedTag(sortTag[0]);
    }
  }, [route, tagArr]);

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];
  const editDesriptionInfo = (label, value) => {
    return (
      <View style={styles.editImgInfoWrap}>
        <Text style={styles.editInfoLabelTxt} fontFamily={fontFamily.semiBold}>
          {`${label}`}
        </Text>
        <Text style={styles.colonStyle}>{':'}</Text>
        <Text style={styles.editInfoValTxt} fontFamily={fontFamily.semiBold}>
          {value}
        </Text>
      </View>
    );
  };

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.AttachmentTypes.map((obj) => {
          let data = {
            id: obj.AttachmentTypeId,
            label: obj.AttachmentType,
            value: obj.AttachmentType,
          };
          return data;
        });

        if (result != undefined && result.length > 0) {
          setTagArr(result);
        }
      })

      .catch((error) => {});
  };

  /* note save Form api call  */
  const onFormAttchmentSave = () => {
    if (fileName !== '') {
      const handleCallback = {
        success: (data) => {
          setLoading(false);
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            FlashMessageComponent(
              'Success',
              strings(`Response_code.${msgCode}`),
            );
          } else {
            FlashMessageComponent('success', data?.Message?.MessageCode);
          }
          navigation.goBack();
        },
        error: (error) => {
          FlashMessageComponent('reject', strings('rejectMsg.went_wrong'));
          setLoading(false);
        },
      };
      const splitDate = !edit ? attchmentDetail?.date?.split(':') : new Date();
      const selectedDate = dateFormat(splitDate[0], 'MM/DD/YYYY');
      let datefrmt = moment(splitDate[0]).format('L');
      const time = !edit
        ? convertFrom24To12Format(attchmentDetail?.date)
        : '00:00:00 AM';
      setLoading(true);
      let apiPayload = [];

      let formAttchment = {
        WoJobChklistDtlListId: 0,
        CompanyId: userInfo?.CompanyId,
        WoJobChklistDtlId: formDetail?.WoJobChecklistDetailId,
        AttachmentCategoryId: type === 'imageUpload' ? 67 : 68,
        AttachementTypeId: '69',
        Description: description,
        CapturedDate: dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
        FileName: fileName,
        Attachment: attchmentDetail?.base64,
        FilePath: attchmentDetail?.path,
        CreatedBy: userInfo?.sub,
        CreatedDate: dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
        CreatedSourceId: 2,
        CreatedSourceLoginId: userInfo?.sub,
        ChklistDtlId: formDetail?.ChklistDtlId,
        ChklistMastId: formDetail?.ChklistMastId,
        TechId: userInfo?.sub,
        WorkOrderId: jobDetail?.TechnicianJobInformation?.WorkOrderId,
        WoJobId: jobDetail?.TechnicianJobInformation?.WoJobId,
        ContentType: attchmentDetail?.type,
        referenceID: '',
      };
      apiPayload.push(formAttchment);
      let headers = Header(token);
      setLoading(false);
      api.saveFormAttachment(apiPayload, handleCallback, headers);
    } else {
      FlashMessageComponent('warning', strings('fill_proper.details'));
    }
  };

  /* note Add/Edit attachment api call  */
  
  const onPressSave = () => {
    if (fileName !== '') {
      const handleCallback = {
        success: (data) => {
          setLoading(false);
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            FlashMessageComponent(
              'Success',
              strings(`Response_code.${msgCode}`),
            );
          } else {
            FlashMessageComponent('success', data?.Message?.MessageCode);
          }
          setTimeout(() => {
            screenName === 'Add Attachment' || screenName === 'Edit Attachment'
              ? screenName === 'Edit Attachment'
                ? navigation.goBack()
                : navigation.pop(2)
              : null;
          }, 1800);
        },
        error: (error) => {
          FlashMessageComponent('reject', strings('rejectMsg.went_wrong'));
          setLoading(false);
        },
      };

      const splitDate = !edit ? attchmentDetail?.date?.split(':') : new Date();
      const time = !edit ? convertFrom24To12Format(attchmentDetail?.date) : '00:00:00 AM';
      setLoading(true);
      let apiPayload = [];
      try {
        image.base64 = image?.base64.replace('data:image/png;base64,', '');
      } catch (e) {
        console.log(e);
      }
      const contentType = route.params.edit
        ? `.${attchmentDetail.FileName.split('.')[1]}`
        : attchmentDetail?.type;
      let attchamentobj = {
        WoAttachmentId: !edit ? 0 : attchmentDetail?.WoAttachmentId,
        CompanyId: userInfo?.CompanyId,
        WorkOrderId: jobDetail?.TechnicianJobInformation?.WorkOrderId,
        WoJobId: jobDetail?.TechnicianJobInformation?.WoJobId,
        AttachmentCategoryId: type === 'imageUpload' ? 67 : 68,
        AttachementTypeId: selectedTag?.id,
        Description: description,
        FileName: fileName,
        CapturedDate: dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
        CreatedBy: userInfo?.sub,
        Attachment: image?.base64,
        TimeZoneId: jobDetail?.TechnicianJobInformation?.TechTimeZoneId,
        Latitude: jobDetail?.TechnicianJobInformation?.ZipLat,
        Longitude: jobDetail?.TechnicianJobInformation?.ZipLon,
        Address: jobDetail?.TechnicianJobInformation?.AcctualAddress,
        CreatedSourceId:
          jobDetail?.WOJobDetails[0]?.CreatedSourceId != null
            ? jobDetail?.WOJobDetails[0]?.CreatedSourceId
            : 2,
        ContentType: contentType,
        TechId: userInfo?.sub,
        JobStatusId: jobDetail?.TechnicianJobInformation?.JobStatusid,
      };
      apiPayload.push(attchamentobj);
      let headers = Header(token);
      api.saveAttchment(apiPayload, handleCallback, headers);
    } else {
      FlashMessageComponent('Warning', strings('fill_proper.details'));
    }
  };

  const onPressUplaod = () => {
    switch (screenName) {
      case 'Incident Attachment':
        dispatch({type: SET_LOADER_FALSE});
        return navigation.navigate('AddIncident', {
          filename: imageFileName,
          imagePath: imagepath,
          imageBaseversions: imgbasesipath,
          Description: description,
          uploadedFrom: uploadedFromAttch,
          CapturedDate: capturDate,
          imageType: typeOfImg,
          uploadedfrom: type,
          data: {
            FileName: imageFileName,
            filename: imageFileName,
            imagePath: imagepath,
            ByteString: imgbasesipath,
            Description: description,
            uploadedFrom: uploadedFromAttch,
            CapturedDate: capturDate,
            imageType: typeOfImg,
            uploadedfrom: type,
            AttachmentCategoryId: type === 'imageUpload' ? 67 : 68,
            AttachementTypeId: selectedTag?.id,
            CreatedBy: userInfo?.sub,
            CreatedByName: userInfo?.DisplayName,
            CreatedDate: dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
            CreatedSourceId: 2,
          },
          incidentAttchment: true,
        });
      case 'Add Attachment':
      case 'Edit Attachment':
        dispatch({type: SET_LOADER_FALSE});
        return onPressSave();

      case 'Incident Attachment List':
        return addAttachmentInExistingIncident();

      case 'Add Checklist Attachment':
        dispatch({type: SET_LOADER_FALSE});
        return onFormAttchmentSave();
      default:
        dispatch({type: SET_LOADER_FALSE});
        return onFormAttchmentSave();
    }
  };
  const addAttachmentInExistingIncident = () => {
    dispatch({type: SET_LOADER_TRUE});

    const contentType = route.params.edit
      ? `.${attchmentDetail.FileName.split('.')[1]}`
      : attchmentDetail?.type;

    image.base64 = image?.base64.replace('data:image/png;base64,', '');
    const data = [
      {
        WoAttachmentId: !route.params.edit
          ? 0
          : attchmentDetail?.WoAttachmentId,
        CompanyId: userInfo?.CompanyId,
        AttachmentCategoryId: type === 'imageUpload' ? 67 : 68,
        AttachementTypeId: selectedTag?.id,
        Description: description,
        CapturedDate: dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
        FileName: edit ? fileName : fileName,
        Attachment: edit ? image?.base64 : attchmentDetail.base64,
        FilePath: edit ? attchmentDetail?.FilePath : attchmentDetail?.path,
        CreatedBy: userInfo?.sub,
        LastChangedBy: userInfo?.sub,
        LastChangedByName: userInfo?.DisplayName,
        CreatedDate: dateFormat(new Date(), 'MM/DD/YYYY HH:MM:MS 12TF'),
        CreatedSourceId: 2,
        CreatedSourceLoginId: userInfo?.sub,
        TechId: userInfo?.sub,
        WorkOrderId: jobDetail?.TechnicianJobInformation?.WorkOrderId,
        WoJobId: jobDetail?.TechnicianJobInformation?.WoJobId,
        ContentType: edit ? contentType : attchmentDetail?.type,
        referenceID: 0,
        SubCategoryId: 5,
        WOPunchPointsId: formDetail?.WOPunchPointsId,
        TimeZoneId: 2,
      },
    ];
    const handleCallback = {
      success: (data) => {
        dispatch({type: SET_LOADER_FALSE});
        const msgCode = data?.Message?.MessageCode;
        if (msgCode.length > 0) {
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          dispatch({type: SET_LOADER_FALSE});
        }
        setLoading(false);
        setTimeout(() => {
          navigation.goBack();
        }, 700);
      },
      error: (error) => {
        setLoading(false);
        dispatch({type: SET_LOADER_FALSE});
      },
    };
    const header = Header(token);
    api.uploadIncidentAttechment(data, handleCallback, header);
  };

  return (
    <View style={styles.container}>
      <Loader visibility={isLoading} />
      <HeaderComponent
        title={screenName}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
        headerRightText={!imgView ? '' : strings('attachments.Save')}
        rightTextStyle={{
          ...styles.headerStyle,
          color: colors?.PRIMARY_BACKGROUND_COLOR,
        }}
        onPressRightText={() => {
          setimgView(false);
        }}
      />
      {!imgView ? (
        <View style={styles.bodyContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <>
              <Text style={styles.lableTextStyle}>
                {strings('attachments.file_name')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  fileName != ''
                    ? setimgView(true)
                    : navigation.navigate('Attachment', {
                        attchmentDetail: undefined,
                        edit: false,
                        type: undefined,
                        screenName: screenName,
                      });
                }}>
                <Input
                  style={[styles.inputFieldStyle]}
                  value={fileName}
                  onEndEditing={onFocusOut}
                  onChangeText={setFileName}
                  containerStyle={[styles.dateInput]}
                  editable={false}
                  inputContainer={styles.costomInputStyle}
                  rightIcon={
                    <EditBlackIcon
                      width={normalize(16)}
                      height={normalize(15)}
                    />
                  }
                />
              </TouchableOpacity>
              <Text style={styles.lableTextStyle}>
                {strings('attachments.tag')}
              </Text>
              <Dropdown
                style={styles.dropDownWrap}
                hasBorder={true}
                label={selectedTag.label}
                list={tagArr}
                selectedItem={selectedTag}
                handleSelection={setSelectedTag}
                zIndexVal={0}
                align={'flex-start'}
                dropDownContainer={styles.dropDownContainerStyle}
                dropDownBodyContainer={styles.dropDownBodyContainerStyle}
                itemStyle={styles.dropdownTextStyle}
              />

              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={'padding'}
                keyboardVerticalOffset={normalize(100)}>
                <Text style={styles.lableTextStyle}>
                  {strings('attachments.description')}
                </Text>
                <TextInput
                  style={styles.txtAreaStyles}
                  multiline={true}
                  value={description}
                  onChangeText={setDescription}
                />
              </KeyboardAvoidingView>
              {edit && (
                <View style={styles.imgDetailWrap}>
                  {editDesriptionInfo(
                    strings('attachments.date_taken'),
                    attchementDetails?.CapturedDate == null
                      ? ' -'
                      : dateFormat(
                          attchementDetails?.CapturedDate,
                          'DD/MM/YYYY HH:MM:MS 12TF',
                        ),
                  )}
                  {editDesriptionInfo(
                    strings('attachments.uploaded_by'),
                    // attchementDetails?.CreatedByName
                    //   ? attchementDetails?.CreatedByName
                    //   :
                    attchementDetails?.CreatedBy == userInfo?.sub
                      ? userInfo?.DisplayName
                      : attchementDetails?.CreatedBy,
                  )}
                  {editDesriptionInfo(
                    strings('attachments.uploaded_on'),
                    attchementDetails?.CapturedDate == null
                      ? ' -'
                      : dateFormat(
                          attchementDetails?.CapturedDate,
                          'DD/MM/YYYY HH:MM:MS 12TF',
                        ),
                  )}
                  {editDesriptionInfo(
                    strings('attachments.last_modified_by'),
                    attchementDetails?.LastChangedBy == null
                      ? '  -'
                      : attchementDetails?.LastChangedBy == userInfo?.sub
                      ? userInfo?.DisplayName
                      : attchementDetails?.LastChangedBy,
                  )}
                  {editDesriptionInfo(
                    strings('attachments.last_modified_on'),
                    attchementDetails?.LastUpdate == null
                      ? '  -'
                      : dateFormat(
                          attchementDetails?.LastUpdate,
                          'DD/MM/YYYY HH:MM:MS 12TF',
                        ),
                  )}

                  {editDesriptionInfo(
                    strings('attachments.latitude'),
                    attchementDetails?.Latitude != null
                      ? attchementDetails?.Latitude
                      : '17.88',
                  )}
                  {editDesriptionInfo(
                    strings('attachments.longitude'),
                    attchementDetails?.Longitude != null
                      ? attchementDetails?.Longitude
                      : '19.88',
                  )}
                </View>
              )}
            </>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.imgContainer}>
          <Image
            style={styles.imgstyle}
            source={{
              uri: Edit ? image?.base64 : image.path,
            }}
            resizeMode={'contain'}></Image>
        </View>
      )}

      {showMoreOpt ? (
        <AddMoreModal
          visibility={showMoreOpt}
          handleModalVisibility={toggleShowMoreOpt}
        />
      ) : null}

      {!imgView ? (
        <View style={styles.footer}>
          <PairButton
            title1={strings('pair_button.cancel')}
            title2={
              !edit
                ? strings('pair_button.upload')
                : strings('pair_button.update')
            }
            onPressBtn2={() => {
              dispatch({type: SET_LOADER_TRUE});
              onPressUplaod();
            }}
            onPressBtn1={() => {
              navigation.goBack();
            }}
          />
        </View>
      ) : (
        <ImageEditorComponent
          image={image}
          setEditImg={setEdit}
          Edit={Edit}
          setUpdatedImgCropData={setImage}
          setEditedImgData={setImage}
          Path={Path}
        />
      )}
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
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    paddingTop: normalize(5),
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 0.1,
    paddingBottom: normalize(20),
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(5),
    color: 'black',
  },
  inputFieldStyle: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
    color: Colors?.black,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: normalize(7),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(5),
  },
  txtAreaStyles: {
    minHeight: normalize(100),
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    marginTop: normalize(10),
    textAlignVertical: 'top',
    borderRadius: normalize(7),
    fontSize: normalize(14),
    padding: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  remarkTxt: {
    fontSize: textSizes.h10,
    alignSelf: 'flex-start',
  },
  bodyContainer: {
    flex: 0.9,
    marginHorizontal: normalize(20),
    marginVertical: normalize(10),
  },
  lableTextStyle: {
    paddingTop: normalize(20),
    paddingLeft: normalize(5),
    alignSelf: 'flex-start',
  },
  dropDownBodyContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 2,
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(7),
  },
  inputLableStyle: {
    padding: normalize(5),
    marginLeft: normalize(2),
  },
  editImgInfoWrap: {
    flexDirection: 'row',
    paddingVertical: normalize(6),
  },
  editInfoLabelTxt: {
    flex: 0.6,
    textAlign: 'left',
  },
  editInfoValTxt: {
    flex: 1,
    marginLeft: normalize(5),
    textAlign: 'left',
  },

  imgDetailWrap: {
    marginTop: normalize(30),
    marginHorizontal: normalize(5),
  },
  imgstyle: {
    height: '100%',
    width: '100%',
  },
  colonStyle: {
    fontFamily: fontFamily.semiBold,
    marginLeft: I18nManager.isRTL ? normalize(10) : normalize(10),
  },
  fRWSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costomInputStyle: {
    marginTop: normalize(3),
  },
  imgContainer: {
    flex: 2,
  },
});

export default MainHoc(AddAttachment);
