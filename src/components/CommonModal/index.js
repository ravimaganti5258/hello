import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {ModalContainer} from '../Modal';
import {Text} from '../Text';
import {useDimensions} from '../../hooks/useDimensions';
import {fontFamily, normalize, normalizeHeight} from '../../lib/globals';
import {Colors} from '../../assets/styles/colors/colors';
import {PlusIcon} from '../../assets/img';

const index = ({
  visibility,
  title,
  handleModalVisibility,
  headerSection,
  bodySection,
  footerSection,
  modalContainerStyles,
}) => {
  const {height, width} = useDimensions();
  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleModalVisibility}
      containerStyles={{
        ...styles.modalContainer,
        maxHeight: height / 1.2,
        ...modalContainerStyles,
      }}>
      <View style={[styles.container]}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          {headerSection()}
          {bodySection()}
          {footerSection()}
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    padding: normalize(23),
  },
  modalContainer: {
    borderRadius: normalize(20),
    width: '90%',
    top: Platform.OS === 'ios' ? normalize(100) : normalize(60),
  },
});
