import React from 'react';
import {
  Button as ButtonMui,
  ButtonProps,
  Theme,
  useTheme,
} from '@mui/material';
// eslint-disable-next-line import/no-unresolved
import { OverridableStringUnion } from '@mui/types';

export type MyButtonVariant = OverridableStringUnion<
  'text' | 'outlined' | 'contained' | 'tonal' | 'ai'
>;

export type IProps = ButtonProps & {
  className?: string;
  variant?: ButtonProps['variant'] | MyButtonVariant;
  toolbar?: boolean;
};

const ButtonStyle: React.FC<IProps> = ({
  className,
  variant = 'text',
  toolbar,
  children,
  ...props
}) => {
  const theme = useTheme<Theme>();

  return (
    <ButtonMui
      className={className}
      variant={variant === 'tonal' ? undefined : variant}
      sx={{
        ...(variant === 'tonal' && {
          backgroundColor: theme.palette.action.hover,
          transition: 'all 0.3s ease-in-out',
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.background,
          },
          '&.MuiButton-root.hoverFocus': {
            backgroundColor: `${theme.palette.action.hover} !important`,
            color: theme.palette.secondary.main,
          },
          '&.MuiButton-root.hoverFocus .MuiBadge-root > svg.ico path, &:hover .MuiBadge-root > svg.ico path, &:hover > svg.ico path':
            {
              fill: theme.palette.secondary.main,
            },
          '&.MuiButton-root.hoverFocus .MuiButton-startIcon svg.ico path, &:hover .MuiButton-startIcon svg.ico path':
            {
              fill: theme.palette.secondary.main,
            },
          '&.MuiButton-root.hoverFocus .MuiButton-endIcon svg.ico path, &:hover .MuiButton-endIcon svg.ico path':
            {
              fill: theme.palette.secondary.main,
            },
          '&.hoverFocus.icon_button svg.hoverFocus path': {
            fill: theme.palette.secondary.main,
          },
          '&:hover, &:hover .hoverFocus, &.Mui-focusVisible': {
            backgroundColor: `${theme.palette.action.hover} !important`,
            color: theme.palette.secondary.main,
          },
        }),
        ...(toolbar &&
          variant === 'tonal' && {
            backgroundColor: 'transparent !important',
            '&:hover, &:hover .hoverFocus, &.Mui-focusVisible': {
              backgroundColor: `${theme.palette.content.main} !important`,
              color: theme.palette.secondary.main,
            },
          }),
        ...(toolbar && {
          '&:active': {
            backgroundColor: `${theme.palette.primary.main} !important`,
          },
          '&:active .MuiBadge-root > svg path, &:active > svg path': {
            fill: theme.palette.content.primary,
          },
        }),
      }}
      {...props}
    >
      {children}
    </ButtonMui>
  );
};

export default ButtonStyle;
