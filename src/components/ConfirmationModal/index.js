import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CrossIcon} from '../../assets/img';
import {Colors} from '../../assets/styles/colors/colors';
import {useColors} from '../../hooks/useColors';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {strings} from '../../lib/I18n';
import {ModalContainer} from '../Modal';
import MultiButton from '../MultiButton';
import {Text} from '../Text';

const ConfirmationModal = ({
  handleModalVisibility,
  visibility,
  title,
  discription,
  handleConfirm,
  handleCancle,
  permission = ''
}) => {
  const {colors} = useColors();

  const buttons = [
    {
      btnName: strings('confirmation_modal.confirm'),
      onPress: () => handleConfirm(),
      btnStyles: {
        ...styles.confirmBtn,
        backgroundColor: permission != '' 
        ? permission 
        ? colors?.PRIMARY_BACKGROUND_COLOR 
        :  Colors.darkGray 
        : colors?.PRIMARY_BACKGROUND_COLOR
      },
      btnTxtStyles: styles.confirmBtnTxt,
    },
    {
      btnName: strings('confirmation_modal.cancel'),
      onPress: () => {
        handleModalVisibility(), handleCancle && handleCancle();
      },
      btnStyles: styles.cancelBtnStyles,
      btnTxtStyles: {
        ...styles.cancelBtnTxt,
        color: colors?.PRIMARY_BACKGROUND_COLOR,
      },
    },
  ];

  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleModalVisibility}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleModalVisibility}>
          <CrossIcon height={normalize(13)} width={normalize(13)} />
        </TouchableOpacity>
        <Text style={styles.titleTxt} color={colors?.PRIMARY_BACKGROUND_COLOR}>
          {title}
        </Text>
        <Text style={styles.discriptionTxt}>{discription}</Text>
        <MultiButton buttons={buttons} constinerStyles={styles.btnContainer} />
      </View>
    </ModalContainer>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(23),
  },
  cancelBtn: {
    alignSelf: 'flex-end',
  },
  btnContainer: {
    flexDirection: 'column',
  },
  cancelBtnStyles: {
    marginVertical: normalize(10),
    backgroundColor: Colors?.white,
  },
  confirmBtn: {
    height: normalize(36),
  },
  confirmBtnTxt: {
    fontSize: textSizes.h11,
    color: Colors.white,
  },
  cancelBtnTxt: {
    fontSize: textSizes.h11,
  },
  titleTxt: {
    fontSize: normalize(25),
    fontFamily: fontFamily.bold,
  },
  discriptionTxt: {
    fontSize: textSizes?.h10,
    textAlign: 'center',
    marginTop: normalize(9),
    marginBottom: normalize(34),
  },
});
