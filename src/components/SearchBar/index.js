import React from 'react';

import { StyleSheet, View, I18nManager } from 'react-native';
import { Colors } from '../../assets/styles/colors/colors';
import { Input } from '../Input';
import { fontFamily, normalize, textSizes } from '../../lib/globals';
import { ANT_DESIGN } from '../../util/iconTypes';

const SearchBar = ({ searchAction, onChangeText, onEndEditing, iconColorStyle, ...props }) => {
  return (
    <View style={styles.container}>
      <Input
        containerStyle={styles.inputDataContainer}
        inputContainer={styles.inputContainer}
        // style={[{ fontSize: textSizes.h11 }, props.style]}
        style={[{ fontSize: textSizes.h11, textAlign: I18nManager.isRTL ? 'right' : 'left' }, props.style]}
        iconType={ANT_DESIGN}
        icon={'search1'}
        iconStyle={iconColorStyle ? iconColorStyle : styles.iconStyle}
        iconAction={searchAction}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    // backgroundColor:'red'
  },
  inputDataContainer: {
    borderWidth: 1,
    borderRadius: normalize(6),
    borderColor: Colors.darkSecondaryTxt,
    paddingVertical: normalize(0),
    height: normalize(35),
  },
  inputContainer: { marginTop: 0 },
  iconStyle: {
    color: Colors.secondryBlack,
    fontSize: normalize(18),
  },
});
