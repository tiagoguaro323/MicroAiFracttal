import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Bowser from 'bowser';
import { useSelector } from 'react-redux';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useLanguageCode } from 'fracttal-core';
import moment from 'moment';
import { StyledEngineProvider, Theme, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import customTheme from 'core/theme/theme';
import GlobalCss from 'core/theme/GlobalCss';
import Routers from './Routers';
import 'moment/dist/locale/es';
import 'moment/dist/locale/pt';
import 'moment/dist/locale/fr';
import 'moment/dist/locale/gl';
import 'moment/dist/locale/ca';
import 'moment/dist/locale/eu';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);

export default function App() {
  const configTheme = useSelector((state: any) => state.theme);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [, i18n] = useTranslation();
  const language = useLanguageCode();

  const theme = React.useMemo(() => {
    const preferredType = configTheme || (prefersDarkMode ? 'dark' : 'light');
    return customTheme(preferredType);
  }, [configTheme, prefersDarkMode]);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    let lastTouchEnd = 0;
    // only IOS disabled zoom double Tap and zoom with touch
    if (browser.getOSName().toLowerCase() === 'ios') {
      document.addEventListener(
        'touchend',
        (event) => {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        { passive: false },
      );
      document.addEventListener(
        'touchmove',
        (event: any) => {
          if (event.scale !== 1) {
            event.preventDefault();
          }
        },
        { passive: false },
      );
    }

    const ele = document.getElementById('ipl-progress-indicator');
    if (ele) {
      ele.classList.add('available');
      setTimeout(() => {
        ele.remove();
      }, 2000);
    }
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <GlobalCss />
                <CssBaseline />
                <Routers />
            </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Suspense>
  );
}
