import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CrossIcon } from '../../../assets/img';
import { Colors } from '../../../assets/styles/colors/colors';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';

const PhoneNumberModal = ({
  handleModalVisibility,
  visibility,
  workPhoneNo,
  mobileNo,
}) => {
  const { height } = useDimensions();

  const openDialer = (number) => {
    try {
      if (number) {
        if (Platform.OS == 'ios') {
          Linking.canOpenURL(`telprompt:${number}`).then((supported) => {
            if (supported) {
              return Linking.openURL(`telprompt:${number}`).catch(() => null);
            } else {
              FlashMessageComponent('warning', 'Dialer is not supported');
            }
          });
        } else {
          Linking.openURL(`tel:${number}`);
        }
      }
    } catch (error) { }
  };

  return (
    <ModalContainer
      handleModalVisibility={handleModalVisibility}
      visibility={visibility}>
      <View style={[styles.container, { maxHeight: height / 1.7 }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTxtStyle}>
            {strings('phone_number_modal.Choose_number_to_call')}
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={handleModalVisibility}>
            <CrossIcon height={normalize(13)} width={normalize(13)} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {workPhoneNo != null && workPhoneNo != '' ? (
            <>
              <Text style={styles.workPhoneTxt}>
                {strings('phone_number_modal.Work_Phone')}
              </Text>
              <Text
                style={styles.workPhoneNo}
                onPress={() =>
                  openDialer(workPhoneNo == null ? '022-99999' : workPhoneNo)
                }>
                {workPhoneNo == null ? '022-99999' : workPhoneNo}
              </Text>
            </>
          ) : null}

          {mobileNo != null && workPhoneNo != null && workPhoneNo != '' && mobileNo != '' && (
            <View style={styles.borderLine} />
          )}
          {mobileNo != null && mobileNo != '' ? (
            <>
              <Text style={styles.workPhoneTxt}>
                {strings('phone_number_modal.Mobile')}
              </Text>
              <Text
                style={styles.workPhoneNo}
                onPress={() =>
                  openDialer(mobileNo == null ? '999999999' : mobileNo)
                }>
                {mobileNo == null ? '999999999' : mobileNo}
              </Text>
            </>
          ) : null}
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default PhoneNumberModal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(23),
    paddingHorizontal: normalize(20),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(17),
  },
  headerTxtStyle: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.bold,
  },
  workPhoneTxt: {
    fontSize: normalize(13),
    alignSelf: 'flex-start',
  },
  borderLine: {
    borderWidth: 0.6,
    borderColor: Colors?.greyBorder,
    marginVertical: normalize(15),
  },
  workPhoneNo: {
    fontSize: normalize(15),
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
  },
});
