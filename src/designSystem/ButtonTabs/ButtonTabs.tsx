import React from 'react';
import {
  Breakpoint,
  ButtonGroup,
  ButtonGroupProps,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Button } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';

export type LIcon = (typeof temp)[number];

interface OptionsProps {
  value: any;
  icon?: LIcon;
  label: string | undefined;
}
export type IProps = ButtonGroupProps & {
  method: number;
  onSelect: (value: string) => void;
  options: OptionsProps[];
  breakpoint?: number | Breakpoint;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'contained' | 'text' | 'tonal';
  disabled?: boolean;
  className?: string;
};

const ButtonTabs: React.FC<IProps> = ({
  method,
  options,
  breakpoint = 'md',
  variant = 'text',
  size = 'medium',
  className,
  disabled,
  onSelect,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));

  return (
    <ButtonGroup
      size={size}
      disableElevation
      variant={variant}
      aria-label="large button group"
      className={className}
      disabled={disabled}
      {...props}
    >
      {options.map((option) => {
        return (
          <Button
            key={option.value}
            size={size}
            className={method === option.value ? 'hoverFocus' : ''}
            variant={method === option.value ? variant : variant}
            color={method === option.value ? 'primary' : 'primary'}
            hastitle={option.label !== undefined}
            isMobile={option.icon !== undefined}
            title={option.label === undefined && isMobile ? '' : option.label}
            onClick={() => onSelect(option.value)}
            icon={option.icon}
            disabled={disabled}
          />
        );
      })}
    </ButtonGroup>
  );
};

export default ButtonTabs;
