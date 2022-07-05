import React from 'react';

import {Image, StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import PropTypes from 'prop-types';

import {normalize} from '../../lib/globals';
import {Icon} from '../../components/Icon';
import {IONICONS} from '../../util/iconTypes';
import {Colors} from '../../assets/styles/colors/colors';

const MarkerView = ({
  coordinate,
  source,
  markerColor = Colors.blue,
  type = 'marker',
  callout,
  calloutStyles,
}) => {
  switch (type) {
    case 'currentLocation':
      return (
        <MapboxGL.PointAnnotation
          id={`id-${coordinate}`}
          coordinate={coordinate}>
          <View style={[styles.crrLocation, {backgroundColor: markerColor}]} />
        </MapboxGL.PointAnnotation>
      );

    case 'marker':
      return source ? (
        <MapboxGL.MarkerView
          id={`id-${coordinate}`}
          key={`key-${coordinate}`}
          coordinate={coordinate}>
          <Image source={source} style={styles.marker} />
          {callout != null ? (
            <MapboxGL.Callout
              title={callout}
              style={[{maxWidth: normalize(150)}, calloutStyles]}
            />
          ) : null}
        </MapboxGL.MarkerView>
      ) : (
        <MapboxGL.PointAnnotation
          id={`id-${coordinate}`}
          coordinate={coordinate}>
          <Icon
            type={IONICONS}
            name={'md-location-sharp'}
            size={normalize(24.48)}
            color={markerColor}
          />
          {callout != null ? (
            <MapboxGL.Callout
              title={callout}
              style={[{maxWidth: normalize(150)}, calloutStyles]}
            />
          ) : null}
        </MapboxGL.PointAnnotation>
      );
  }
};

export default MarkerView;

const styles = StyleSheet.create({
  crrLocation: {
    height: normalize(15),
    width: normalize(15),
    borderRadius: normalize(15 / 2),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  marker: {
    height: normalize(41),
    width: normalize(31),
    resizeMode: 'contain',
  },
});

MarkerView.propTypes = {
  coordinate: PropTypes.array.isRequired,
  source: PropTypes.any,
  markerColor: PropTypes.any,
  type: PropTypes.string,
};
