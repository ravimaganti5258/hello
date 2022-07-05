import {Dimensions} from 'react-native';

const standardWidth = 414.0;
const standardHeight = 780.0;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export function widthScale(dimensionWidth) {
  return (dimensionWidth / standardWidth) * screenWidth;
}

export function heightScale(dimensionHeight) {
  return (dimensionHeight / standardHeight) * screenHeight;
}
