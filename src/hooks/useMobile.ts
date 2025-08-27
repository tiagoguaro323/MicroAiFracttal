
import { Theme, useMediaQuery } from '@mui/material';
/**
 * Evalua si la aplicación se esta ejecutando desde
 * un dispositivo movil o desde web
 * @returns true si se esta ejecutando desde un dispositivo movil
 * de lo contrario retorna false
 * {@link
 * https://mui.com/material-ui/customization/breakpoints/#theme-breakpoints-down-key-media-query}
 */
export default function useMobile() {
  return useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
}
