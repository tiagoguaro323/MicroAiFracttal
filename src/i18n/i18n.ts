import i18n, { TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
import { initReactI18next } from 'react-i18next';

import { useLanguageCode } from 'hooks';

import 'moment/locale/es';
import 'moment/locale/pt';

import validate from 'validate.js';

export const validateLanguage = (t: TFunction) => {
  validate.validators.date.options = {
    message: t('VALIDATE_DATE'),
  };

  validate.validators.datetime.options = {
    message: t('VALIDATE_DATE'),
  };

  validate.validators.email.options = {
    message: t('VALIDATE_EMAIL'),
  };

  validate.validators.equality.options = {
    message: t('VALIDATE_EQUALITY'),
  };

  validate.validators.exclusion.options = {
    message: t('VALIDATE_EXCLUSION'),
  };

  validate.validators.format.options = {
    message: t('VALIDATE_FORMAT'),
  };

  validate.validators.inclusion.options = {
    message: t('VALIDATE_INCLUSION'),
  };

  validate.validators.length.options = {
    notValid: t('VALIDATE_NOTVALID'),
    tooLong: t('VALIDATE_TOOLONG'),
    tooShort: t('VALIDATE_TOOSHORT'),
    wrongLength: t('VALIDATE_WRONGLENGTH'),
  };

  validate.validators.numericality.options = {
    notInteger: t('VALIDATE_ONLYINTEGER'),
    notValid: t('VALIDATE_STRICT'),
    notGreaterThan: t('VALIDATE_GREATERTHAN'),
    notGreaterThanOrEqualTo: t('VALIDATE_GREATERTHANOREQUALTO'),
    notEqualTo: t('VALIDATE_EQUALTO'),
    notLessThanOrEqualTo: t('VALIDATE_LESSTHANOREQUALTO'),
    notLessThan: t('VALIDATE_LESSTHAN'),
    notDivisibleBy: t('VALIDATE_DIVISIBLEBY'),
    notOdd: t('VALIDATE_ODD'),
    notEven: t('VALIDATE_EVEN'),
  };

  validate.validators.presence.options = {
    message: t('VALIDATE_PRESENCE'),
  };

  validate.validators.url.options = {
    message: t('VALIDATE_URL'),
  };
};

/**
 * Función para el manejo de los diferentes lenguajes
 * @param resources recibe un objeto con la configuración de los
 * lenguajes en el que se desea hacer la traducción
 * @returns un objeto i18n libreria con funcionalidades para el
 * manejo de una aplicación en diferentes idiomas
 * */

export default function configI18nResouses(resources: any) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
      {
        lowerCaseLng: true,
        cleanCode: true,
        // debug: true,
        fallbackLng: 'en', // use en if detected lng is not available
        keySeparator: false,
        resources,
        interpolation: {
          escapeValue: false,
        },
      },
      (err: any, t: any) => {
        if (err) return;
        validateLanguage(t);
        const language = useLanguageCode();
        moment.locale(language);
      },
    );

  return i18n;
}
