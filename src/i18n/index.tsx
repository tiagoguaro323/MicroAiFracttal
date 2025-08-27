import { configI18nResouses } from 'fracttal-core';
import en from './languages/en.json';
import es from './languages/es.json';
import ptBr from './languages/pt-br.json';
import pt from './languages/pt.json';
import gl from './languages/gl.json';
import eu from './languages/eu.json';
import ca from './languages/ca.json';
import fr from './languages/fr.json';
import it from './languages/it.json';
import esEs from './languages/es-es.json';

const i18n = configI18nResouses({
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  'pt-br': {
    translation: ptBr,
  },
  pt: {
    translation: pt,
  },
  gl: {
    translation: gl,
  },
  ca: {
    translation: ca,
  },
  eu: {
    translation: eu,
  },
  fr: {
    translation: fr,
  },
  it: {
    translation: it,
  },
  'es-es': {
    translation: esEs,
  },
});

export default i18n;
