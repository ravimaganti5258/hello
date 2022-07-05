import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
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
  DOC_Icon,
} from '../../../assets/img/index.js';
import {fontFamily, normalize} from '../../../lib/globals.js';
import {Colors} from '../../../assets/styles/colors/colors.js';
import MainHoc from '../../../components/Hoc/index.js';
import {Text} from '../../../components/Text/index.js';
import {ModalContainer} from '../../../components/Modal/index.js';
import AttchmentPickerComponent from './AttchmentPicker.js';
import AddMoreModal from '../JobList/addMore.js';
import AttechmentFilter from '../../../components/AttechmentFilter/AttechmentFilter';
import {strings} from '../../../lib/I18n';
import {ImgPreviewModal} from '../../../components/ImagePreviewModal/index.js';
import {useColors} from '../../../hooks/useColors.js';

const {height} = Dimensions.get('screen');

const iconLists = [
  {id: 0, fileName: 'pdf', icon: PDF_ICON, FilePath: null, byteData: ''},
  {id: 1, fileName: 'ppt', icon: PPT_ICON, FilePath: null, byteData: ''},
  {id: 2, fileName: 'doc', icon: DOC_Icon, FilePath: null, byteData: ''},
  {id: 3, fileName: 'jpg', icon: PDF_ICON, FilePath: null, byteData: ''},
  {id: 4, fileName: 'png', icon: PDF_ICON, FilePath: null, byteData: ''},
];

const AttachmentList = ({navigation, route}) => {
  const [onToggleAttchment, setOnToggleAttchment] = useState(false);
  const {colors} = useColors();
  const [filterMessage, setfilterMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [attachmentFilterByModalVisible, setAttachmentFilterByModal] =
    useState(false);

  const {data} = route?.params;
  const [filterdArray, setfilteredArray] = useState([]);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const onPressFilter = (filterdata) => {
    const isEmpty = Object.keys(filterdata.attchhmentTypeName).length === 0;
    if (isEmpty === true) {
      setAttachmentFilterByModal(false);
    } else {
      setfilterMessage(true);
      let positiveArray = data.filter(function (value) {
        return (
          value?.fileName.split('.').pop() ===
          filterdata?.attchhmentTypeName?.fileName
        );
      });
      setfilteredArray(positiveArray);

      setAttachmentFilterByModal(false);
    }
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

  const renderItem = ({item, index}) => {
    const base64Image = item?.byteData
      ? `data:image/png;base64,${item?.byteData}`
      : undefined;

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            route?.params?.screenName == 'AddInccident'
              ? navigation.navigate('AddIncident', {
                  AttachmentIcon: item.icon,
                  attachmentName: item.name,
                })
              : null;
          }}>
          <View style={styles.attachmentTypeNameView}>
            {data.length > 0 ? (
              <>
                {base64Image ? (
                  <TouchableOpacity
                    onPress={() => {
                      toggleShowImage();
                    }}>
                    <Image
                      source={{uri: base64Image}}
                      style={[styles.partsImageStyle]}
                    />
                  </TouchableOpacity>
                ) : (
                  <item.attchhmentTypeName.icon />
                )}
              </>
            ) : (
              <item.icon />
            )}
            <Text style={styles.fiileNameStyle}>
              {item.fileName ? item.fileName : item.attchhmentTypeName.fileName}
            </Text>
          </View>
        </TouchableOpacity>
        {showImage ? (
          <ImgPreviewModal
            visibility={showImage}
            handleModalVisibility={toggleShowImage}
            containerStyles={styles.img}
            source={{uri: base64Image}}
          />
        ) : null}
      </>
    );
  };

  return (
    <View>
      <HeaderComponent
        title={
          route?.params?.title != undefined
            ? route?.params?.title
            : strings('attachments.header_title')
        }
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <View style={styles.flatlistContainer}>
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
            data={filterdArray.length > 0 ? filterdArray : data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `ID-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeprator}
          />
        )}
        {filterdArray.length == 0 && filterMessage === true ? (
          <View style={styles.emptyViewContainer}>
            <Text style={styles.dataNoFoundTxt}>
              {strings('attachments.Data_not_found')}{' '}
            </Text>
          </View>
        ) : null}

        <View style={{justifyContent: 'center'}}>
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
        buttonTxt="Apply"
        modelLabelTxt="Model"
        JobStatusHeading={strings('Response_code.ATTACHEMENTTYPE')}
        hasBorder={true}
        handleModalVisibility={() => {
          setAttachmentFilterByModal(false);
        }}
        onPress={(data) => onPressFilter(data)}
        data={iconLists}
      />
      {showMoreOpt ? (
        <AddMoreModal
          visibility={showMoreOpt}
          handleModalVisibility={toggleShowMoreOpt}
        />
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
  img: {
    top: normalize(30),
  },
  attachmentTypeNameView: {
    padding: normalize(10),
    flexDirection: 'row',
  },
  fiileNameStyle: {
    padding: normalize(20),
    flex: 1,
  },
  flatlistContainer: {
    margin: normalize(20),
  },
  emptyViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataNoFoundTxt: {
    padding: normalize(24),
    marginTop: height * 0.8,
  },
});

export default MainHoc(AttachmentList);
