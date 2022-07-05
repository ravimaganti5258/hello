import React, { useEffect, useState } from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

import MainHoc from '../../../components/Hoc';
import HeaderComponents from '../../../components/header';
import {
  BlackMoreOptionIcon,
  FilterIcon,
  PPT_ICON,
  PDF_ICON,
  XLM_Icon,
  CSV_Icon,
  DOC_Icon,
} from '../../../assets/img';
import { fontFamily, normalize } from '../../../lib/globals';
import { Colors } from '../../../assets/styles/colors/colors';
import { strings } from '../../../lib/I18n';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import { Text } from '../../../components/Text';
import { ImgPreviewModal } from '../../../components/ImagePreviewModal';
import AttechmentFilter from '../../../components/AttechmentFilter/AttechmentFilter';
import { DataNotFound } from '../../../components/DataNotFound';
import AddMoreModal from '../JobList/addMore';

// function for equipments attachment card
const EquipAttachmentCard = ({ item, index, data }) => {
  const [showImage, setShowImage] = useState(false);
  const uri = item?.Attachment
    ? `data:image/png;base64,${item?.Attachment}`
    : undefined;
  const toggleShowImage = () => {
    setShowImage(!showImage);
  };
  const fileExt = item?.FileName?.split('.').pop();
  const imgArr = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG']
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
      case 'doc':
        icon = <DOC_Icon style={styles.iconStyle} />;
        break;
      case 'docx':
        icon = <DOC_Icon style={styles.iconStyle} />;
        break;
      case 'xls':
        icon = <XLM_Icon style={styles.iconStyle} />;
        break;
      case 'jgp':
        icon = <PDF_ICON style={styles.iconStyle} />;
        break;

      default:
        icon = <PDF_ICON style={styles.iconStyle} />;
        break;
    }
    return icon;
  };
  return (
    <View style={styles.cardContainer}>
      {uri && imgArr.includes(fileExt) ? (
        <TouchableOpacity
          onPress={() => {
            uri != undefined && toggleShowImage();
          }}>
          <Image
            source={{ uri: uri }}
            resizeMode={'cover'}
            style={styles.imageStyles}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.width}>
          {_renderIconBasedOnDoc(fileExt)}
        </View>
      )}
      <Text style={styles.titleStyles}>{item?.Description}</Text>
      {/* for image preview in card */}
      {showImage ? (
        <ImgPreviewModal
          visibility={showImage}
          handleModalVisibility={toggleShowImage}
          containerStyles={styles.img}
          data={data}
          index={index}
          type={'Form Attachment'}
        />
      ) : null}
    </View>
  );
};

const EquipmentAttachment = ({ route }) => {
  const { attachmentData, screenName } = route?.params;
  const [equipAttachment, setEquipAttachment] = useState([]);
  const [message, setMessage] = useState('');
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [attachmentFilterByModalVisible, setAttachmentFilterByModal] =
    useState(false);
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
      icon: PDF_ICON,
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
    {
      id: 6,
      fileName: 'docx',
      icon: DOC_Icon,
      FilePath: null,
      byteData: '',
    },
  ];
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [filterMessage, setfilterMessage] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [filterdArray, setfilteredArray] = useState([]);
  const [showMoreOpt, setShowMoreOpt] = useState(false);

  useEffect(() => {
    dispatch({ type: SET_LOADER_TRUE });
    setTimeout(() => {
      setfilteredArray(attachmentData);
      setEquipAttachment(attachmentData);
      dispatch({ type: SET_LOADER_FALSE });
      setMessage('No Data Available');
    }, 500);
  }, []);

  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const onPressFilter = (filterdata) => {
    const isEmpty = Object.keys(filterdata.attchhmentTypeName).length === 0;
    if (isEmpty === true) {
      setAttachmentFilterByModal(false);
      setEquipAttachment(filterdArray);
    } else {
      setfilterMessage(true);
      let positiveArray = filterdArray?.filter(function (value) {
        return (
          value?.FileName?.split('.').pop() ===
          filterdata?.attchhmentTypeName?.fileName
        );
      });
      setEquipAttachment(positiveArray);
      setAttachmentFilterByModal(false);
    }
  };

  //attachment card render function
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <EquipAttachmentCard item={item} index={index} data={equipAttachment} />
      </View>
    );
  };

  const keyExtractor = (item, index) => `ID-${index}`;

  const headerRightIcons = [
    {
      name: FilterIcon,
      onPress: () => {
        setAttachmentFilterByModal(true);
      },
    },
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];
  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };

  // attcahment screen ui for equipment
  return (
    <>
      <HeaderComponents
        title={
          screenName
            ? screenName
            : strings('equipment_attachment.equipment_attachment')
        }
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      {equipAttachment.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={equipAttachment}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </View>
      ) : (
        <>{message != '' && <DataNotFound />}</>
      )}
      <AttechmentFilter
        visible={attachmentFilterByModalVisible}
        modalHeadingLabel="Attaachment Type"
        switchLabel="Show My Jobs Only"
        onChangeVal={toggleSwitch}
        switchValue={isEnabled}
        buttonTxt={strings("Equipments.Apply")}
        modelLabelTxt="Model"
        JobStatusHeading={strings('Equipments.Attachment_Type')}
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
      {isLoading ? <Loader visibility={isLoading} /> : null}
    </>
  );
};

export default MainHoc(EquipmentAttachment);

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  width:{ 
    width: normalize(103) 
  },
  imageStyles: {
    height: normalize(94),
    width: normalize(103),
    borderRadius: normalize(10),
  },
  cardContainer: {
    flexDirection: 'row',
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors?.lightSilver,
    paddingVertical: normalize(23),
    paddingHorizontal: normalize(25),
  },
  titleStyles: {
    fontSize: normalize(14),
    fontFamily: fontFamily?.semiBold,
    marginLeft: normalize(15),
    flex: 1,
    textAlign: 'left'
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    top: normalize(30),
    bottom: normalize(20),
    height: '80%',
  },
  iconStyle: {
    marginLeft: normalize(8),
    marginRight: normalize(5),
  },
});
