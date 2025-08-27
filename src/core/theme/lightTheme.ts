import { TypographyOptions } from '@mui/material/styles/createTypography';
import { createTheme, Theme } from '@mui/material/styles';
import base, { light } from './custom/scroll';
import { bi, IBiColorMap, biLight } from './custom/bi';

// Ai
const primaryAi = 'url(#gradient1)';
const secondaryAi =
  'linear-gradient(45deg, var(--AI-1, rgba(4, 78, 198, 0.07)) 25%, var(--AI-2, rgba(0, 199, 255, 0.07)) 90%)';
const backgroundPrimary =
  'linear-gradient(70deg, var(--AI-1, #044EC6) 25%, var(--AI-2, #00C7FF) 90%)';
const backgroundPrimaryHover =
  'linear-gradient(45deg, var(--AI-1, rgba(4, 78, 198, 0.80)) 25%, var(--AI-2, rgba(0, 199, 255, 0.80)) 90%)';
const backgroundSecondary =
  'linear-gradient(89deg, var(--AI-1, rgba(4, 78, 198, 0.03)) 25%, var(--AI-2, rgba(0, 199, 255, 0.03)) 90%)';
const backgroundTertiary =
  'linear-gradient(70deg, var(--AI-1, #044EC6) 25%, var(--AI-2, #00C7FF) 90%)';
const boxShadow = '0px 0px 25px 0px rgba(0, 199, 255, 0.30)';

// Primary
const primaryMain = '#4687F1';
const primaryLight = '#6B9FF4';
const primaryDark = '#0B4199';

// Secondary
const secondaryMain = '#105DDB';
const secondaryLight = '#407DE2';
const secondaryDark = '#2652BC';

// Text
const textPrimary = '#000000';
const textSecondary = '#666666';
const textDisabled = '#A6A6A6';

// Action
const actionDefault = '#666666';
const actionHover = '#4687F11A';
const actionActive = '#4D4D4D';
const actionDisabled = '#D9D9D9';
const actionBackground = '#00000008';

// Other
const otherBackdrop = '#00000066';
const otherDivider = '#E6E6E6';
const otherSnackbar = '#262626';
const otherOutline = '#D9D9D9';
const otherRating = '#FEB436';
const otherBlueBackground = '#EDF3FE';
const circleBackground = '#ffffff80';

// Error status
const errorMain = '#EF5350';
const errorLight = '#F59896';
const errorDark = '#D32F2F';
const errorBackground = '#FEF5F5';

// Warning status
const warningMain = '#FED54F';
const warningLight = '#FFE284';
const warningDark = '#EF9831';
const warningBackground = '#FFFBEE';

// Info status
const infoMain = '#4687F1';
const infoLight = '#90B7F7';
const infoDark = '#315EA8';
const infoBackground = '#EDF3FE';

// Success status
const successMain = '#1CC853';
const successLight = '#77DE98';
const successDark = '#009B40';
const successBackground = '#E9FAEE';

// Content
const contentMain = '#FFFFFF';
const contentPrimary = '#FFFFFF';
const contentSecondary = '#FFFFFF';
const contentStatus = '#000000';

// Background
const backgroundSurface = '#FFFFFF';
const backgroundBackground = '#E3EDFD';
const backgroundAccent = '#D5DEEB';
const backgroundTransparent = 'transparent';

// New Dasboard
const dashboardSky1 = '#00B8D4';
const dashboardBlue1 = '#2979FF';
const dashboardBlue2 = '#64B5F6';
const dashboardGreen1 = '#00C853';
const dashboardRed1 = '#FF1744';
const dashboardRed2 = '#FF8A80';
const dashboardAqua1 = '#00BFA5';
const dashboardYellow1 = '#FFAB00';
const dashboardBrown2 = '#A1887F';
const dashboardPurple1 = '#4A148C';
const dashboardPurple2 = '#9575CD';
const dashboardGray1 = '#616161';
const dashboardGray2 = '#9E9E9E';

// Colors
const white = '#FFFFFF';
const black = '#000000';

const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: primaryMain, light: primaryLight, dark: primaryDark },
    ai: {
      primary: primaryAi,
      secondary: secondaryAi,
      backgroundPrimary,
      backgroundSecondary,
      backgroundTertiary,
      boxShadow,
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: textDisabled,
    },
    action: {
      default: actionDefault,
      hover: actionHover,
      active: actionActive,
      disabled: actionDisabled,
      background: actionBackground,
    },
    other: {
      backdrop: otherBackdrop,
      divider: otherDivider,
      snackbar: otherSnackbar,
      outline: otherOutline,
      rating: otherRating,
      blueBackground: otherBlueBackground,
      circleBackground,
      // Pertenecen a los colores de los estados
      errorBackground,
      warningBackground,
      infoBackground,
      successBackground,
      backgroundTransparent,
    },
    error: {
      main: errorMain,
      light: errorLight,
      dark: errorDark,
    },
    warning: {
      main: warningMain,
      light: warningLight,
      dark: warningDark,
    },
    info: {
      main: infoMain,
      light: infoLight,
      dark: infoDark,
    },
    success: {
      main: successMain,
      light: successLight,
      dark: successDark,
    },
    content: {
      main: contentMain,
      primary: contentPrimary,
      secondary: contentSecondary,
      status: contentStatus,
    },
    background: {
      paper: backgroundSurface, // surface
      default: backgroundBackground, // background
      accent: backgroundAccent,
    },
    dashboard: {
      sky1: dashboardSky1,
      blue1: dashboardBlue1,
      blue2: dashboardBlue2,
      green1: dashboardGreen1,
      red1: dashboardRed1,
      red2: dashboardRed2,
      aqua1: dashboardAqua1,
      yellow1: dashboardYellow1,
      brown2: dashboardBrown2,
      purple1: dashboardPurple1,
      purple2: dashboardPurple2,
      gray1: dashboardGray1,
      gray2: dashboardGray2,
    },
    divider: otherDivider,
    bi: {
      disabled: biLight.disabled,
      general: {
        ...bi.general,
        ...biLight.general,
      },
    },
    backgroundColor: {
      primary: `${infoMain}1A`,
      hover: `${infoMain}33`,
      marked: 'rgb(255, 249, 233)',
      info: '#00000008',
      priority: {
        high: '#ef53500d',
        medium: '#fed54f1a',
        low: '#1CC8530D',
      },
    },
    shadowDown: {
      xs: '0px 3px 4px 0px rgba(0, 0, 0, 0.05)',
      sm: '0px 3px 8px 0px rgba(0, 0, 0, 0.12)',
      md: '0px 3px 8px 0px rgba(0, 0, 0, 0.15)',
    },
    shadowUp: {
      xs: '0px -3px 4px 0px rgba(0, 0, 0, 0.05)',
      sm: '0px -3px 8px 0px rgba(0, 0, 0, 0.12)',
      md: '0px -3px 8px 0px rgba(0, 0, 0, 0.15)',
    },
  },
  typography: {
    fontFamily: 'Heebo ,Arial',
    fontSize: 12,
    manrope: {
      fontFamily: 'Manrope',
    },
    h1: {
      fontSize: '2.67rem', // 41px
    },
    h2: {
      fontSize: '1.9rem', // 26px
    },
    h3: {
      fontSize: '1.44rem', // 24px
    },
    h4: {
      fontSize: '1.4rem', // 22px
    },
    h5: {
      fontSize: '1.25rem', // 20px
    },
    h6: {
      fontSize: '1.159rem', // 17px
    },
    subtitle1: {
      fontSize: '1rem', // 16px
    },
    subtitle2: {
      fontSize: '0.75rem', // 12px
    },
    body1: {
      fontSize: '1rem', // 16px
    },
    body2: {
      fontSize: '0.9rem', // 14px
    },
    caption: {
      fontSize: '0.5999rem', // 10px
    },
    chip: {
      fontSize: '0.75rem', // 12px
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  } as ExtendedTypographyOptions,
  shape: {
    borderRadius: 4, // 4 px por defecto
  },
  spacing: 8,
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1300,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { ...base, ...light },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '8px 9px',
          '&:hover > svg.ico path': {
            stroke: black,
          },
        },
      },
    },
    MuiButtonGroup: {
      variants: [
        {
          props: { size: 'large' },
          style: {
            '& .MuiButtonGroup-grouped': {
              minWidth: '56px',
              height: '48px',
            },
            '& .MuiButtonBase-root.MuiButton-root.icon_button': {
              minWidth: '56px',
              height: '48px',
            },
          },
        },
        {
          props: { size: 'medium' },
          style: {
            '& .MuiButtonGroup-grouped': {
              minWidth: '56px',
              height: '40px',
            },
            '& .MuiButtonBase-root.MuiButton-root.icon_button': {
              minWidth: '56px',
              height: '40px',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            '& .MuiButtonGroup-middleButton': {
              borderColor: actionHover,
            },
            '& .MuiButtonGroup-firstButton.Mui-disabled, & .MuiButtonGroup-middleButton.Mui-disabled':
              {
                borderColor: white,
              },
          },
        },
        {
          props: { variant: 'contained' },
          style: {
            '& .MuiButtonGroup-firstButton, & .MuiButtonGroup-middleButton': {
              borderColor: white,
            },
            '& .MuiButtonGroup-firstButton.Mui-disabled, & .MuiButtonGroup-middleButton.Mui-disabled':
              {
                borderColor: white,
              },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            '& .MuiButtonGroup-middleButton': {},
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover, &.hoverFocus': {
            boxShadow: 'none',
            backgroundColor: actionHover,
          },
        },
      },
      variants: [
        {
          props: { size: 'medium' },
          style: {
            padding: '4px 4px',
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.icon_button .MuiButton-startIcon': {
            marginRight: '0',
            marginLeft: '0',
          },
          '&.icon_button .MuiButton-endIcon': {
            marginRight: '0',
            marginLeft: '0',
          },
        },
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            fontSize: '1rem',
            padding: '4px 16px',
            lineHeight: '1.5rem',
            '&.button_full': {
              width: '100% !important',
            },
            '&.icon_button': {
              padding: '4px 4px',
              minWidth: 'auto',
              width: '32px',
              height: '32px',
            },
          },
        },
        {
          props: { size: 'medium' },
          style: {
            fontSize: '1rem',
            padding: '8px 16px',
            lineHeight: '1.5rem',
            '&.button_full': {
              width: '100% !important',
            },
            '&.icon_button': {
              padding: '8px 8px',
              minWidth: 'auto',
              width: '40px',
              height: '40px',
            },
          },
        },
        {
          props: { size: 'large' },
          style: {
            fontSize: '1rem',
            padding: '12px 16px',
            lineHeight: '1.5rem',
            '&.button_full': {
              width: '100% !important',
            },
            '&.icon_button': {
              padding: '12px 12px',
              minWidth: 'auto',
              width: '48px',
              height: '48px',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            backgroundColor: white,
            borderRadius: 30,
            textTransform: 'initial',
            boxShadow: 'none',
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: `${actionHover} !important`,
              color: `${secondaryMain} !important`,
            },
            '&.hoverFocus.icon_button svg.hoverFocus path': {
              fill: secondaryMain,
            },
            '& .MuiButton-startIcon .hoverFocus path': {
              fill: secondaryMain,
            },
            '& .MuiButton-endIcon .hoverFocus path': {
              fill: secondaryMain,
            },
            '&:hover .MuiButton-startIcon svg.ico path': {
              fill: secondaryMain,
            },
            '&:hover .MuiButton-endIcon svg.ico path': {
              fill: secondaryMain,
            },

            '&:hover:not(:active) .MuiBadge-root > svg.ico path, &:hover:not(:active) > svg.ico path':
              {
                fill: `${secondaryMain} !important`,
              },
            '& .MuiButton-startIcon .hoverFocus.disabled path': {
              fill: textDisabled,
            },
            '&:disabled': {
              backgroundColor: actionBackground,
            },
          },
        },
        {
          props: { variant: 'contained' },
          style: {
            borderRadius: 30,
            textTransform: 'initial',
            boxShadow: 'none',
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: secondaryMain,
            },
            '&:disabled': {
              backgroundColor: actionBackground,
            },
            '& .MuiButton-startIcon svg.ico path': {
              fill: white,
            },
            '& .MuiButton-startIcon svg.ico.disabled path': {
              fill: '#B3B3B3',
            },
            '& .MuiButton-endIcon svg.ico path': {
              fill: white,
            },
            '& .MuiButton-endIcon svg.ico.disabled path': {
              fill: '#B3B3B3',
            },
            '&:hover .MuiButton-startIcon svg.ico path': {
              fill: white,
            },
            '&:hover .MuiButton-endIcon svg.ico path': {
              fill: white,
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderRadius: 30,
            textTransform: 'initial',
            boxShadow: 'none',
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: actionHover,
            },
            '&:disabled': {
              backgroundColor: white,
            },
          },
        },
        {
          props: { variant: 'main_ai' },
          style: {
            borderRadius: 30,
            textTransform: 'initial',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: backgroundPrimary,
              transition: 'opacity 0.3s ease',
              zIndex: -1,
            },
            '&:hover::before': {
              opacity: 0,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: backgroundPrimaryHover,
              transition: 'opacity 0.3s ease',
              zIndex: -2,
              opacity: 0,
            },
            '&:hover::after': {
              opacity: 1,
            },
            '&.hoverFocus.icon_button svg.hoverFocus path': {
              fill: contentMain,
            },
            '& .MuiButton-startIcon .hoverFocus path': {
              fill: contentMain,
            },
            '& .MuiButton-endIcon .hoverFocus path': {
              fill: contentMain,
            },
            '&:hover .MuiButton-startIcon svg.ico path': {
              fill: contentMain,
            },
            '&:hover .MuiButton-endIcon svg.ico path': {
              fill: contentMain,
            },

            '&:hover:not(:active) .MuiBadge-root > svg.ico path, &:hover:not(:active) > svg.ico path':
              {
                fill: `${contentMain} !important`,
              },
            '& .MuiButton-startIcon .hoverFocus.disabled path': {
              fill: textDisabled,
            },
            '&:disabled::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: actionBackground,
              transition: 'opacity 0.3s ease',
              zIndex: -1,
            },
            '&:disabled': {
              background: primaryAi,
            },
            '&:disabled svg path ': {
              fill: textDisabled,
            },
            '& svg path': {
              fill: contentMain,
            },
          },
        },
        {
          props: { variant: 'secondary_ai' },
          style: {
            background: backgroundSecondary,
            borderRadius: 30,
            textTransform: 'initial',
            '& .MuiButton-label': {
              background: 'linear-gradient(45deg, #044EC6, #00C7FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            },
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              // backgroundColor: `${actionHover} !important`,
              color: `${primaryAi} !important`,
            },
            '&.hoverFocus.icon_button svg.hoverFocus path': {
              fill: primaryAi,
            },
            '& .MuiButton-startIcon .hoverFocus path': {
              fill: primaryAi,
            },
            '& .MuiButton-endIcon .hoverFocus path': {
              fill: primaryAi,
            },
            '&:hover .MuiButton-startIcon svg.ico path': {
              fill: primaryAi,
            },
            '&:hover .MuiButton-endIcon svg.ico path': {
              fill: primaryAi,
            },

            '&:hover:not(:active) .MuiBadge-root > svg.ico path, &:hover:not(:active) > svg.ico path':
              {
                fill: `${primaryAi} !important`,
              },
            '& .MuiButton-startIcon .hoverFocus.disabled path': {
              fill: textDisabled,
            },
            '&:disabled': {
              backgroundColor: actionBackground,
            },
          },
        },
        {
          props: { variant: 'agent_ai' },
          style: {
            background: backgroundSecondary,
            borderRadius: 30,
            textTransform: 'initial',
            border: '2px solid transparent',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            backgroundImage: `
              linear-gradient(rgb(237 247 253), rgb(237 247 253)),
              linear-gradient(83deg, var(--AI-1, rgba(4, 78, 198, 0.25)) 0%, var(--AI-2, rgba(0, 199, 255, 0.25)) 100%)
            `,
            '& .MuiBox-root': {
              background: 'linear-gradient(45deg, #044EC6, #00C7FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
            '& .MuiButton-label': {
              background: 'linear-gradient(45deg, #044EC6, #00C7FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            },
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: `${actionHover} !important`,
              color: `${primaryAi} !important`,
              border: '2px solid transparent',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              backgroundImage: `
              linear-gradient(rgb(237 247 253), rgb(237 247 253)),
              ${backgroundPrimaryHover}
            `,
            },
            '&.hoverFocus.icon_button svg.hoverFocus path': {
              fill: primaryAi,
            },
            '& .MuiButton-startIcon .hoverFocus path': {
              fill: primaryAi,
            },
            '& .MuiButton-endIcon .hoverFocus path': {
              fill: primaryAi,
            },
            '&:hover .MuiButton-startIcon svg.ico path': {
              fill: primaryAi,
            },
            '&:hover .MuiButton-endIcon svg.ico path': {
              fill: primaryAi,
            },

            '&:hover:not(:active) .MuiBadge-root > svg.ico path, &:hover:not(:active) > svg.ico path':
              {
                fill: `${primaryAi} !important`,
              },
            '& .MuiButton-startIcon .hoverFocus.disabled path': {
              fill: textDisabled,
            },
            '&:disabled': {
              backgroundColor: actionBackground,
            },
          },
        },
      ],
    },
    MuiAlert: {
      // Alert en mui5 se le aplica una en el background transparencia y en tipo info, no se alcanzaba a percibir
      styleOverrides: {
        standardInfo: {
          background: infoLight,
        },
        icon: {
          color: `${infoMain} !important`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: white,
        },
      },
    },
  },
});

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    chip: true;
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  chip: React.CSSProperties;
}

declare module '@mui/material/styles' {
  interface TypeAction {
    default: string;
    background: string;
  }

  interface TypeBackground {
    accent: string;
  }
}

declare module '@mui/material/styles' {
  interface ShadowDown {
    xs: string;
    sm: string;
    md: string;
  }
  interface ShadowUp {
    xs: string;
    sm: string;
    md: string;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    action: TypeAction;
    background: TypeBackground;
    bi: IBiColorMap;
    ai: {
      primary: string;
      secondary: string;
      backgroundPrimary?: string;
      backgroundSecondary?: string;
      backgroundTertiary?: string;
      boxShadow?: string;
    };
    other: {
      backdrop: string;
      divider: string;
      snackbar: string;
      outline: string;
      rating: string;
      blueBackground: string;
      errorBackground: string;
      warningBackground: string;
      infoBackground: string;
      circleBackground: string;
      successBackground: string;
      backgroundTransparent: string;
    };
    dashboard: {
      sky1: string;
      blue1: string;
      blue2: string;
      green1: string;
      red1: string;
      red2: string;
      aqua1: string;
      yellow1: string;
      brown2: string;
      purple1: string;
      purple2: string;
      gray1: string;
      gray2: string;
    };
    content: {
      main: string;
      primary: string;
      secondary: string;
      status: string;
    };
    backgroundColor: {
      marked: string;
      primary: string;
      hover: string;
      info: string;
      priority: {
        high: string;
        medium: string;
        low: string;
      };
    };
    shadowDown: ShadowDown;
    shadowUp: ShadowUp;
  }

  interface PaletteOptions {
    bi?: IBiColorMap;
    ai?: {
      primary: string;
      secondary: string;
      backgroundPrimary?: string;
      backgroundSecondary?: string;
      backgroundTertiary?: string;
      boxShadow?: string;
    };
    other?: {
      backdrop: string;
      divider: string;
      snackbar: string;
      outline: string;
      rating: string;
      blueBackground: string;
      errorBackground: string;
      warningBackground: string;
      infoBackground: string;
      circleBackground: string;
      successBackground: string;
      backgroundTransparent?: string;
    };
    content?: {
      main: string;
      primary: string;
      secondary: string;
      status: string;
    };
    dashboard: {
      sky1: string;
      blue1: string;
      blue2: string;
      green1: string;
      red1: string;
      red2: string;
      aqua1: string;
      yellow1: string;
      brown2: string;
      purple1: string;
      purple2: string;
      gray1: string;
      gray2: string;
    };
    backgroundColor?: {
      primary: string;
      hover: string;
      marked: string;
      info: string;
      priority: {
        high: string;
        medium: string;
        low: string;
      };
    };
    shadowDown: ShadowDown;
    shadowUp: ShadowUp;
  }
}

export default lightTheme;
