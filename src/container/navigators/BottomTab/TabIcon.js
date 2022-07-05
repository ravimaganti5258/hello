import React from 'react';
import {StyleSheet} from 'react-native';
import BadgeIcon from '../../../components/BadgeIcon';
import {normalize} from '../../../lib/globals';

const TabIcon = ({
  focused,
  iconType,
  iconName,
  withBadge = false,
  ...props
}) => {
  return (
    <BadgeIcon
      iconType={iconType}
      iconName={iconName}
      iconSize={normalize(34)}
      withBadge={withBadge}
      color={'white'}
      badgeStyles={{top: 0, right: 0}}
      badgeColor={'lightgreen'}
      {...props}
    />
  );
};

export default TabIcon;

const styles = StyleSheet.create({});
