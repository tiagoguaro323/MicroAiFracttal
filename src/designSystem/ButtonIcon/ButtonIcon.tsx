import React, { ReactNode } from 'react';
import {
  Badge,
  BadgeOwnProps,
  CircularProgress,
  ButtonProps,
  ButtonOwnProps,
  useTheme,
} from '@mui/material';
import { Icon, ButtonStyle as Button } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';
import { CustomTooltip } from 'designSystem/CustomTooltip';

export type LIcon = (typeof temp)[number];
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true;
    main_ai: true;
    secondary_ai: true;
    agent_ai: true;
  }
}

export type IProps = ButtonProps & {
  variant?: ButtonProps['variant'];
  action?: ReactNode;
  badgeColor?: BadgeOwnProps['color'];
  badgeContent?: BadgeOwnProps['badgeContent'];
  badgeInvisible?: BadgeOwnProps['invisible'];
  badgeMax?: BadgeOwnProps['max'];
  badgeVariant?: BadgeOwnProps['variant'];
  className?: string;
  color?: ButtonOwnProps['color'] | 'main_ai' | 'secondary_ai';
  iconColor?: string;
  disabled?: ButtonOwnProps['disabled'];
  hasBadget?: boolean;
  icon?: LIcon;
  iconSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  key?: string;
  loading?: boolean;
  onClick?: any;
  size?: ButtonOwnProps['size'];
  title?: string;
  toolbar?: boolean;
};

const ButtonIcon: React.FC<IProps> = ({
  action,
  badgeColor = 'secondary',
  badgeContent,
  badgeInvisible,
  badgeMax,
  badgeVariant = 'dot',
  className,
  iconColor,
  disabled = false,
  hasBadget = false,
  icon,
  iconSize = 'medium',
  key,
  loading = false,
  onClick,
  size = 'medium',
  style,
  title = '',
  variant = 'text',
  toolbar = false,
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

  const iconComponent = loading ? (
    <CircularProgress size={20} style={{ marginRight: 10 }} />
  ) : (
    <Icon
      variantName={icon}
      disabled={disabled}
      size={iconSize}
      variant={variant}
      color={getColor(variant, iconColor, theme)}
    />
  );

  const iconButton = (
    <Button
      className={`${className} icon_button`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      size={size}
      variant={variant}
      toolbar={toolbar}
      {...props}
    >
      {
        // eslint-disable-next-line no-nested-ternary
        action ||
          (badgeContent || hasBadget ? (
            <Badge
              badgeContent={badgeContent}
              color={badgeColor}
              invisible={badgeInvisible}
              variant={badgeVariant}
              max={badgeMax}
            >
              {iconComponent}
            </Badge>
          ) : (
            iconComponent
          ))
      }
    </Button>
  );

  return (
    <CustomTooltip key={key} title={title ?? ''}>
      {iconButton}
    </CustomTooltip>
  );
};

export default ButtonIcon;
