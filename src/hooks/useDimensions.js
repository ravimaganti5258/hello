import {useWindowDimensions} from 'react-native';

export const useDimensions = () => {

  const {fontScale,height,width,scale} = useWindowDimensions();

  return {
    width,
    height,
    fontScale,scale,
    isLandscape: width > height,
  };
};
