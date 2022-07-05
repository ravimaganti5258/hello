import React from 'react';

import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';
import {BlurView, VibrancyView} from '@react-native-community/blur';

import {normalize} from '../../lib/globals';
import {useDimensions} from '../../hooks/useDimensions';

export const ModalContainer = ({
  visibility,
  handleModalVisibility,
  containerStyles,
  overlayStyles,
  children,
  mainContainerStyle,
  ...props
}) => {
  const {height, width} = useDimensions();

  return (
    <View>
      <Modal
        visible={visibility}
        transparent
        onRequestClose={handleModalVisibility}
        animationType={'fade'}
        supportedOrientations={['portrait', 'landscape']}>
        <TouchableWithoutFeedback onPress={handleModalVisibility}>
          <View style={{flex: 1}}>
            <BlurView
              style={[styles.modalOverlay, overlayStyles]}
              reducedTransparencyFallbackColor="white"
              blurType={'light'}
              blurAmount={1}
            />
          </View>
        </TouchableWithoutFeedback>

        <View
          style={{
            ...styles.modalContent,
            top: height / 5.5,
            width: width * 0.9,
            ...containerStyles,
          }}>
          {children}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: normalize(15),
    elevation: 4,
    marginTop:50,
    
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000021',
  },
});

ModalContainer.propTypes = {
  visibility: PropTypes.bool.isRequired,
  handleModalVisibility: PropTypes.func,
  children: PropTypes.any,
};
