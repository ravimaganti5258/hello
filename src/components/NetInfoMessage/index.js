import React from 'react';

import {Platform, SafeAreaView} from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {Text} from '../Text';
import {Colors} from '../../assets/styles/colors/colors';

export const NetInfoMessage = ({
  message,
  type = 'error',
  backgroundColor = 'white',
}) => {
  return (
    <>
      <SafeAreaView style={{backgroundColor: backgroundColor}}>
        <Container
          style={{
            backgroundColor:
              type == 'error' ? Colors?.noInternetBackground : Colors.green,
          }}>
          <Text
            size={textSizes.h12}
            fontFamily={fontFamily.semiBold}
            style={{paddingVertical: normalize(4)}}
            color={Colors.black}>
            {message}
          </Text>
        </Container>
      </SafeAreaView>
    </>
  );
};

const Container = styled.View`
  /* position: absolute; */
  /* top: ${Platform.OS === 'ios' ? normalize(0) : normalize(10)}px; */
  /* height: ${Platform.OS === 'ios' ? normalize(70) : normalize(25)}px; */
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 1;
`;

NetInfoMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
};
