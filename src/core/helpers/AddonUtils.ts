import { IAddon } from 'core/types/AuthTypes';
import { FRACTTAL_HUB_ADDON, FRACTTAL_AI_ADDON } from 'constants/Addons';

/**
 * Verifica si un addon específico está disponible y activado
 * @param addons Array de addons del usuario
 * @param addonKey Clave del addon a verificar
 * @returns true si el addon está disponible y activado
 */
export const hasAddon = (addons: IAddon[], addonKey: string): boolean => {
  return addons.some((addon) => addon.description === addonKey && addon.added);
};

/**
 * Verifica si el addon Fracttal Hub está disponible y activado
 * @param addons Array de addons del usuario
 * @returns true si el addon está disponible y activado
 */
export const hasFracttalHubAddon = (addons: IAddon[]): boolean => {
  return hasAddon(addons, FRACTTAL_HUB_ADDON);
};

/**
 * Verifica si el addon Fracttal AI está disponible y activado
 * @param addons Array de addons del usuario
 * @returns true si el addon está disponible y activado
 */
export const hasFracttalAIAddon = (addons: IAddon[]): boolean => {
  return hasAddon(addons, FRACTTAL_AI_ADDON);
};
