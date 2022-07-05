import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nManager } from 'react-native';
import translationEN from '../I18n/locales/en.json'
import translationAR from '../I18n/locales/ar.json'

const resources = {
    en: {
        translation: translationEN,
    },
    ar: {
        translation: translationAR,
    }
};

i18n.
    use(initReactI18next)
    .init({
        lng: I18nManager.isRTL ? 'ar' : 'en',
        supportedLngs: ['en', 'ar'],
        fallbackLng: 'en',
        defaultNS: 'translation',
        resources
    });

export default i18n;