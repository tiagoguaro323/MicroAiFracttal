import { Theme, createTheme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import base, { dark } from './custom/scroll';
import { bi, IBiColorMap, biDark } from './custom/bi';

// Ai
const primaryAi = 'url(#gradient2)';
const secondaryAi =
  'linear-gradient(90deg, var(--Fracttal-Fracttal-AI-AI-Gradient-A, rgba(70, 135, 241, 0.05)) 0%, var(--Fracttal-Fracttal-AI-AI-Gradient-B, rgba(136, 0, 194, 0.05)) 100%)';
const backgroundPrimary =
  'linear-gradient(70deg, var(--AI-1, #007AFF) 25%, var(--AI-2, #00E4FF) 90%)';
const backgroundPrimaryHover =
  'linear-gradient(45deg, var(--AI-1, rgba(4, 78, 198, 0.80)) 25%, var(--AI-2, rgba(0, 199, 255, 0.80)) 90%)';
const backgroundSecondary =
  'linear-gradient(45deg, var(--AI-1, rgba(0, 122, 255, 0.07)) 25%, var(--AI-2, rgba(0, 228, 255, 0.07)) 90%)';
const backgroundTertiary =
  'linear-gradient(89deg, var(--AI-1, rgba(0, 122, 255, 0.07)) 25%, var(--AI-2, rgba(0, 228, 255, 0.07)) 90%)';
const boxShadow = '0px 0px 25px 0px rgba(0, 87, 229, 0.30)';

// Primary
const primaryMain = '#92BBFF';
const primaryLight = '#E5EFFF';
const primaryDark = '#5A7FBD';

// Secondary
const secondaryMain = '#AFCDFF';
const secondaryLight = '#CFE1FF';
const secondaryDark = '#76A7F8';

// Text
const textPrimary = '#FFFFFF';
const textSecondary = '#ABACAE';
const textDisabled = '#6B6D71';

// Action
const actionDefault = '#ABACAE';
const actionHover = '#92BBFF1A';
const actionActive = '#BFC0C2';
const actionDisabled = '#56595D';
const actionBackground = '#FFFFFF08';

// Other
const otherBackdrop = '#00000066';
const otherDivider = '#414348';
const otherSnackbar = '#E0E0E1';
const otherOutline = '#4B4E52';
const otherRating = '#FEB436';
const otherBlueBackground = '#333A47';
const circleBackground = '#ffffff80';
const backgroundTransparent = 'transparent';

// Error status
const errorMain = '#EF9A9A';
const errorLight = '#FDB7B7';
const errorDark = '#A16F71';
const errorBackground = '#343338';

// Warning status
const warningMain = '#FFE082';
const warningLight = '#FFEBB0';
const warningDark = '#BFAB6B';
const warningBackground = '#41403C';

// Info status
const infoMain = '#92BBFF';
const infoLight = '#B8D3FF';
const infoDark = '#5A7FBD';
const infoBackground = '#333A47';

// Success status
const successMain = '#A2FF9A';
const successLight = '#BDFFB7';
const successDark = '#73AC71';
const successBackground = '#38433E';

// Content
const contentMain = '#000000';
const contentPrimary = '#000000';
const contentSecondary = '#000000';
const contentStatus = '#FFFFFF';

// Background
const backgroundSurface = '#2C2F34';
const backgroundBackground = '#1F2124';
const backgroundAccent = '#161719';

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

const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
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
      circleBackground,
      blueBackground: otherBlueBackground,
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
      disabled: biDark.disabled,
      general: {
        ...bi.general,
        ...biDark.general,
      },
    },
    backgroundColor: {
      primary: '#FFFFFF1A',
      hover: '#FFFFFF33',
      marked: '#ffe0820d',
      info: '#ffffff0d',
      priority: {
        high: '#ef9a9a0d',
        medium: '#ffe0820d',
        low: '#a2ff9a0d',
      },
    },
    shadowDown: {
      xs: '0px 3px 4px 0px rgba(0, 0, 0, 0.10)',
      sm: '0px 3px 8px 0px rgba(0, 0, 0, 0.22)',
      md: '0px 3px 8px 0px rgba(0, 0, 0, 0.30)',
    },
    shadowUp: {
      xs: '0px -3px 4px 0px rgba(0, 0, 0, 0.10)',
      sm: '0px -3px 8px 0px rgba(0, 0, 0, 0.22)',
      md: '0px -3px 8px 0px rgba(0, 0, 0, 0.30)',
    },
  },
  typography: {
    fontFamily: 'Heebo ,Arial',
    fontSize: 12,
    manrope: {
      fontFamily: 'Manrope, Arial',
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
    borderRadius: 4,
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
      styleOverrides: { ...base, ...dark },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '8px 9px',
          '&:hover > svg.ico path': {
            stroke: white,
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
                borderColor: actionHover,
              },
          },
        },
        {
          props: { variant: 'contained' },
          style: {
            '& .MuiButtonGroup-firstButton, & .MuiButtonGroup-middleButton': {
              borderColor: black,
            },
            '& .MuiButtonGroup-firstButton.Mui-disabled, & .MuiButtonGroup-middleButton.Mui-disabled':
              {
                borderColor: black,
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
            backgroundColor: '#2C2F34',
            borderRadius: 30,
            textTransform: 'initial',
            boxShadow: 'none',
            color: infoMain,
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: actionHover,
              color: infoMain,
            },
            '.MuiBadge-root > svg path, svg.ico path': {
              fill: infoMain,
            },
            '&:hover .MuiBadge-root > svg path, &:hover > svg.ico path': {
              fill: infoMain,
            },
            '& .MuiButton-startIcon .hoverFocus.disabled path': {
              fill: textDisabled,
            },
            '&:active .MuiButton-startIcon svg.ico path': {
              fill: secondaryDark,
            },
            '&:active ': {
              backgroundColor: '#C0D7FF1A',
              color: secondaryDark,
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
            backgroundColor: infoMain,
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: secondaryMain,
            },
            '&:disabled': {
              backgroundColor: actionBackground,
            },
            '&:active ': {
              backgroundColor: secondaryDark,
            },
            '& .MuiButton-startIcon svg.ico path': {
              fill: black,
            },
            '& .MuiButton-startIcon svg.ico.disabled path': {
              fill: '#6B6D71',
            },
            '& .MuiButton-endIcon svg.ico path': {
              fill: black,
            },
            '& .MuiButton-endIcon svg.ico.disabled path': {
              fill: '#6B6D71',
            },
            '&:hover .MuiButton-startIcon svg.ico path': {
              fill: black,
            },
            '&:hover .MuiButton-endIcon svg.ico path': {
              fill: black,
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
            boxShadow: 'none',
            '&:hover, &.hoverFocus': {
              boxShadow: 'none',
              backgroundColor: `${actionHover} !important`,
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
            '&&& svg path': {
              fill: primaryAi,
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
              linear-gradient(#2b363e, #2b363e),
              linear-gradient(83deg, var(--AI-1, rgba(0, 122, 255, 0.25)) 0%, var(--AI-2, rgba(0, 228, 255, 0.25)) 100%)
            `,
            '& .MuiBox-root': {
              background:
                'linear-gradient(263deg, var(--AI-1, #007AFF) 0%, var(--AI-2, #00E4FF) 100%)',
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
              linear-gradient(#2b363e, #2b363e),
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
    MuiDialog: {
      defaultProps: {
        // The props to change the default for.
        PaperProps: { elevation: 0 },
      },
    },
    MuiPaper: {
      defaultProps: {
        // The props to change the default for.
        elevation: 0,
      },
    },
    MuiPopover: {
      defaultProps: {
        // The props to change the default for.
        elevation: 1,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: black,
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
  interface TypeAction {
    background: string;
  }

  interface TypeBackground {
    accent: string;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    action: TypeAction;
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
    content: {
      main: string;
      primary: string;
      secondary: string;
      status: string;
    };
    backgroundColor: {
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

export default darkTheme;
