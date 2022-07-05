import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MainHoc from '../../../components/Hoc';
import HeaderComponent from '../../../components/header/index';
import {fontFamily, normalize} from '../../../lib/globals';
import { BlackMoreOptionIcon, } from '../../../assets/img';
import {strings} from '../../../lib/I18n';
import AddMoreModal from '../JobList/addMore';
import {Colors} from '../../../assets/styles/colors/colors';
import AttchmentPicker from './AttchmentPicker';

const Attachment = ({navigation, route }) => {
  const {screenName,color}=route?.params
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const toggleShowMoreOpt = () => {
    setShowMoreOpt(!showMoreOpt);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowMoreOpt(),
    },
  ];
  const _handleNavigationOnCamera = (item) => {
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: 'imageUpload',
      screenName:screenName != ''?screenName: strings('attachments.add_attachment'),
      formDetail:{}
    });
  };
  const _handleNavigationOnGallery = (item) => {
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: 'imageUpload',
      screenName:screenName !=''?screenName:strings('attachments.add_attachment'),
      formDetail:{}
    });
  };
  const _handleNavigationOnDocument = async (item) => {
   try {
    navigation.navigate('AddAttachment', {
      attchmentDetail: item,
      edit: false,
      type: 'docUpload',
      screenName:screenName =='Incident Attachment'?screenName: strings('attachments.add_attachment'),
      formDetail:{}
    });
   }
   catch(error)
   {
     console.log({error});
   }
  };
  return (
    <View style={styles.container}>
      <HeaderComponent
        title={strings('attachments.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
        HeaderRightIcon={headerRightIcons}
      />
      <AttchmentPicker
        onSelectFromCamera={_handleNavigationOnCamera}
        onSelectGallery={_handleNavigationOnGallery}
        onSelectDoc={_handleNavigationOnDocument}
        iconColor={color}
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
  container: {flex: 1},
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    flex: 1,
  },
  bodyContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors?.appGray,
  },
  BtnWrap: {
    flexDirection: 'row',
    backgroundColor: Colors?.white,
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(50),
    elevation: normalize(10),
    shadowColor: Colors?.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: normalize(0.8),
    shadowRadius: normalize(2),
    borderRadius: normalize(7),
  },
});

export default MainHoc(Attachment);
