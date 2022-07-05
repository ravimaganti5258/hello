import React, { useEffect } from 'react';

import { StyleSheet } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import PropTypes from 'prop-types';
import { normalize } from '../../lib/globals';

const MapViewContainer = ({
  style,
  centerCoordinate,
  zoomLevel = 10,
  handleOnMapPress,
  scrollEnabled = true,
  zoomEnabled = true,
  children,
}) => {

  return (
    <MapboxGL.MapView
      style={[styles.map, style]}
      onPress={handleOnMapPress}
      logoEnabled={false}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}>
      <MapboxGL.Camera
        zoomLevel={zoomLevel}
        centerCoordinate={centerCoordinate}
        minZoomLevel={4}
        maxZoomLevel={20}
        animationMode={'flyTo'}
      />
      {children}
    </MapboxGL.MapView>
  );
};

export default MapViewContainer;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    bottom: normalize(5)
  },
});

MapViewContainer.propTypes = {
  style: PropTypes.any,
  centerCoordinate: PropTypes.array.isRequired,
  zoomLevel: PropTypes.number,
  handleOnMapPress: PropTypes.func,
  children: PropTypes.any,
};
