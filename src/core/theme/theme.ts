import { responsiveFontSizes } from '@mui/material/styles';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

const customTheme = (paletteType: 'light' | 'dark' | undefined = 'light') => {
  const theme: any = paletteType === 'light' ? lightTheme : darkTheme;
  return responsiveFontSizes(theme, { factor: 2.2 });
};

export default customTheme;
