import React from 'react';

import {StyleSheet, View} from 'react-native';
import {normalize} from '../../lib/globals';
import Button from '../Button';

export default ({buttons, constinerStyles}) => {
  return (
    <View style={[styles.container, constinerStyles]}>
      {buttons.map((button, i) => {
        return (
          <View style={{flex: 1}} key={`ID-${i}`}>
            <Button
              title={button?.btnName}
              onClick={button.onPress}
              style={{
                ...styles.btnStyles,
                ...button?.btnStyles,
              }}
              activeOpacity={0.8}
              txtStyle={button?.btnTxtStyles}
              btnLeftIconEnable={button.leftIcon ? button.leftIcon : false}
              BtnLeftIcon={button.iconName}
              BtnLeftIconStyle={button?.leftIconStyle}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  btnStyles: {
    alignSelf: 'center',
    borderRadius: normalize(20),
    width: '90%',
    alignItems: 'center',
  },
});
