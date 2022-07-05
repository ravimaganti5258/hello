import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Colors} from '../../assets/styles/colors/colors';
import {normalize} from '../../lib/globals';
import {IONICONS} from '../../util/iconTypes';
import {Icon} from '../Icon';

const BadgeIcon = ({
  iconColor,
  iconSize,
  iconType,
  iconName,
  withBadge,
  badgeColor,
  badgeStyles,
  iconStyles,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Icon
        type={iconType || IONICONS}
        name={iconName || 'notifications-outline'}
        color={iconColor || Colors.white}
        size={normalize(iconSize) || normalize(23)}
        style={iconStyles}
        onPress={onPress}
      />
      {withBadge ? (
        <View
          style={{
            ...styles.badgeStyles,
            backgroundColor: badgeColor || Colors.green,
            ...badgeStyles,
          }}
        />
      ) : null}
    </View>
  );
};

export default BadgeIcon;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  badgeStyles: {
    height: normalize(8),
    width: normalize(8),
    borderRadius: normalize(8 / 2),
    position: 'absolute',
    top: 3,
    right: 3,
  },
});
