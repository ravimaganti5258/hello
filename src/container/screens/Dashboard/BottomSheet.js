import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
  Modal,
} from 'react-native';
import {Colors} from '../../../assets/styles/colors/colors';
import {Text} from '../../../components/Text';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import Switch from '../../../components/Switch';
import {useColors} from '../../../hooks/useColors';
import CheckBox from '@react-native-community/checkbox';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {strings} from '../../../lib/I18n';

const BottomSheet = ({
  switchValue = false,
  handleSwitch,
  handleCancel,
  showModal,
}) => {
  const {colors} = useColors();
  const insets = useSafeAreaInsets();
  const [checkBoxValue, setCheckboxValue] = useState(false);

  return (
    <View>
      <Modal
        transparent
        visible={showModal}
        animationType={'fade'}
        supportedOrientations={['portrait', 'landscape']}>
        <TouchableWithoutFeedback>
          <View style={styles.oneFlex}>
            <BlurView
              style={[styles.backGround]}
              reducedTransparencyFallbackColor="white"
              blurType={'light'}
              blurAmount={1}
            />
          </View>
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.container,
            {paddingBottom: normalize(22) + insets.bottom},
          ]}>
          <Text
            align={'flex-end'}
            color={colors?.PRIMARY_BACKGROUND_COLOR}
            size={textSizes.h11}
            fontFamily={fontFamily.semiBold}
            onPress={() => handleCancel(!checkBoxValue)}>
            {strings('bottomSheet.cancel')}
          </Text>
          <Text
            align={'flex-start'}
            color={colors?.PRIMARY_BACKGROUND_COLOR}
            fontFamily={fontFamily.bold}
            size={textSizes.h7}>
            {strings('bottomSheet.Manage_Security')}
          </Text>
          <Text
            align={'flex-start'}
            size={normalize(13)}
            fontFamily={fontFamily.regular}
            color={Colors.secondryBlack}
            style={styles.descriptionStyle}>
            {strings('bottomSheet.discription')}
          </Text>
          <View style={styles.switchContainer}>
            <Text
              align={'flex-start'}
              fontFamily={fontFamily.bold}
              style={styles.oneFlex}
              size={textSizes.h11}
              color={Colors.secondryBlack}>
              Activate security shield to ensure no oneexcept you, can access
              your FSM Grid App
            </Text>
            <Switch
              value={switchValue}
              onChange={handleSwitch}
              trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
            />
          </View>
          <View style={styles.checkBoxContainer}>
            {Platform.OS === 'android' ? (
              <CheckBox
                onValueChange={setCheckboxValue}
                value={checkBoxValue}
                tintColors={{
                  true: colors?.PRIMARY_BACKGROUND_COLOR,
                  false: Colors.darkGray,
                }}
              />
            ) : (
              <CheckBox
                onValueChange={setCheckboxValue}
                value={checkBoxValue}
                boxType={'square'}
                style={styles.checkBoxStyles}
                onCheckColor={Colors.white}
                tintColor={Colors.darkGray}
                onAnimationType={'fill'}
                onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
                onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
              />
            )}
            <Text size={normalize(13)} style={styles.askAgainTxt}>
              {strings('bottomSheet.do_not_ask')}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: '#00000031',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: normalize(15),
    borderTopRightRadius: normalize(15),
    padding: normalize(23),
    paddingTop: normalize(22),
    position: 'absolute',
    bottom: 0,
  },
  switchContainer: {
    marginVertical: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxStyles: {
    height: normalize(18),
    width: normalize(18),
  },
  askAgainTxt: {
    marginLeft: normalize(8),
  },
  descriptionStyle: {
    marginTop: normalize(8),
  },
  oneFlex: {
    flex: 1,
  },
});
