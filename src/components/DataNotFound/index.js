import React from 'react';

import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

import { EmptyBox } from '../../assets/img';
import { Colors } from '../../assets/styles/colors/colors';
import {
  fontFamily,
  normalize,
  textSizes,
  normalizeHeight,
} from '../../lib/globals';
import { strings } from '../../lib/I18n';

export const DataNotFound = ({ message = strings('common.dataNotFound') }) => {
  const { height, width } = Dimensions.get("window")
  return (
    <View style={styles.noDataContainer}>
      <EmptyBox style={styles.imageNodata} height={normalize(180)} />
      <Text style={styles.noDataTxt}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTxt: {
    fontSize: textSizes.h10,
    color: Colors.borderGrey,
    bottom: 10
  },
  imageNodata: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: normalize(15), marginBottom: normalize(15),


  },
});
