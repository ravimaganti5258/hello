import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Switch,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BlackMoreOptionIcon} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc';
import {fontFamily, normalize} from '../../../lib/globals';
import {Input} from '../../../components/Input/index';
import {strings} from '../../../lib/I18n/index.js';
const {width, height} = Dimensions.get('window');
const SignatureRequire = ({navigation}) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitchOn = () => setIsEnabled2((previousState) => !previousState);
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Header
          title={strings('signature_feedback.header_title')}
          leftIcon={'Arrow-back'}
          // navigation={navigation}
          headerTextStyle={styles.headerStyles}
          HeaderRightIcon={headerRightIcons}
        />
        <View style={styles.container}>
          <Text style={styles.labelStyle}>
            {strings('signature_feedback.Signature')}
          </Text>
          <View style={styles.signatureSwitchContainer}>
            <Text style={styles.content}>
              {strings('signature_feedback.Signature_Not_Required')}
            </Text>

            <Switch
              trackColor={{false: '#767577', true: '#0655A3'}}
              thumbColor={isEnabled2 ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchOn}
              value={isEnabled2}
            />
          </View>
          <TextInput
            placeholder=""
            multiline={true}
            style={{
              width: width * 0.95,
              height: Platform.OS === 'android' ? height * 0.2 : height * 0.17,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#707070',
              marginVertical: 5,
              paddingBottom: Platform.OS === 'android' ? 80 : null,
              borderStyle: 'dashed',
            }}
          />
          <TouchableOpacity>
            <Text
              style={{
                textAlign: 'right',
                color: '#002C71',
                fontFamily: fontFamily.bold,
              }}>
              {strings('signature_feedback.clear')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.CustomerRatingLabel}>
            {strings('signature_feedback.Name')}
          </Text>
          <TextInput
            placeholder=""
            multiline={true}
            style={{
              width: width * 0.95,
              height: height * 0.04,
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: '#D9D9D9',
              marginVertical: 5,
            }}
            // onChangeText={}
          />

          <Text style={styles.labelStyle}>
            {strings('signature_feedback.Feedback')}
          </Text>
          <Text style={styles.CustomerRatingLabel}>
            {strings('signature_feedback.Customer_Rating')}
          </Text>
          <View style={styles.starratingStyle}>
            <Image
              source={require('../../../assets/images/checkedStar.png')}
              style={{width: 30, height: 25, resizeMode: 'contain'}}
            />
            <Image
              source={require('../../../assets/images/checkedStar.png')}
              style={styles.star}
            />
            <Image
              source={require('../../../assets/images/UncheckedStar.png')}
              style={styles.star}
            />
            <Image
              source={require('../../../assets/images/UncheckedStar.png')}
              style={styles.star}
            />
            <Image
              source={require('../../../assets/images/UncheckedStar.png')}
              style={styles.star}
            />
          </View>
          <Text style={styles.TxtInputLabel}>
            {strings('signature_feedback.Remark')}
          </Text>
          <View
            style={{
              width: width * 0.95,
              height: height * 0.16,
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: '#D9D9D9',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: width * 0.97,
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
              }}>
              <TouchableOpacity>
                <View style={styles.buttonStyle}>
                  <Text>{strings('signature_feedback.Cancel')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.savebuttonStyle}>
                  <Text style={{color: '#FFFFFF'}}>
                    {strings('signature_feedback.Save')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* <Loader visibility={isLoading} /> */}
    </>
  );
};

export default MainHoc(SignatureRequire);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: width * 0.95,
    alignSelf: 'center',
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  labelStyle: {
    marginVertical: normalize(7),
    fontSize: normalize(18),
    marginTop: normalize(10),
    fontFamily: fontFamily.bold,
  },
  signatureSwitchContainer: {
    width: width * 0.95,
    height: height * 0.06,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    fontSize: normalize(15),
    fontFamily: fontFamily.regular,
  },
  CustomerRatingLabel: {
    fontSize: normalize(15),
    marginTop: normalize(8),
    fontFamily: fontFamily.regular,
  },
  starratingStyle: {
    flexDirection: 'row',
    height: height * 0.04,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  star: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: normalize(7),
  },
  TxtInputLabel: {
    fontSize: normalize(15),
    marginTop: normalize(14),
    fontFamily: fontFamily.regular,
  },
  buttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    borderRadius: 40,
  },
  savebuttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002C71',
    borderRadius: 40,
  },
});
