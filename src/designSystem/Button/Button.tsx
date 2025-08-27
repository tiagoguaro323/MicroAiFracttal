import React from 'react';
import {
  Breakpoint,
  ButtonProps,
  ButtonOwnProps,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import { Icon, ButtonStyle as ButtonMui } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';
import { CustomTooltip } from 'designSystem/CustomTooltip';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true;
  }
}

export type LIcon = (typeof temp)[number];

export type IProps = ButtonProps & {
  breakpoint?: number | Breakpoint;
  className?: string;
  endIcon?: LIcon;
  hastitle?: boolean;
  hasTooltip?: boolean;
  icon?: LIcon;
  iconColor?: string;
  iconSize?: 'small' | 'medium' | 'large';
  isMobile?: boolean;
  key?: number | string;
  loading?: boolean;
  onClick?: ButtonOwnProps['classes'];
  sx?: ButtonOwnProps['sx'];
  title?: string;
  tooltipContent?: string;
  fullWidth?: ButtonProps['fullWidth'];
};

const Button: React.FC<IProps> = ({
  breakpoint = 'md',
  className,
  color = 'primary',
  disabled = false,
  endIcon,
  hastitle = true,
  hasTooltip = true,
  icon,
  iconColor,
  iconSize = 'medium',
  isMobile = false,
  key = 1,
  loading = false,
  onClick,
  size = 'medium',
  sx,
  title = '',
  tooltipContent,
  variant = 'contained',
  fullWidth,
  ...props
}) => {
  const theme = useTheme();
  const isMobileButton = useMediaQuery(theme.breakpoints.down(breakpoint));

  // eslint-disable-next-line no-nested-ternary
  const renderTitle =
    (isMobile && !isMobileButton) || (!isMobile && hastitle && title !== null)
      ? title
      : null;

  const getColor = (variant, iconColor, theme) => {
    if (iconColor !== undefined) {
      return iconColor;
    }

    if (variant === 'contained') {
      return theme.palette.content.main;
    }

    if (variant === 'text' || variant === 'outlined' || variant === 'tonal') {
      return theme.palette.primary.main;
    }

    if (variant === 'secondary_ai') {
      return theme.palette.ai.secondary;
    }

    return theme.palette.primary.main;
  };

  return (
    <CustomTooltip
      key={key}
      title={hasTooltip || tooltipContent ? (tooltipContent ?? title) : ''}
    >
      <ButtonMui
        className={`${className} ${
          (isMobile && isMobileButton) || !hastitle ? 'icon_button' : ''
        } ${fullWidth ? 'button_full' : ''}`}
        key={key}
        color={color}
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        size={size}
        sx={{
          ...sx,
        }}
        startIcon={
          icon &&
          (loading ? (
            <CircularProgress size={20} style={{ marginRight: 10 }} />
          ) : (
            <Icon
              className={className}
              variantName={icon}
              disabled={disabled}
              color={getColor(variant, iconColor, theme)}
              size={iconSize}
            />
          ))
        }
        endIcon={
          endIcon &&
          (loading ? (
            <CircularProgress size={20} style={{ marginRight: 10 }} />
          ) : (
            <Icon
              className={className}
              variantName={endIcon}
              disabled={disabled}
              color={getColor(variant, iconColor, theme)}
              size={iconSize}
            />
          ))
        }
        {...props}
      >
        <Box>{renderTitle}</Box>
      </ButtonMui>
    </CustomTooltip>
  );
};

export default Button;
