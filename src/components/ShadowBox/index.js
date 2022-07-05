import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Colors} from '../../assets/styles/colors/colors';
import {normalize} from '../../lib/globals';

const ShadowBox = ({containerStyles, children}) => {
  return (
    <View style={[styles.shadowContainer, containerStyles]}>{children}</View>
  );
};

export default ShadowBox;

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
    // alignSelf:'center',
    // marginLeft:normalize(8),
    backgroundColor: Colors.white,
    borderRadius: normalize(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
    // marginLeft: normalize(9),
    // marginRight:5
  },
});
