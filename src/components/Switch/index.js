import React from 'react';

import {Switch} from 'react-native';

import {Colors} from '../../assets/styles/colors/colors';
import { NativeModules, I18nManager } from 'react-native';
export default ({
  onChange,
  value,
  trackColor = Colors.gold,
  thumbColor = Colors.white,
  disabled = false,
}) => {
  return (
    <Switch
      onChange={onChange}
      value={value}
      trackColor={{true: trackColor, false: Colors.lightGray}}
      thumbColor={thumbColor}
      disabled={disabled}
      style={{
        transform:
          Platform.OS === 'ios' ? [{scaleX:  I18nManager.isRTL ? -0.7 : 0.7}, {scaleY: 0.6}] : [{scale: 1}],
      }}
    />
  );
};
