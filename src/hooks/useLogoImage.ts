import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const logoVersion = '160625';

const SUPPORTED_SUBDOMAINS = [
  'gitel',
  'teckma',
  'ealogistica3m',
  'sodexo',
  'arquimed',
  'tksystem',
  'liverpool',
  'somining',
  'ecora',
  'esmax',
  'comunidad',
  'community',
  'test',
  'senave',
  'cce',
  'novaera',
  'ekkogroup',
  'uss',
  'atmalagoon',
  'cm-feira',
  'uasl',
  'nubank',
  'lubraxsystem',
  'impactus',
  'heatingcooling',
  'gnatus',
  'tiendainglesa',
  'claritybuildingcontrols',
  'bracell',
  'briggs',
];

/**
 * A custom React hook that determines the appropriate logo image URL
 * based on the current subdomain and theme mode.
 *
 * The hook checks the hostname's subdomain against a list of supported subdomains.
 * If the subdomain is "community", it selects a logo based on the theme mode (dark or light).
 * For other supported subdomains, it constructs the logo URL using the subdomain name.
 * If the subdomain is not supported, it defaults to a generic logo URL.
 *
 * @returns {string} The URL of the logo image to be displayed.
 */
const useLogoImage = (): string => {
  const [logoImage, setLogoImage] = useState<string>('');
  const theme = useTheme();

  useEffect(() => {
    const hostname = window.location.hostname.split('.')[0];

    if (SUPPORTED_SUBDOMAINS.includes(hostname)) {
      if (hostname.includes('community')) {
        setLogoImage(
          theme.palette.mode === 'dark'
            ? '/images/communitylogo_dark.png'
            : '/images/communitylogo.png',
        );
      } else {
        setLogoImage(`/images/${hostname}logo.png?v=${logoVersion}`);
      }
    } else {
      setLogoImage(
        `/images/logo_fracttal_one_facelit_${theme.palette.mode}.svg`,
      );
    }
  }, [theme.palette.mode]);

  return logoImage;
};

export default useLogoImage;
