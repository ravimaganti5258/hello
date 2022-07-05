import {useTheme} from '@react-navigation/native';

export const useColors = () => {
  const {colors} = useTheme();

  return {colors};
};
