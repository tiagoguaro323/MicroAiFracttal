
import i18n from 'i18next';
/**
 * Evalua el lenguaje configurado en la aplicación de fracttal one
 * @returns Retorna las iniciales del lenguaje 
 * en el cual esta configurada fracttal one
 * 
 */
export default function useLanguageCode() {
  let lan = 'en';
  if (i18n.language.toLowerCase() === 'pt-br') {
    lan = i18n.language.toLowerCase();
  } else lan = i18n.language.substring(0, 2);
  return lan;
}
