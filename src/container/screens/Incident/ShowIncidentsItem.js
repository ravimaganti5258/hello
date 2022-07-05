import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import {BlackMoreOptionIcon} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc';
import {fontFamily, normalize} from '../../../lib/globals';
import {strings} from '../../../lib/I18n/index.js';
import AddMoreModal from '../../screens/JobList/addMore';

const {width, height} = Dimensions.get('window');
// IncidentDetails
const ShowIncidentItem = ({navigation}) => {
  
  const [showAddMore, setShowAddMore] = useState(false);
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.renderContainer}>
        <View style={styles.incedentListCONTAINER}>
          <View style={styles.incedentImage}>
            <Image source={item.image} style={styles.imageStyle} />
          </View>
          <View style={styles.imageNameContainer}>
            <Text style={styles.imagenameStyle}>{item.imaagename}</Text>
          </View>
        </View>
        <View style={styles.borderStyle} />
      </View>
    );
  };
  return (
    <>
      <View style={styles.mainContainer}>
        <Header
          title={strings('Add_Incident.Incidents')}
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
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
};

export default MainHoc(ShowIncidentItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: width * 0.95,
    alignSelf: 'center',
    marginTop: height * 0.02,
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  renderContainer: {
    width: width * 0.95,
    height: height * 0.14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incedentListCONTAINER: {
    width: width * 0.95,
    height: height * 0.12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incedentImage: {
    width: width * 0.28,
    height: height * 0.1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  imageStyle: {
    width: 100,
    height: height * 0.095,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  imageNameContainer: {
    width: width * 0.65,
    height: height * 0.1,paddingLeft:Platform.OS==='ios'?7:0
  },
  imagenameStyle: {paddingTop: 7, fontFamily: fontFamily.regular},
  borderStyle: {
    width: width * 0.88,
    height: height * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  mainContainer:{
    flex: 1,
    backgroundColor: '#ffffff'
  }
});
const DATA = [
  {
    imaagename: '2332-kjdjjff.jpg',
    image: require('../../../assets/images/Nature.png'),
  },
  {
    imaagename: '122367-ooe9ii0oeikek.jpg',
    image: require('../../../assets/images/Nature.png'),
  },
  {
    imaagename: '332323-kjdjjff.pdf',
    image: require('../../../assets/images/Nature.png'),
  },
];
