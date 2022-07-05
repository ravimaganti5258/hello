import React from 'react';

import {Platform, StyleSheet} from 'react-native';

import {useColors} from '../../hooks/useColors';
import {useDimensions} from '../../hooks/useDimensions';
import {normalize} from '../../lib/globals';
import ActivityIndicatorLoader from '../ActivityIndicator';
import {ModalContainer} from '../Modal';

const Loader = ({visibility}) => {
  const {colors} = useColors();
  const {height} = useDimensions();

  return (
    <ModalContainer
      containerStyles={{...styles.containerStyles, top: height / 2.4}}
      visibility={visibility}>
      <ActivityIndicatorLoader
        color={colors?.PRIMARY_BACKGROUND_COLOR}
        size={Platform.OS === 'android' ? normalize(35) : 'large'}
      />
    </ModalContainer>
  );
};

export default Loader;

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: '#00000000',
    elevation: 0,
  },
});
