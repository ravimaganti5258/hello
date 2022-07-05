import React, {createRef} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {Colors} from '../../assets/styles/colors/colors';
import {fontFamily, normalize, textSizes} from '../../lib/globals';

const ButtonComponent = ({
  title,
  onClick,
  bgColor,
  txtSize,
  txtColor,
  SvgIcon,
}) => {
  return (
    <TouchableOpacity
      style={[styles.btnStyle, {backgroundColor: bgColor}]}
      onPress={onClick}
      activeOpacity={0.8}>
      <>
        {SvgIcon ? <SvgIcon /> : null}
        <Text
          style={{
            textAlign: 'center',
            padding: normalize(5),
            fontSize: txtSize,
            color: txtColor,
            fontFamily: fontFamily.bold,
          }}>
          {title}
        </Text>
      </>
    </TouchableOpacity>
  );
};

const SwipeableComponent = ({
  buttons,
  containerStyle,
  children,
  index,
  row,
  enabled,
  rowOpened = (index) => null,
}) => {
  const renderRightAction = () => {
    return (
      <View
        style={[
          styles.rigntActionContainer,
          {flex: buttons?.length > 2 ? 0.55 : 0.45},
        ]}>
        {buttons.map((button, index) => {
          return (
            <ButtonComponent
              key={index}
              title={button.title}
              onClick={button.action}
              bgColor={button?.style?.backgroundColor || Colors.blue}
              txtColor={button?.style?.txtColor || Colors.white}
              txtSize={button?.style?.txtSize || textSizes.h12}
              SvgIcon={button?.SvgIcon}
            />
          );
        })}
      </View>
    );
  };
  const SwipeRef = createRef(null);
  //  let prevOpenedRow;
  // const closeRow =(index)=> {
  //   if (prevOpenedRow && prevOpenedRow != index) {
  //   prevOpenedRow.close();
  //   }
  //   prevOpenedRow = index;

  // }

  return (
    <View
      style={[
        styles.swipebaleContainer,
        {
          backgroundColor:
            (I18nManager.isRTL
              ? Colors.deleateRed
              : buttons[0]?.style?.backgroundColor) || Colors.blue,
          borderRadius: normalize(8),
        },
        containerStyle,
      ]}>
      <Swipeable
        enabled={enabled}
        containerStyle={[{borderRadius: normalize(5)}]}
        renderRightActions={renderRightAction}
        ref={(ref) => (row[index] = ref)}
        onSwipeableOpen={() => {
          rowOpened(index);
        }}>
        {children}
      </Swipeable>
    </View>
  );
};

export default SwipeableComponent;

const styles = StyleSheet.create({
  btnStyle: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  rigntActionContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  swipebaleContainer: {
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
});
