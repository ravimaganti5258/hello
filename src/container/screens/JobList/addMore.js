import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {Logout} from '../../../assets/img/index';
import {Colors} from '../../../assets/styles/colors/colors';
import {ModalContainer} from '../../../components/Modal';
import {Text} from '../../../components/Text';
import {useDimensions} from '../../../hooks/useDimensions';
import {useLogout} from '../../../hooks/useLogout';
import {useNetInfo} from '../../../hooks/useNetInfo';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {LogoutAction} from '../../../redux/auth/action';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {HIDE_LOGOUT_MODAL} from '../../../redux/auth/types';
import {strings} from '../../../lib/I18n';
import {accessPermission} from '../../../database/MobilePrevi/index.js';

const AddMoreModal = ({
  visibility,
  handleModalVisibility,
  showTimeLine = false,
  handleJobTimeLine,
  containerStyles,
}) => {
  const {height} = useDimensions();
  const insets = useSafeAreaInsets();
  const {isConnected} = useNetInfo();
  const {showLogoutModal, toggleLogoutModal} = useLogout();
  const [permission, setPermission] = useState({});

  const dispatch = useDispatch();

  const handleUserLogout = async () => {
    try {
      handleModalVisibility();
      dispatch({type: HIDE_LOGOUT_MODAL});
      dispatch(LogoutAction());
    } catch (error) {}
  };
  /* Job history permission*/
  useEffect(() => {
    accessPermission('Job History').then((res) => {
      setPermission(res);
    });
  }, []);

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
            : Platform.OS == 'ios'
            ? normalize(-5) + insets.top
            : normalize(8.5),
          right: Platform.OS == 'ios' ? normalize(12) : normalize(12),
          ...containerStyles,
        }}>
        <View style={[styles.container, {maxHeight: height / 1.4}]}>
          <View style={[styles.triangle]} />
          {showTimeLine ? (
            <View>
              <TouchableOpacity
                style={styles.optBtnStyles}
                onPress={permission?.View ? handleJobTimeLine : null}>
                <Text
                  style={[
                    styles.optTxtStyles,
                    {paddingHorizontal: normalize(7)},
                    {
                      color: permission.View
                        ? Colors.secondryBlack
                        : Colors.darkGray,
                    },
                  ]}>
                  {strings('Logout_text.Job_Timeline')}
                </Text>
              </TouchableOpacity>
              <View style={styles.dividerStyles} />
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.logoutModalStyle}
            onPress={toggleLogoutModal}>
            <Logout width={normalize(18)} height={normalize(18)} />
            <Text style={[styles.optTxtStyles, {marginLeft: normalize(15)}]}>
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
  logoutModalStyle: {
    flexDirection: 'row',
    paddingRight: normalize(20),
    paddingHorizontal: normalize(7),
  },
});
