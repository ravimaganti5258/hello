import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from 'react-native-i18n';

import en from './locales/en.json';
import ar from './locales/ar.json';

I18n.fallbacks = true;

I18n.translations = {
  en,
  ar,
};

export const currentLocale = I18n.currentLocale();


export const isRTL =
  currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

I18nManager.allowRTL(isRTL);

export const strings = (name, params = {}) => {
  AsyncStorage.getItem('Language').then((res) => {
    if (res) {
      I18n.locale = res;
    } else {
      I18n.locale = 'en';
    }
  });
  return I18n.t(name, params);
};

export default I18n;
