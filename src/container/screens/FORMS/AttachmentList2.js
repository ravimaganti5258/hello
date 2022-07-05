import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import {useSelector} from 'react-redux';
import HeaderComponent from '../../../components/header/index.js';
import {
  BlackMoreOptionIcon,
  FilterIcon,
  AttchmentIcon2,
  PPT_ICON,
  PDF_ICON,
  DOC_Icon,
} from '../../../assets/img/index.js';
import {fontFamily, normalize} from '../../../lib/globals.js';
import {Colors} from '../../../assets/styles/colors/colors.js';
import MainHoc from '../../../components/Hoc/index.js';
import {Text} from '../../../components/Text/index.js';
import {Header} from '../../../lib/buildHeader';
import api from '../../../lib/api';
import {ModalContainer} from '../../../components/Modal/index';
import AttchmentPickerComponent from '../../screens/Attachment/AttchmentPicker';
import AddMoreModal from '../../screens/JobList/addMore';
import AttechmentFilter from '../../../components/AttechmentFilter/AttechmentFilter';
import {strings} from '../../../lib/I18n';
import {ImgPreviewModal} from '../../../components/ImagePreviewModal/index.js';
import {useFocusEffect} from '@react-navigation/native';
import {useColors} from '../../../hooks/useColors.js';
import {DataNotFound} from '../../../components/DataNotFound/index.js';

const {width, height} = Dimensions.get('screen');

const attachmentList = [
  {
    id: 0,
    fileName: 'pdf',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 1,
    fileName: 'ppt',
    icon: PPT_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 2,
    fileName: 'doc',
    icon: DOC_Icon,
    FilePath: null,
    byteData: '',
  },
  {
    id: 3,
    fileName: 'jpg',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 4,
    fileName: 'jpeg',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 5,
    fileName: 'png',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
];
const FormAttachmentList = ({navigation, route}) => {
  const [onToggleAttchment, setOnToggleAttchment] = useState(false);

  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [attachmentFilterByModalVisible, setAttachmentFilterByModal] =
    useState(false);
  const {colors} = useColors();

  const {formData, data} = route?.params;
  const [showImage, setShowImage] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const [attechmentData, setAttechmentData] = useState([]);
  const [filterdArray, setfilteredArray] = useState([]);
  const [filterMessage, setfilterMessage] = useState(false);
  const [imgIndex, setimgIndex] = useState(0);
  const [imageData, setImagedata] = useState('');
  useEffect(() => {
    getAttachmentList();
  }, []);
  const onPressFilter = (filterdata) => {
    const isEmpty = Object.keys(filterdata.attchhmentTypeName).length === 0;
    if (isEmpty === true) {
      setAttachmentFilterByModal(false);
    } else {
      setfilterMessage(true);
      let positiveArray = attechmentData?.filter(function (value) {
        return (
          value?.FileName.split('.').pop() ===
          filterdata?.attchhmentTypeName?.fileName
        );
      });
      setfilteredArray(positiveArray);

      setAttachmentFilterByModal(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAttachmentList();
    }, []),
  );

  /* getting AttachmentList  */

  const getAttachmentList = () => {
    const handleCallback = {
      success: (data) => {
        setAttechmentData(data);
      },
      error: (error) => {
        console.log({error});
      },
    };

    const apiPayload = {
      CompanyId: userInfo?.CompanyId,
      JobId: [formData.WoJobId],
    };
    let headers = Header(token);
    api.pullSyncCheckListAttchment(apiPayload, handleCallback, headers);
  };

  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };

  const toggleShowImage = () => {
    setShowImage(!showImage);
  };
  const headerRightIcons = [
    {
      name: AttchmentIcon2,
      onPress: () => {
        setOnToggleAttchment(!onToggleAttchment);
      },
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

  const handleImageData = (item, imgType) => {
    setOnToggleAttchment(false);
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: imgType,
      screenName: 'Add Checklist Attachment',
      formDetail: route?.params?.formData,
    });
  };

  const renderItem = ({item, index}) => {
    const base64Image = item?.Attachment
      ? `data:image/png;base64,${item?.Attachment}`
      : undefined;
    return (
      <TouchableOpacity>
        <View style={styles.renderContainer}>
          {base64Image ? (
            <TouchableOpacity
              onPress={() => {
                setimgIndex(index), setImagedata(base64Image);
                toggleShowImage();
              }}>
              <Image
                source={{uri: base64Image}}
                style={[styles.partsImageStyle]}
              />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}

          <Text style={styles.fileNameStyle}>{item.FileName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title={'Attachments List'}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <View style={styles.miniContainer}>
        {filterMessage == true ? (
          <FlatList
            data={filterdArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => `ID-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeprator}
          />
        ) : (
          <FlatList
            data={attechmentData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `ID-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeprator}
          />
        )}
        <View style={styles.modalcontainer}>
          <ModalContainer
            visibility={onToggleAttchment}
            containerStyles={styles.modalContainerStyles}
            handleModalVisibility={() => setOnToggleAttchment(false)}>
            <View>
              <AttchmentPickerComponent
                iconColor={colors.PRIMARY_BACKGROUND_COLOR}
                containerStyle={{
                  margin: normalize(30),
                  backgroundColor: 'white',
                }}
                onSelectGallery={(item) => {
                  handleImageData(item, 'imageUpload');
                }}
                onSelectFromCamera={(item) => {
                  handleImageData(item, 'imageUpload');
                }}
                onSelectDoc={(item) => {
                  handleImageData(item, 'docUpload');
                }}
                iconColor={colors?.PRIMARY_BACKGROUND_COLOR}
              />
            </View>
          </ModalContainer>
        </View>
      </View>
      <AttechmentFilter
        visible={attachmentFilterByModalVisible}
        modalHeadingLabel="Attaachment Type"
        switchLabel="Show My Jobs Only"
        onChangeVal={toggleSwitch}
        switchValue={isEnabled}
        buttonTxt={strings('FilterModal.Apply')}
        modelLabelTxt="Model"
        JobStatusHeading={strings('Response_code.ATTACHEMENTTYPE')}
        hasBorder={true}
        handleModalVisibility={() => {
          setAttachmentFilterByModal(false);
        }}
        onPress={(data) => onPressFilter(data)}
        data={attachmentList}
      />
      {showMoreOpt ? (
        <AddMoreModal
          visibility={showMoreOpt}
          handleModalVisibility={toggleShowMoreOpt}
        />
      ) : null}
      {showImage ? (
        <ImgPreviewModal
          visibility={showImage}
          handleModalVisibility={toggleShowImage}
          containerStyles={{top: normalize(50)}}
          data={filterMessage == true ? filterdArray : attechmentData}
          type={'Form Attachment'}
          index={imgIndex}
        />
      ) : null}
      {filterdArray.length == 0 && filterMessage === true ? (
        <DataNotFound />
      ) : null}
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
  },
  modalContainerStyles: {
    borderRadius: normalize(8),
  },
  partsImageStyle: {
    height: normalize(85),
    width: normalize(99),
    borderRadius: normalize(10),
  },
  container: {
    flex: 1,
  },
  renderContainer: {
    padding: normalize(10),
    flexDirection: 'row',
  },
  fileNameStyle: {
    padding: normalize(20),
    flex: 1,
  },
  miniContainer: {
    margin: normalize(20),
  },
  modalcontainer: {
    justifyContent: 'center',
  },
});

export default MainHoc(FormAttachmentList);
