import React from 'react';

import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

import {Colors} from '../../assets/styles/colors/colors';

const ActivityIndicatorLoader = ({color = Colors.black, size = 'small', style}) => {
  return <ActivityIndicator color={color} style={style} size={size} />;
};

ActivityIndicatorLoader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.any,
  style: PropTypes.object,
};

export default ActivityIndicatorLoader;
