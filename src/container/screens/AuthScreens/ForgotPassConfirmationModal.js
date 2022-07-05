import React from 'react';

import {StyleSheet, View, ScrollView} from 'react-native';
import {SuccessGreenTick} from '../../../assets/img';
import {Colors} from '../../../assets/styles/colors/colors';
import Button from '../../../components/Button';
import {ModalContainer} from '../../../components/Modal';
import {Text} from '../../../components/Text';
import {useColors} from '../../../hooks/useColors';
import {useDimensions} from '../../../hooks/useDimensions';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';

const ICON_DIMENSION = normalize(70);

const ForgotPassConfirmationModal = ({visibility, handleModalBtn}) => {
  const {height} = useDimensions();
  const {colors} = useColors();
  return (
    <ModalContainer visibility={visibility}>
      <View style={[{maxHeight: height / 2}, styles.containerStyles]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            <SuccessGreenTick width={ICON_DIMENSION} height={ICON_DIMENSION} />
            <Text style={styles.msgTxtStyles}>
              {strings('login.password_sent')}
            </Text>
            <Button
              title={strings('login.ok')}
              txtStyle={styles.btnTxtStyles}
              onClick={handleModalBtn}
              width={'100%'}
              backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
            />
          </View>
        
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default ForgotPassConfirmationModal;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  msgTxtStyles: {
    fontSize: textSizes.h9,
    fontFamily: fontFamily.bold,
    marginTop: normalize(25),
    textAlign: 'center',
    marginBottom: normalize(30),
  },
  containerStyles: {
    paddingTop: normalize(40),
    paddingBottom: normalize(28),
    paddingHorizontal: normalize(40),
  },
  btnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors.white,
  },
 buttonContainer:{
  alignItems: 'center'
 }
});
