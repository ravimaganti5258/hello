import React from 'react';

import {ActivityIndicator, StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {normalize, textSizes} from '../../lib/globals';
import {Colors} from '../../assets/styles/colors/colors';
import Button from './index';
import {useColors} from '../../hooks/useColors';

const PairButton = ({
  title1,
  title2,
  onPressBtn1,
  onPressBtn2,
  btn1Style,
  btn2Style,
  containerStyle,
  t1,
  disable=false,
  ...props
}) => {
  const {colors} = useColors();
  return (
    <View style={[styles.btnContainer, containerStyle]}>
      <Button
        title={title1}
        style={[styles.btnStyle, btn1Style]}
        backgroundColor={Colors.silver}
        txtColor={Colors?.PRIMARY_BACKGROUND_COLOR}
        width={'45%'}
        height={'auto'}
        onClick={onPressBtn1}
        fontSize={normalize(14)}
        
      />
      <Button
        title={title2}
        style={[styles.btnStyle, btn2Style]}
        backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
        txtColor={t1?t1:Colors.white}
        width={'45%'}
        height={'auto'}
        onClick={onPressBtn2}
        fontSize={normalize(14)}
        disabled={disable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
  },
  btnStyle: {
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: normalize(3),
    opacity: 1,
    padding: normalize(10),
  },
});
export default PairButton;
