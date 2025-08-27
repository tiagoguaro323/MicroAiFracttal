import React, { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Icon, ButtonStyle as Button } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';

export type LIcon = (typeof temp)[number];

interface DropdownProps {
  label: string;
  options: { value: string; label: string; icon: LIcon }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  variant?: 'outlined' | 'contained' | 'text' | 'tonal';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const DropdownMenu: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  variant = 'text',
  size = 'medium',
  disabled,
  className,
  onSelect,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant={variant}
        className={className}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={disabled}
        size={size}
        startIcon={
          <Icon
            className={className}
            variant={variant}
            variantName={
              options.find((option) => option.value === selectedValue)?.icon ||
              'unlink'
            }
            disabled={disabled}
          />
        }
        endIcon={
          <Icon
            className={className}
            variantName="arrow_down"
            variant={variant}
            disabled={disabled}
          />
        }
      >
        {label}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} onClick={() => onSelect(option.value)}>
            <ListItemIcon>
              <Icon variantName={option.icon} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;
