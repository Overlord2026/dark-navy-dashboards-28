import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import zhTranslations from '@/locales/zh.json';
import hiTranslations from '@/locales/hi.json';
import arTranslations from '@/locales/ar.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  zh: { translation: zhTranslations },
  hi: { translation: hiTranslations },
  ar: { translation: arTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;