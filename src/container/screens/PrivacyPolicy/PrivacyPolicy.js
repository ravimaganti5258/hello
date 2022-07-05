import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import HeaderComponent from '../../../components/header';
import {Colors} from '../../../assets/styles/colors/colors';
import {fontFamily, normalize, textSizes} from '../../../lib/globals.js';
import {strings} from '../../../lib/I18n';
import {Text} from '../../../components/Text';
import MainHoc from '../../../components/Hoc';
import {BlackMoreOptionIcon, Logout} from '../../../assets/img';
import {useLogout} from '../../../hooks/useLogout';
import {LogoutAction} from '../../../redux/auth/action';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {HIDE_LOGOUT_MODAL} from '../../../redux/auth/types';
import {useDispatch} from 'react-redux';
import {ModalContainer} from '../../../components/Modal';
import {useDimensions} from '../../../hooks/useDimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PrivacyPolicy = ({
  children,
  navigation,
  style,
  onClick,
  visibility,
  handleModalVisibility,
  route,
  ...rest
}) => {
  const {showLogoutModal, toggleLogoutModal} = useLogout();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const {height} = useDimensions();
  const insets = useSafeAreaInsets();

  //function to handle logout
  const handleUserLogout = async () => {
    try {
      dispatch({type: HIDE_LOGOUT_MODAL});
      dispatch(LogoutAction());
    } catch (error) {}
  };

  //function to cancle logout modal
  const handleCancleLogOut = () => {
    setShowModal(false);
  };
  const toggleShowModal = () => {
    setShowModal(!showModal);
  };
  //function for right header
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleShowModal(),
    },
  ];

  //To display Header

  const [header, setheader] = useState(true);
  useEffect(() => {
    checkHeader();
  }, []);
  const checkHeader = () => {
    let value = route.params;
    if (value) {
      setheader(false);
    } else {
    }
  };

  return (
    <>
      {header ? (
        <HeaderComponent
          title={strings('PrivacyPolicy.Privacy_Policy')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyle}
          HeaderRightIcon={headerRightIcons}
        />
      ) : null}
      {showModal ? (
        <ModalContainer
          visibility={showModal}
          handleModalVisibility={toggleShowModal}
          containerStyles={{
            ...styles.modalContainer,
          }}
          overlayStyles={{
            top: Platform.OS === 'ios' ? normalize(0) : normalize(0),
          }}>
          <View style={[styles.containerbox, {maxHeight: height / 1.2}]}>
            <View style={styles.triangle} />
            <TouchableOpacity
              onPress={toggleLogoutModal}
              style={styles.privacyPolicyLogoutmodal}>
              <Logout width={normalize(18)} height={normalize(20)} />
              <Text style={[styles.optTxtStyles, {marginLeft: normalize(15)}]}>
                {strings('PrivacyPolicy.logout')}
              </Text>
            </TouchableOpacity>
          </View>
          {showLogoutModal ? (
            //  Logout confirmation pop up
            <ConfirmationModal
              visibility={showLogoutModal}
              handleModalVisibility={toggleLogoutModal}
              title={strings('confirmation_modal.title')}
              discription={strings('confirmation_modal.logout')}
              handleConfirm={handleUserLogout}
              handleCancle={handleCancleLogOut}
            />
          ) : null}
        </ModalContainer>
      ) : null}
      <ScrollView
        style={[
          styles.container,
          {
            top:
              Platform.OS === 'ios'
                ? normalize(0)
                : header
                ? normalize(0)
                : normalize(-40),
          },
          {
            marginBottom:
              Platform.OS === 'ios'
                ? normalize(0)
                : header
                ? normalize(10)
                : normalize(-35),
          },
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>
            {strings('PrivacyPolicy.Privacy_policy_contentHeading')}
          </Text>

          <Text style={styles.text}>
            {strings('PrivacyPolicy.Privacy_content')}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: normalize(10),
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
    flex: 1,
  },
  modalContainer: {
    borderRadius: normalize(8),
    width: 'auto',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(44) : normalize(10),
    right: Platform.OS === 'ios' ? normalize(11) : normalize(12),
  },
  containerbox: {
    padding: normalize(31),
    paddingVertical: normalize(20),
  },

  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(20),
    borderRightWidth: normalize(15),
    borderBottomWidth: normalize(20),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -normalize(9),
    right: normalize(0),
  },
  headingText: {
    fontSize: normalize(14),
    marginBottom: normalize(15),
    fontFamily: fontFamily.semiBold,
    color: Colors.secondryBlack,
    textAlign: 'left',
  },
  optTxtStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(12),
    marginBottom: normalize(15),
    color: Colors.textParagragh,
    textAlign: 'left',
  },
  textContainer: {
    alignItems: 'flex-start',
    paddingTop: normalize(5),
  },
  privacyPolicyLogoutmodal: {
    flexDirection: 'row',
    paddingRight: normalize(20),
    paddingHorizontal: normalize(10),
  },
});
export default MainHoc(PrivacyPolicy);
