import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend((language, namespace, callback) => {
    import(`./locales/${language}/${namespace}.json`)
      .then(resources => {
        callback(null, resources.default);
      })
      .catch(error => {
        console.log("error", JSON.stringify(error, null, 2));
        callback(error, null);
      });
  }))
  .init({
    supportedLngs: ['en', 'es', 'pt'],
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    detection: {
      order: ['queryString', 'cookie'],
      cache: ['cookie']
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;