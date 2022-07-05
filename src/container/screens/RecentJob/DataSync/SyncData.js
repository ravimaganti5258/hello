import React from 'react';
import {View, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import HeaderComponent from '../../../../components/header';
import {Colors} from '../../../../assets/styles/colors/colors';
import {
  fontFamily,
  normalize,
  normalizeHeight,
  textSizes,
} from '../../../../lib/globals.js';
import {strings} from '../../../../lib/I18n';
import Button from '../../../../components/Button';
import {Text} from '../../../../components/Text';
import MainHoc from '../../../../components/Hoc';

const SyncData = ({children, navigation, style, onClick, ...rest}) => {
  const DATA = [
    {
      id: 1,
      lable: 'Job List',
      date: 'Today 8:21 AM',
    },
    {
      id: 2,
      lable: 'Job Details',
      date: 'Today 8:21 AM',
    },
    {
      id: 3,
      lable: 'Customer Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 4,
      lable: 'Work Category',
      date: 'Today 8:21 AM',
    },
    {
      id: 5,
      lable: 'Work Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 6,
      lable: 'Work Request',
      date: 'Today 8:21 AM',
    },
    {
      id: 7,
      lable: 'Forms',
      date: 'Today 8:21 AM',
    },
    {
      id: 8,
      lable: 'Pricing Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 9,
      lable: 'Discount Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 10,
      lable: 'Payment Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 11,
      lable: 'Brand',
      date: 'Today 8:21 AM',
    },
    {
      id: 12,
      lable: 'Model',
      date: 'Today 8:21 AM',
    },
    {
      id: 13,
      lable: 'Tax',
      date: 'Today 8:21 AM',
    },
    {
      id: 14,
      lable: 'Group',
      date: 'Today 8:21 AM',
    },
    {
      id: 15,
      lable: 'Priority',
      date: 'Today 8:21 AM',
    },
    {
      id: 16,
      lable: 'OTP Reason',
      date: 'Today 8:21 AM',
    },
  ];

  const handleBtnClick = () => {
//function for sync data
  };

  var colors = [Colors.white, Colors.appGray];

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.backgroundGrayText,
          {backgroundColor: colors[index % colors.length]},
        ]}>
        <Text style={styles.text}>{item?.lable}</Text>
        <Text style={styles.text}>{item?.date}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderComponent
        title={strings('Data_Sync.header_Title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={'Sync Data'}
          txtStyle={styles.btnTxtStyles}
          style={{padding: normalize(5), margin: normalize(10), width: 180}}
          backgroundColor={Colors.lightGreen}
          onClick={() => {
            handleBtnClick();
          }}
        />
      </View>
      <Text style={styles.text}>Last Data Sync: Today 8:21 AM</Text>

      <View style={{margin: normalize(20), flex: 1}}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Entity</Text>
          <Text style={styles.titleText}>Last Sync Date</Text>
        </View>

        <FlatList
          data={DATA}
          showsVerticalScrollIndicator={false}
          keyExtractor={(DATA) => DATA?.id?.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
  },
  btnTxtStyles: {
    fontSize: textSizes.h10,
    fontWeight: 'bold',
    color: Colors.white,
  },
  text: {
    fontSize: normalize(14),
    paddingBottom: normalize(5),
  },
  buttonContainer: {
    margin: normalize(10),
    alignItems: 'center',
  },
  // FlatList Component Design
  title: {
    backgroundColor: Colors.greyBorder,
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: normalize(40),
    paddingRight: normalize(40),
  },
  titleText: {
    color: Colors.black,
    fontSize: normalize(16),
    paddingLeft: normalize(10),
    fontFamily: fontFamily.semiBold,
  },

  //currently using
  backgroundGrayText: {
    color: Colors.black,

    justifyContent: 'space-between',
    paddingRight: normalize(50),
    paddingLeft: normalize(10),
    flexDirection: 'row',
    height: normalizeHeight(40),
  },
});
export default MainHoc(SyncData);
