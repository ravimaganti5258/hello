import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { fontFamily, normalize } from '../../../lib/globals';
import { Colors } from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header/index.js';
import Loader from '../../../components/Loader/index.js';
import { FlashMessageComponent, FlashMessageComponenttwo } from '../../../components/FlashMessge/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { strings } from '../../../lib/I18n/index.js';
import MainHoc from '../../../components/Hoc/index.js';
import { EditWhiteIcon } from '../../../assets/img/index';
import api from '../../../lib/api';
import { Text } from '../../../components/Text';
import Button from '../../../components/Button';
import { getProfileDataSuccess } from '../../../redux/Profile/action';
import { ModalContainer } from '../../../components/Modal';
import { CrossIcon, CameraIcon, ImageIcon } from '../../../assets/img';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect } from '@react-navigation/native';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColors } from '../../../hooks/useColors';

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const { colors } = useColors();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const profileData = useSelector(
    (state) => state?.profileReducer?.profileInfo,
  );
  const [fname, setFname] = useState(profileData?.FirstName);
  const [lname, setLname] = useState(profileData?.LastName);
  const [mobile, setMobile] = useState(profileData?.Phone1);
  const [phone, setPhone] = useState(profileData?.Phone2);
  const [visibility, setVisibility] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [image, setImage] = useState({});
  const [fileName, setFileName] = useState('');
  const [base64ProfileImage, setBase64ProfileImage] = useState(
    `data:image/png;base64,${profileData?.ProfileImage}`,
  );

  useEffect(() => {
    setFname(profileData?.FirstName);
    setLname(profileData?.LastName);
    setMobile(profileData?.Phone1);
    setPhone(profileData?.Phone2);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setFname(profileData?.FirstName);
      setLname(profileData?.LastName);
      setMobile(profileData?.Phone1);
      setPhone(profileData?.Phone2);
      setBase64ProfileImage(
        `data:image/png;base64,${profileData?.ProfileImage}`,
      );
    }, []),
  );

  /* edit profile data */
  const editProfileData = () => {
    setLoader(true);
    try {
      const userData = {
        LoginId: userInfo?.sub,
        CompanyId: userInfo?.CompanyId,
        FirstName: fname,
        LastName: lname,
        DisplayName: userInfo?.DisplayName,
        Phone1: mobile,
        Phone2: phone,
        PhotoPath: fileName || profileData?.PhotoPath,
        Attachment: image?.data || profileData?.ProfileImage,
      };

      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponenttwo('Warning', msgCode);
            } else if (msgCode.charAt(0) === '1') {
              setTimeout(() => {
                FlashMessageComponenttwo(
                  'success',
                  strings(`Response_code.${msgCode}`),
                );
              }, -10000);
              
            } else {
              FlashMessageComponenttwo(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            }
            dispatch(getProfileDataSuccess(userData));
          }
          setLoader(false);
          navigation.goBack();
        },
        error: (error) => {
          console.log(error);
          setLoader(false);
          FlashMessageComponenttwo(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
        },
      };
      api.updateUserProfile(userData, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (er) {
      console.log(er);
    }
  };

  const toggleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };
  const onClickCancel = () => {
    navigation.goBack();
  };

  const onClickUpdate = () => {
    checkInputValidation();
  };

  const onPressCamera = () => {
    ImagePicker.openCamera({
      width: normalize(300),
      height: normalize(400),
      cropping: true,
      includeBase64: true,
    })
      .then((response) => {
        setBase64ProfileImage(`data:image/png;base64,${response?.data}`);
        setImage(response);
        const name = response.path.split('/').pop();
        setFileName(name);
        toggleModal();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const imagefromGalary = () => {
    ImagePicker.openPicker({
      width: normalize(1000),
      height: normalize(1000),
      includeBase64: true,
      cropping: true,
      mediaType: 'photo',
    })
      .then((response) => {
        toggleModal();
        setBase64ProfileImage(`data:image/png;base64,${response?.data}`);
        setImage(response);
        const name = response.path.split('/').pop();
        setFileName(name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleModal = () => {
    setVisibility(!visibility);
  };

/* validations */

  const checkInputValidation = () => {
    const fnameLength = fname?.length;
    const lnameLength = lname?.length;
    const mobileLength = mobile?.length;
    const phoneLength = phone?.length;
    const phoneNoValidation = /^[0-9]+([0-9]+)+$/;
    const nameValidation = /^[a-zA-Z]+$/;
    if (fnameLength === 0) {
      FlashMessageComponent(
        'reject',
        strings('Response_code.PLEASEFILLTHECHECKLISTSTOPROCEED'),
      );
    } else if (lnameLength === 0) {
      FlashMessageComponent(
        'reject',
        strings('Response_code.PLEASEFILLTHECHECKLISTSTOPROCEED'),
      );
    } else if (mobileLength === 0) {
      FlashMessageComponent(
        'reject',
        strings('Response_code.PLEASEFILLTHECHECKLISTSTOPROCEED'),
      );
    } else if (phoneLength === 0) {
      FlashMessageComponent(
        'reject',
        strings('Response_code.PLEASEFILLTHECHECKLISTSTOPROCEED'),
      );
    } else if (mobileLength < 10) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDMOBILENO'));
    }
    else if (phoneLength < 10) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDPHONEENO'));
    } else if (!phoneNoValidation.test(mobile)) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDMOBILENO'));
    } else if (!phoneNoValidation.test(phone)) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDPHONEENO'));
    } else if (!nameValidation.test(fname)) {
      FlashMessageComponent('reject', strings('Response_code.INVALID_FIRSTNAME'));
    } else if (!nameValidation.test(lname)) {
      FlashMessageComponent('reject', strings('Response_code.INVALID_LASTNAME'));
    }
    else {
      editProfileData();
    }
  };
  return (
    <View style={styles.mainView}>

      <View>
        <Header
          title={strings('My_Profile.title')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
        />
      </View>
      
      <Loader visibility={loader} />
      <KeyboardAwareScrollView
      style={styles.keyboardStyle}
        behaivour='padding'
      >
        <View style={styles.view1}>
          <View>
            <Image
              source={{ uri: base64ProfileImage }}
              style={styles.profilePicture}
            />
            <TouchableOpacity
              style={[styles.editLogoView, { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR, }]}
              onPress={() => toggleModal()}>
              <EditWhiteIcon
                height={normalize(13)}
                width={normalize(13)}
                style={styles.editLogo}
              />
            </TouchableOpacity>
          </View>
          <ModalContainer
            visibility={visibility}
            handleModalVisibility={() => setVisibility(!visibility)}>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => toggleModal()}>
                <CrossIcon height={normalize(13)} width={normalize(13)} />
              </TouchableOpacity>
              <Text
                style={styles.selectOption}
                fontFamily={fontFamily.semiBold}
                colors={Colors?.black}>
                {strings('My_Profile.Select_one_option')}
              </Text>
              <TouchableOpacity
                style={styles.BtnWrap}
                onPress={() => onPressCamera()}>
                <CameraIcon height={normalize(20)} width={normalize(25)} color={colors.PRIMARY_BACKGROUND_COLOR} />
                <Text
                style={styles.selectOption}
                  fontFamily={fontFamily.semiBold}
                  colors={Colors?.black}>
                  {strings('My_Profile.Camera')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.BtnWrap}
                onPress={() => imagefromGalary()}>
                <ImageIcon height={normalize(20)} width={normalize(25)} color={colors.PRIMARY_BACKGROUND_COLOR} />
                <Text
                  style={{
                    paddingHorizontal: normalize(10),
                    fontSize: normalize(18),
                  }}
                  fontFamily={fontFamily.semiBold}
                  colors={Colors?.black}>
                  {strings('My_Profile.Gallery')}
                </Text>
              </TouchableOpacity>
            </View>
          </ModalContainer>
        </View>
        <View style={styles.view2}>
          <Text
            align={'flex-start'}
            color={Colors.secondryBlack}
            style={styles.label}
            size={normalize(14)}>
            {strings('My_Profile.First_Name')}
          </Text>
          <TextInput
            value={fname}
            onChangeText={(text) => setFname(text)}
            style={styles.textInput}
            returnKeyType="done"
          />
          <View style={{ marginTop: 10 }}>
            <Text
              align={'flex-start'}
              color={Colors.secondryBlack}
              style={styles.label}
              size={normalize(14)}>
              {strings('My_Profile.Last_Name')}
            </Text>
            <TextInput
              value={lname}
              onChangeText={(text) => setLname(text)}
              style={styles.textInput}
              returnKeyType="done"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text
              align={'flex-start'}
              color={Colors.secondryBlack}
              style={styles.label}
              size={normalize(14)}>
              {strings('My_Profile.Mobile')}
            </Text>
            <TextInput
              value={mobile}
              onChangeText={(text) => setMobile(text)}
              keyboardType={'number-pad'}
              maxLength={10}
              onBlur={() => {
                if (mobile.length < 10) {
                  FlashMessageComponent(
                    'reject',
                    strings('Response_code.INVALIDMOBILENO'),
                  );
                }
              }}
              style={styles.textInput}
              returnKeyType="done"
            />
          </View>
          <View style={styles.phhone}>
            <Text
              align={'flex-start'}
              color={Colors.secondryBlack}
              style={styles.label}
              size={normalize(14)}>
              {strings('My_Profile.Phone')}
            </Text>
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text)}
              keyboardType={'number-pad'}
              maxLength={10}
              style={styles.textInput}
              returnKeyType="done"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.view3}>
        <Button
          title={strings('My_Profile.Cancel')}
          style={styles.btnStyle}
          backgroundColor={Colors.greyBorder}
          fontSize={normalize(14)}
          onClick={onClickCancel}
        />
        <Button
          title={strings('My_Profile.Update')}
          style={styles.btnStyle}
          backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
          txtColor={Colors.lightBackground}
          fontSize={normalize(14)}
          onClick={toggleUpdateModal}
        />
      </View>
      {showUpdateModal ? (
        <ConfirmationModal
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.update_profile_changes')}
          handleModalVisibility={toggleUpdateModal}
          visibility={showUpdateModal}
          handleConfirm={() => {
            onClickUpdate(), toggleUpdateModal();
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  view1: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '15%',
  },
  view2: {
    flex: 0.5,
    marginHorizontal: normalize(15),
    marginBottom: '20%',
  },
  view3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: normalize(10),
    paddingBottom: normalize(25)
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  rightTextStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(16),
    color: Colors.blue,
    marginBottom: 0,
    flex: 1,
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: -25,
  },
  editLogo: {
    alignSelf: 'center',
  },
  onlineLogo: {
    height: 10,
    width: 10,
    backgroundColor: '#2ECC71',
    borderRadius: 50,
    alignSelf: 'center',
  },
  editLogoView: {
    height: 25,
    width: 25,
    borderRadius: 50,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  usernameText: {
    paddingVertical: 3,
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    color: Colors.blue,
    marginTop: 10,
  },
  onlineText: {
    paddingVertical: 3,
    fontSize: normalize(15),
    fontFamily: fontFamily.medium,
    paddingLeft: 5,
  },
  lastLoginText: {
    paddingVertical: 3,
  },
  label: {
    fontSize: normalize(12),
    fontFamily: fontFamily.regular,
  },
  line: {
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 15,
  },
  emailText: {
    fontSize: normalize(16),
    fontFamily: fontFamily.regular,
  },
  textInput: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    height: 35,
    borderColor: Colors.borderColor,
    fontSize: normalize(13),
    fontFamily: fontFamily.regular,
    // textAlign:'center'
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  btnStyle: {
    height: 40,
    width: '45%',
  },
  container: {
    padding: normalize(23),
  },
  cancelBtn: {
    alignSelf: 'flex-end',
  },
  BtnWrap: {
    flexDirection: 'row',
    backgroundColor: Colors?.white,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(50),
    elevation: normalize(10),
    shadowColor: Colors?.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: normalize(0.8),
    shadowRadius: normalize(2),
    borderRadius: normalize(7),
    marginVertical: 15,
    alignItems: 'center',
  },
  keyboardStyle:{
    marginBottom: Platform.OS === "ios" ? normalize(-70) : normalize(10)
  },
  selectOption:{
    paddingHorizontal: normalize(10),
    fontSize: normalize(18),
  },
  phhone:{ marginTop: 10 }
});

export default MainHoc(EditProfile);
