import React from 'react';
import {View, Text} from 'react-native';
import {normalize} from './globals';

const FlashMessage = ({
  type,
  message,
  containerStyle,
  style,
  icon,
  iconStyle,
  textStyle,
}) => {
  return (
    <View style={{padding: normalize(20)}}>
      <Text style={{fontSize: normalize(14)}}>{message}</Text>
    </View>
  );
};

export default FlashMessage;
