import React from 'react';
import {View} from 'react-native';
import {Colors} from '../../assets/styles/colors/colors';
import {normalize} from '../../lib/globals';
import {Text} from '../Text';

const LabelComponent = ({label, required, labelStyle, style}) => {
  return (
    <View>
      <Text
        align={'flex-start'}
        style={[
          {
            color: Colors?.dangerRed,
            fontSize: normalize(13),
          },
          style,
        ]}>
        {required ? '* ' : ''}
        <Text style={[{color: Colors?.secondryBlack}, labelStyle]}>
          {label}
        </Text>
      </Text>
    </View>
  );
};

export default LabelComponent;
