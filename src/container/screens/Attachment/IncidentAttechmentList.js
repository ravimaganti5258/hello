import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import HeaderComponent from '../../../components/header/index.js';
import {
  BlackMoreOptionIcon,
  FilterIcon,
  AttchmentIcon2,
  PPT_ICON,
  PDF_ICON,
  WhiteDeleteIcon,
  WhiteEditIcon,
  DOC_Icon,
  XLM_Icon,
  CSV_Icon,
} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors.js';
import MainHoc from '../../../components/Hoc/index.js';
import {Text} from '../../../components/Text/index.js';
import {ModalContainer} from '../../../components/Modal/index.js';
import AttchmentPickerComponent from './AttchmentPicker.js';
import AddMoreModal from '../JobList/addMore.js';
import {strings} from '../../../lib/I18n/index.js';
import {useIsFocused} from '@react-navigation/native';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {Header} from '../../../lib/buildHeader';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import SwipeableComponent from '../../../components/Swipeable/index.js';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';
import Loader from '../../../components/Loader';
import {fontFamily, normalize, textSizes} from '../../../lib/globals.js';
import {useDispatch, useSelector} from 'react-redux';
import api from '../../../lib/api';
import {ImgPreviewModal} from '../../../components/ImagePreviewModal/index.js';
import AttechmentFilter from '../../../components/AttechmentFilter/AttechmentFilter.js';
import {AttcahmentIconLists} from '../../../util/sideMenu.js';
import {DataNotFound} from '../../../components/DataNotFound';
import {_renderIconBasedOnDoc} from '../../../assets/jsonData/index.js';
import RNFetchBlob from 'rn-fetch-blob';
import {useColors} from '../../../hooks/useColors.js';

const iconWidth = textSizes.h12;
const iconHeight = textSizes.h12;
const ff = fontFamily.semiBold;

const WrapperComponent = ({
  item,
  navigation,
  row,
  index,
  children,
  WOPunchPointsId,
  callback,
  data,
  setDeletedData,
  imgData,
  screenName,
  closeRow = () => null,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);

  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  const button = [
    {
      title: strings('IncidentAttachmentList.Edit'),
      action: () => handleEditAction(item),
      style: {backgroundColor: Colors.blue},
      SvgIcon:
        item?.title != ''
          ? () => <WhiteEditIcon width={iconWidth} height={iconHeight} />
          : null,
    },
    {
      title: strings('IncidentAttachmentList.Delete'),
      action: () => toggleDeleteModal(),

      style: {backgroundColor: Colors.deleateRed},
      SvgIcon:
        item?.title != ''
          ? () => <WhiteDeleteIcon width={iconWidth} height={iconHeight} />
          : null,
    },
  ];
  const button2 = [
    {
      title: strings('IncidentAttachmentList.Edit'),
      action: () => handleEditAction(item),
      style: {backgroundColor: Colors.blue},
      SvgIcon:
        item?.title != ''
          ? () => <WhiteEditIcon width={iconWidth} height={iconHeight} />
          : null,
    },
  ];

  //note delete Incident api calls  */
  const deleteIncidentAttachmentsApi = (item) => {
    try {
      const handleCallback = {
        success: (data) => {
          callback();
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            } else if (msgCode.charAt(0) === '1') {
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
          }
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
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WoPunchPointsAttachmentId=${item?.WoPunchPointsAttachmentId}`;

      api.deleteIncidentAttachments('', handleCallback, header, endPoint);
    } catch (error) {}
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteAction = (item, index) => {
    row[index].close();
    try {
      if (item?.WoPunchPointsAttachmentId) {
        deleteIncidentAttachmentsApi(item);
        toggleDeleteModal();
      } else {
        setDeletedData(item);
        toggleDeleteModal();
      }
      row[index].close();
    } catch (error) {
      toggleDeleteModal();
      row[index].close();
    }
  };

  const handleEditAction = (item) => {
    try {
      row[index].close();
      const newpath = `${RNFetchBlob.fs.dirs.DownloadDir}/test.png`;
      RNFetchBlob.fs.writeFile(newpath, item?.ByteString, 'base64');

      navigation.navigate('AddAttachment', {
        attchmentDetail: {
          ...item,
          Attachment: item?.ByteString,
          CapturedDate: item?.CreatedDate,
          CreatedByName: item?.CreatedByName
            ? item?.CreatedByName
            : item?.CreatedBy,
          LastChangedBy: item?.LastChangedBy,
          LastChangedByName: item?.LastChangedByName,
          LastUpdate: item?.LastUpdate,
          WoAttachmentId: item?.WoPunchPointsAttachmentId,
        },
        edit: true,
        type: item?.AttachmentCategoryId == 67 ? 'imageUpload' : 'docUpload',
        screenName: strings('IncidentAttachmentList.title'),
        formDetail: data,
        path: item?.ByteString,
        Path: newpath,
      });
    } catch (error) {}
  };

  return (
    <>
      <SwipeableComponent
        index={index}
        row={row}
        enabled={jobInfo?.SubmittedSource != 2 ? true : false}
        containerStyle={{
          shadowOffset: {width: 0, height: 0},
          shadowColor: Colors?.white,
          elevation: 0,
          backgroundColor: Colors.white,
        }}
        rowOpened={(index) => {
          closeRow(index);
        }}
        buttons={item?.CreatedBy == jobInfo?.TechId ? button : button2}>
        {children}
      </SwipeableComponent>
      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('IncidentAttachmentList.Confirmation')}
          discription={strings(
            'IncidentAttachmentList.Are_you_sure_want_to_Delete',
          )}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={() => handleDeleteAction(item, index)}
        />
      ) : null}
    </>
  );
};

const IncidentAttechment = ({navigation, route}) => {
  const {colors} = useColors();
  const [onToggleAttchment, setOnToggleAttchment] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [incidentAttchmentList, setAttechhmentList] = useState([]);
  const [filterMessage, setfilterMessage] = useState(false);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [filterdArray, setfilteredArray] = useState([]);
  const {data, jobInfo, screenName, imgData, Edit} = route?.params;
  const [attachmentFilterByModalVisible, setAttachmentFilterByModal] =
    useState(false);
  const [imgIndex, setimgIndex] = useState(-1);
  const [isFetching, setisFetching] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const toggleShowImage = () => {
    setShowImage(!showImage);
  };

  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };
  useEffect(() => {
    if (isFocused) {
      if (screenName != undefined && !Edit) {
        setfilteredArray(imgData);
        setAttechhmentList(imgData);
        setfilterMessage(true);
      } else {
        getIncidentAttachmentsApi();
      }
    }
  }, [isFocused]);

  const onPressFilter = (filterdata) => {
    const isEmpty = Object.keys(filterdata.attchhmentTypeName).length === 0;

    if (isEmpty === true) {
      setAttachmentFilterByModal(false);
      setfilteredArray(incidentAttchmentList);
    } else {
      setfilterMessage(true);
      let positiveArray = incidentAttchmentList.filter(function (value) {
        return (
          value?.FileName.split('.').pop() ===
          filterdata?.attchhmentTypeName?.fileName
        );
      });

      setfilteredArray(positiveArray);
      setAttachmentFilterByModal(false);
    }
  };
  const headerRightIcons = [
    {
      name: AttchmentIcon2,
      onPress:
        jobInfo?.SubmittedSource != 2
          ? () => {
              setOnToggleAttchment(!onToggleAttchment);
            }
          : () => {},
    },
    {
      name: FilterIcon,
      onPress: () => {
        setAttachmentFilterByModal(true);
      },
    },
    {
      name: BlackMoreOptionIcon,
      onPress: () => {
        toggleShowMoreOpt();
      },
    },
  ];

  const renderSeprator = () => {
    return <View style={styles.itemSeperator} />;
  };

  /*  get Incident api calls  */
  
  const getIncidentAttachmentsApi = () => {
    try {
      dispatch({type: SET_LOADER_TRUE});
      const handleCallback = {
        success: (data) => {
          let arr = '';
          if (imgData != undefined) {
            arr = data.concat(imgData);
          } else {
            arr = data;
          }
          setAttechhmentList(arr);
          setfilteredArray(arr);
          setfilterMessage(true);
          setisFetching(false);
          dispatch({type: SET_LOADER_FALSE});
        },
        error: (error) => {
          setfilterMessage(true);
          dispatch({type: SET_LOADER_FALSE});
        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&TechId=${
        jobInfo?.TechId
      }&WOPunchPointsId=${data?.WOPunchPointsId}&isPreview=${true}`;
      api.getIncidentAttechmentList('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  const _handleNavigationOnImage = (item, imgType) => {
    setOnToggleAttchment(false);
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: imgType,
      screenName: screenName
        ? screenName
        : strings('Add_Incident.Incident_Attachment_List'),
      formDetail: data,
    });
  };

  const _renderIconBasedOnDoc = (fileExt) => {
    let icon = <PDF_ICON style={styles.iconStyle} />;
    switch (fileExt) {
      case 'jpg':
        icon = <PDF_ICON style={styles.iconStyle} />;
        break;
      case 'png':
        icon = <CSV_Icon style={styles.iconStyle} />;
        break;
      case 'ppt':
        icon = <PPT_ICON style={styles.iconStyle} />;
        break;
      case 'pdf':
        icon = <PDF_ICON style={styles.iconStyle} />;
        break;
      case 'jpeg':
        icon = <PDF_ICON style={styles.iconStyle} />;
        break;
      case 'xls':
        icon = <XLM_Icon style={styles.iconStyle} />;
        break;
      case 'jgp':
        icon = <PDF_ICON style={styles.iconStyle} />;
        break;
      case 'doc':
        icon = <DOC_Icon style={styles.iconStyle} />;
        break;
      case 'docx':
        icon = <DOC_Icon style={styles.iconStyle} />;
        break;
      default:
        icon = <DOC_Icon style={styles.iconStyle} />;
        break;
    }
    return icon;
  };
  const handleLocalDelete = (item) => {
    const deletedData = filterdArray.filter(
      (ele) => ele.fileName != item.fileName,
    );
    setfilteredArray(deletedData);
  };
  const imgArr = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];

  let row = [];

  let prevOpenedRow;

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderItem = ({item, index}) => {
    const base64Image = item?.ByteString
      ? `data:image/png;base64,${item?.ByteString}`
      : undefined;
    const fileExt = item?.FileName?.split('.').pop();
    return (
      <View style={styles.flatListContainer}>
        <WrapperComponent
          item={item}
          navigation={navigation}
          row={row}
          index={index}
          closeRow={(index) => closeRow(index)}
          callback={getIncidentAttachmentsApi}
          WOPunchPointsId={data?.WOPunchPointsId}
          data={data}
          imgData={imgData}
          screenName={screenName}
          setDeletedData={handleLocalDelete}>
          <View style={styles.itemContainer}>
            {imgArr.includes(fileExt) ? (
              <TouchableOpacity
                onPress={() => {
                  setimgIndex(index),
                    base64Image != undefined ? toggleShowImage() : null;
                }}>
                <Image
                  source={{uri: base64Image}}
                  style={[styles.partsImageStyle]}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.renderIconBasedOnDocStyle}>
                {_renderIconBasedOnDoc(fileExt)}
              </View>
            )}
            <Text style={styles.fileNameTxt}>{item.FileName}</Text>
          </View>
        </WrapperComponent>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        title={strings('Add_Incident.Incident_Attchment')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <View style={styles.miniContainer}>
        {filterdArray.length > 0 ? (
          <FlatList
            data={filterdArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => `ID-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeprator}
          />
        ) : (
          <View style={styles.emptyMessageView}>
            {filterMessage && <DataNotFound />}
          </View>
        )}
      </View>

      {showImage ? (
        <ImgPreviewModal
          visibility={showImage}
          handleModalVisibility={toggleShowImage}
          data={filterdArray}
          index={imgIndex}
        />
      ) : null}
      <View style={styles.pickerStyle}>
        <ModalContainer
          visibility={onToggleAttchment}
          containerStyles={styles.modalContainerStyles}
          handleModalVisibility={() => setOnToggleAttchment(false)}>
          <View>
            <AttchmentPickerComponent
              iconColor={colors.PRIMARY_BACKGROUND_COLOR}
              containerStyle={styles.attchmntPickerStyle}
              onSelectGallery={(item) => {
                _handleNavigationOnImage(item, 'imageUpload');
              }}
              onSelectFromCamera={(item) => {
                _handleNavigationOnImage(item, 'imageUpload');
              }}
              onSelectDoc={(item) => {
                _handleNavigationOnImage(item, 'docUpload');
              }}
            />
          </View>
        </ModalContainer>
      </View>
      {showMoreOpt ? (
        <AddMoreModal
          visibility={showMoreOpt}
          handleModalVisibility={toggleShowMoreOpt}
        />
      ) : null}

      <AttechmentFilter
        visible={attachmentFilterByModalVisible}
        modalHeadingLabel="Attaachment Type"
        switchLabel="Show My Jobs Only"
        buttonTxt={strings('FilterModal.Apply')}
        modelLabelTxt="Model"
        JobStatusHeading={strings('Response_code.ATTACHEMENTTYPE')}
        hasBorder={true}
        handleModalVisibility={() => {
          setAttachmentFilterByModal(false);
        }}
        onPress={(data) => onPressFilter(data)}
        data={AttcahmentIconLists}
      />
      <Loader visibility={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  itemSeperator: {
    height: '1%',
    backgroundColor: Colors.lightSilver,
    marginVertical: normalize(2),
  },
  modalContainerStyles: {
    borderRadius: normalize(8),
  },
  partsImageStyle: {
    height: normalize(85),
    width: normalize(99),
    borderRadius: normalize(10),
  },
  img: {
    top: normalize(30),
    bottom: normalize(15),
  },
  iconStyle: {
    marginLeft: normalize(8),
    marginRight: normalize(5),
  },
  itemContainer: {
    padding: normalize(10),
    flexDirection: 'row',
  },
  flatListContainer: {
    flexDirection: 'row',
  },
  renderIconBasedOnDocStyle: {
    width: normalize(99),
  },
  fileNameTxt: {
    padding: normalize(10),
    paddingLeft: normalize(15),
    flex: 1,
    textAlign: 'left',
  },
  miniContainer: {
    flex: 1,
    margin: normalize(10),
    marginBottom: normalize(15),
  },
  emptyMessageView: {
    alignSelf: 'center',
  },
  pickerStyle: {
    justifyContent: 'center',
  },
  attchmntPickerStyle: {
    margin: normalize(30),
    backgroundColor: 'white',
  },
});

export default MainHoc(IncidentAttechment);
