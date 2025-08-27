import React from 'react';
import {
  CircularProgress,
  useTheme,
  ButtonProps,
  ButtonOwnProps as ButtonOwnPropsBs,
} from '@mui/material';
import { Icon, ButtonStyle as Button } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';
import { CustomTooltip } from 'fracttal-core';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true;
  }
}

export type LIcon = (typeof temp)[number];

export type IProps = ButtonProps & {
  buttonKey?: string;
  className?: string;
  color?: ButtonOwnPropsBs['color'];
  disabled?: ButtonOwnPropsBs['disabled'];
  endIcon?: LIcon;
  hasTooltip?: boolean;
  icon?: LIcon;
  iconColor?: string;
  iconSize?: 'small' | 'medium' | 'large';
  key?: string;
  loading?: boolean;
  onClick?: any;
  size?: ButtonOwnPropsBs['size'];
  title?: string;
  tooltipContent?: string;
};

const ButtonCore: React.FC<IProps> = ({
  buttonKey,
  className = 'qa-save-btn',
  color = 'primary',
  disabled = false,
  endIcon,
  fullWidth,
  hasTooltip = true,
  icon,
  iconColor,
  iconSize = 'medium',
  key,
  loading = false,
  onClick,
  size = 'medium',
  style,
  title = '',
  tooltipContent,
  variant = 'contained',
  ...props
}) => {
  const theme = useTheme();

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

    return theme.palette.primary.main;
  };

  const button = (
    <Button
      className={className}
      key={buttonKey}
      fullWidth={fullWidth}
      color={color}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      size={size}
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
            size={size}
          />
        ))
      }
      style={style}
      {...props}
    >
      {title}
    </Button>
  );

  return (
    <CustomTooltip
      key={key}
      title={hasTooltip || tooltipContent ? (tooltipContent ?? title) : ''}
    >
      {button}
    </CustomTooltip>
  );
};

export default ButtonCore;
