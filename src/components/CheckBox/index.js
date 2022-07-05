import React, { memo } from 'react';

import CheckBox from '@react-native-community/checkbox';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { Text } from '../Text';
import { normalize } from '../../lib/globals';
import { Colors } from '../../assets/styles/colors/colors';

const Checkbox = ({
  disabled,
  value,
  handleValueChange,
  label,
  onTintColor = Colors.primaryColor,
  onFillColor =
  Colors.primaryColor,
  tintColor = Colors.primaryColor,
  labelSize = 14,
  labelColor = Colors.black,
  ckBoxStyle,
  containerStyles,
  hideBox = false,
  onCheckColor = Colors.white,
  onAnimationType = 'fill',
  lableStyle,
  
}) => {
  return (
    <CheckBoxContainer style={containerStyles}>
      <CheckBox
        boxType={'square'}
        onValueChange={handleValueChange}
        disabled={disabled}
        style={ckBoxStyle}
        tintColors={{ true: onFillColor, false: onTintColor }}
        onFillColor={onFillColor}
        onTintColor={onTintColor}
        onCheckColor={onCheckColor}
        onAnimationType={onAnimationType}
        value={value}
        hideBox={hideBox}
        tintColor={tintColor}
      />
      {label ? (
        <Text
          size={labelSize}
          style={[{ color: labelColor, marginLeft: normalize(10) }, lableStyle]}>
          {label}
        </Text>
      ) : null}
    </CheckBoxContainer>
  );
};

const CheckBoxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

CheckBox.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.any,
  handleValueChange: PropTypes.func,
  label: PropTypes.any,
  onTintColor: PropTypes.string,
  onFillColor: PropTypes.string,
  tintColor: PropTypes.string,
  labelSize: PropTypes.number,
  labelColor: PropTypes.string,
  ckBoxStyle: PropTypes.any,
  containerStyles: PropTypes.object,
  hideBox: PropTypes.bool,
  onCheckColor: PropTypes.string,
  onAnimationType: PropTypes.string,
};

export default memo(Checkbox);
