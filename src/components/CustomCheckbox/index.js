import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Text} from '../Text';
import {normalize} from '../../lib/globals';
import {Colors} from '../../assets/styles/colors/colors';
import {WhiteRight} from '../../assets/img/index';
import {useColors} from '../../hooks/useColors';

const Checkbox = ({
  label,
  labelSize = normalize(14),
  labelColor = Colors.black,
  containerStyles,
  check = false,
  CheckBoxWrapStyle,
  onChange,
  iconHeight = normalize(12),
  iconWidth = normalize(12),
  labelStyle,
}) => {
  const {colors} = useColors();
  return (
    <CheckBoxContainer style={containerStyles}>
      <TouchableOpacity
        style={[
          styles.centeredView,
          CheckBoxWrapStyle,
          {
            backgroundColor: check
              ? colors?.PRIMARY_BACKGROUND_COLOR
              : Colors.white,
            borderColor: check
              ? colors?.PRIMARY_BACKGROUND_COLOR
              : colors?.PRIMARY_BACKGROUND_COLOR,
          },
        ]}
        onPress={() => {
          onChange();
        }}>
        <WhiteRight fill={Colors.white} height={iconHeight} width={iconWidth} />
      </TouchableOpacity>
      {label ? (
        <Text
          size={labelSize}
          style={[{color: labelColor, marginLeft: normalize(10)}, labelStyle]}>
          {label}
        </Text>
      ) : null}
    </CheckBoxContainer>
  );
};

const CheckBoxContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const styles = StyleSheet.create({
  centeredView: {
    borderWidth: 1,
    borderColor: '#AAAAAA',
    padding: normalize(2),
    borderRadius: normalize(3),
  },
});

export default memo(Checkbox);
