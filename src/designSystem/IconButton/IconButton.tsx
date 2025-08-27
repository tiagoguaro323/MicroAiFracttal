import React from 'react';
import {
  CircularProgress,
  IconButton as IconButtonMui,
  IconButtonProps,
  IconButtonOwnProps,
  useTheme,
} from '@mui/material';
import { Icon } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';
import { CustomTooltip } from 'fracttal-core';

export type LIcon = (typeof temp)[number];

export type IProps = IconButtonProps & {
  className?: string;
  disabled?: IconButtonOwnProps['disabled'];
  icon?: LIcon;
  iconSize?: 'small' | 'medium' | 'large';
  iconColor?: string;
  key?: string;
  loading?: boolean;
  title?: string;
};

const IconButton: React.FC<IProps> = ({
  className,
  disabled,
  icon,
  iconSize,
  key,
  loading = false,
  title,
  iconColor,
  ...props
}) => {
  const theme = useTheme();
  const iconComponent = loading ? (
    <CircularProgress size={20} style={{ marginRight: 10 }} />
  ) : (
    <Icon
      variantName={icon}
      disabled={disabled}
      size={iconSize}
      color={iconColor ?? theme.palette.text.secondary}
    />
  );

  const iconButton = (
    <IconButtonMui className={className} disabled={disabled} {...props}>
      {iconComponent}
    </IconButtonMui>
  );

  return (
    <CustomTooltip key={key} title={title ?? ''}>
      {iconButton}
    </CustomTooltip>
  );
};

export default IconButton;
