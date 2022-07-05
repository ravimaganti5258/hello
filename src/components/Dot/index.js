import React from 'react';

import {View} from 'react-native';

import {Colors} from '../../assets/styles/colors/colors';
import {normalize} from '../../lib/globals';

export default ({height = 8, width = 8, color = Colors.successGreen,style}) => {
  return (
    <View
      style={[{
        height: normalize(height),
        width: normalize(width),
        borderRadius: normalize(height/2),
        backgroundColor: color,
      },{...style}]}
    />
  );
};
