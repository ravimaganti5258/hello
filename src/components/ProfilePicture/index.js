import React from 'react';

import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

import { Colors } from '../../assets/styles/colors/colors';
import { Icon } from '../../components/Icon';
import { normalize } from '../../lib/globals';
import { Images } from '../../lib/Images';
import { FEATHER } from '../../util/iconTypes';
import { useSelector } from 'react-redux';

export default ({
  imageSrc = {
    uri: 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
  },
  imageStyles,
  hasIcon = true,
  color = Colors.white,
  iconStyles,
  iconType = FEATHER,
  iconName = 'edit-2',
  iconSize = 14,
  iconContainer,
  type = 'editt',
  statusStyle,
  iconOnPress,
}) => {

  const profileData = useSelector((state) => state?.profileReducer?.profileInfo);

  let base64ProfileImage = `data:image/png;base64,${profileData?.ProfileImage}`;

  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <Image
          //source={imageSrc || Images.marker}
          source={
            profileData?.ProfileImage
              ? { uri: base64ProfileImage }
              : imageSrc || Images.marker
          }
          style={[styles.image, imageStyles]}
          resizeMode={'cover'}
        />
        {hasIcon ? (
          type == 'online' ? (
            <View style={[styles.status, statusStyle]} />
          ) : (
            <TouchableOpacity
              style={[styles.iconContainer, iconContainer]}
              activeOpacity={0.7}
              onPress={iconOnPress}>
              <Icon
                style={[styles.icon, iconStyles]}
                size={normalize(iconSize)}
                type={iconType}
                color={color}
                name={iconName}
              />
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(80 / 2),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    height: normalize(26),
    width: normalize(26),
    borderRadius: normalize(26 / 2),
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  status: {
    height: normalize(15),
    width: normalize(15),
    borderRadius: normalize(20 / 2),
    backgroundColor: '#2ECC71',
    position: 'absolute',
    bottom: normalize(5),
    right: 0,
  },
});
