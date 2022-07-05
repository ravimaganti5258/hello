import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Logout } from '../../../assets/img/index';
import { Colors } from '../../../assets/styles/colors/colors';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import { useLogout } from '../../../hooks/useLogout';
import { useNetInfo } from '../../../hooks/useNetInfo';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { LogoutAction } from '../../../redux/auth/action';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { HIDE_LOGOUT_MODAL } from '../../../redux/auth/types';
import { strings } from '../../../lib/I18n';

const AddMoreModal = ({
  visibility,
  handleModalVisibility,
  showTimeLine = false,
  handleJobTimeLine,
}) => {
  const { height } = useDimensions();
  const insets = useSafeAreaInsets();
  const { isConnected } = useNetInfo();
  const { showLogoutModal, toggleLogoutModal } = useLogout();
  const dispatch = useDispatch();

  const handleUserLogout = async () => {
    try {
      handleModalVisibility();
      dispatch({ type: HIDE_LOGOUT_MODAL });
      dispatch(LogoutAction());
    } catch (error) { }
  };

  return (
    <>
      <ModalContainer
        visibility={visibility}
        handleModalVisibility={handleModalVisibility}
        containerStyles={{
          ...styles.modalContainer,
          top: !isConnected
            ? Platform.OS == 'ios'
              ? normalize(10) + insets.top
              : normalize(10)
            : (Platform.OS == 'ios'
              ? normalize(10) + insets.top :
              normalize(10)),
          right: normalize(10)
        }}
        overlayStyles={{
          top: !isConnected
            ? Platform.OS === 'ios'
              ? normalize(110) + insets.top
              : normalize(16 + 60)
            : Platform.OS === 'ios'
              ? normalize(43) + insets.top
              : normalize(58),
        }}>
        <View style={[styles.container, { maxHeight: height / 1.4 }]}>
          <View style={[styles.triangle]} />
          {showTimeLine ? (
            <View>
              <TouchableOpacity
                style={styles.optBtnStyles}
                onPress={handleJobTimeLine}>
                <Text
                  style={[
                    styles.optTxtStyles,
                    { paddingHorizontal: normalize(7) },
                  ]}>
                  {strings('common.timeline')}
                </Text>
              </TouchableOpacity>
              <View style={styles.dividerStyles} />
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.log}
            onPress={toggleLogoutModal}
          >
            <Logout width={normalize(18)} height={normalize(18)} />
            <Text style={[styles.optTxtStyles, { marginLeft: normalize(15) }]}>
              {strings('Logout_text.logout')}
            </Text>
          </TouchableOpacity>
        </View>

        {showLogoutModal ? (
          /* Logout confirmation pop up */
          <ConfirmationModal
            visibility={showLogoutModal}
            handleModalVisibility={toggleLogoutModal}
            handleConfirm={handleUserLogout}
            title={strings('confirmation_modal.title')}
            discription={strings('confirmation_modal.logout')}
            handleCancle={handleModalVisibility}
          />
        ) : null}
      </ModalContainer>
    </>
  );
};

export default AddMoreModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(31),
    paddingVertical: normalize(20),
    flex: 1,
  },
  modalContainer: {
    borderRadius: normalize(8),
    width: 'auto',
  },
log:{
  flexDirection: 'row',
  paddingRight: normalize(20),
  paddingHorizontal: normalize(7),
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
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
  dividerStyles: {
    borderWidth: normalize(0.7),
    borderColor: Colors?.greyBorder,
    marginVertical: normalize(16),
  },
  optTxtStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
  },
  optBtnStyles: {
    paddingRight: normalize(70),
  },
  togglemodalStyle: {
    flexDirection: 'row',
    paddingRight: normalize(20),
    paddingHorizontal: normalize(7),
  },
});
