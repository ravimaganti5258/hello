import {useDispatch} from 'react-redux';

import { changeAppTheme } from '../redux/setting/action';

export const useSwitchTheme = () => {
  const dispatch = useDispatch();

  const handleThemeChange = (themeMode='blue') => {
    dispatch(changeAppTheme(themeMode))
  };

  return {handleThemeChange};
};
