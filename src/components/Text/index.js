import React, {memo} from 'react';

import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import {textSizes, fontFamily as fontFam, normalize} from '../../lib/globals';
import {Colors} from '../../assets/styles/colors/colors';

export const Text = memo(
  ({
    children,
    style,
    size = normalize(14),
    fontWeight,
    italic,
    align = 'center',
    color = Colors.secondryBlack,
    fontFamily = fontFam.regular,
    ...props
  }) => (
    <TextComponent
      size={size}
      style={[{fontFamily: fontFamily}, style]}
      italic={italic}
      align={align}
      color={color}
      {...props}>
      {children}
    </TextComponent>
  ),
);

const TextComponent = styled.Text`
  font-size: ${({size}) => size || textSizes.h10}px;
  font-style: ${({italic}) => (italic ? 'italic' : 'normal')};
  align-self: ${({align}) => align};
  color: ${({color}) => color};
`;

Text.propTypes = {
  children: PropTypes.any,
  style: PropTypes.any,
  weight: PropTypes.any,
  size: PropTypes.number,
  fontWeight: PropTypes.any,
  italic: PropTypes.any,
  align: PropTypes.string,
  color: PropTypes.string,
};
