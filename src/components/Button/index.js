import React from 'react';

import {ActivityIndicator, StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import {fontFamily as fontFam, normalize, textSizes} from '../../lib/globals';
import {Text} from '../Text';
import {Colors} from '../../assets/styles/colors/colors';

const Button = ({
  title,
  disabled,
  children,
  onClick,
  width,
  loading,
  fontSize,
  txtColor,
  backgroundColor = Colors.lightBlue,
  height,
  txtStyle,
  activeOpacity = 0.6,
  leftIcon = false,
  leftIconStyle,
  fontFamily = fontFam.regular,
  loaderStyle,
  rightText = '',
  rightTextStyle,
  btnLeftIconEnable = false,
  BtnLeftIcon,
  BtnLeftIconStyle,
  ...props
}) => {
  return (
    <ButtonView
      onPress={
        disabled
          ? (e) => {
              e.persist();
              ('');
            }
          : (e) => {
              e.persist();
              onClick();
            }
      }
      style={[
        {
          width: width ? width : '75%',
          height: height ? height : normalize(35),
        },
        props.style,
      ]}
      disabled={disabled}
      width={width}
      height={height}
      activeOpacity={activeOpacity}
      bgColor={backgroundColor}>
      {leftIcon && <View style={[styles.status, leftIconStyle]} />}
      {btnLeftIconEnable && (
        <BtnLeftIcon
          fill={BtnLeftIconStyle?.fill}
          style={{marginRight: normalize(10)}}
          height={BtnLeftIconStyle?.height}
          width={BtnLeftIconStyle?.width}
        />
      )}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.white}
          style={[{padding: normalize(15)}, loaderStyle]}
        />
      ) : (
        <Text
          style={txtStyle}
          color={txtColor}
          size={fontSize || textSizes.h7}
          fontFamily={fontFamily}>
          {title}
        </Text>
      )}
      {rightText != '' && (
        <Text style={rightTextStyle} fontFamily={fontFamily}>
          {rightText}
        </Text>
      )}
    </ButtonView>
  );
};

const ButtonView = styled.TouchableOpacity`
  background-color: ${({bgColor = 'blue'}) => bgColor};
  border-radius: ${normalize(20)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

Button.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.any,
  loading: PropTypes.bool,
  fontSize: PropTypes.number,
  txtColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  height: PropTypes.any,
};

const styles = StyleSheet.create({
  status: {
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(20 / 2),
    backgroundColor: '#6CA5FE',
    marginRight: normalize(10),
  },
});
export default Button;
