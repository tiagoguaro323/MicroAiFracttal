import React from 'react';
import { MenuItem as MenuItemMui, MenuItemProps, Theme } from '@mui/material';
import { withStyles } from '@mui/styles';

export type IProps = MenuItemProps & {
  className?: string;
  children?: React.ReactNode;
};

const MenuItemStyled = withStyles((theme: Theme) => ({
  root: {
    borderRadius: 200,
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.secondary.light}0D`,
    },
    '&.Mui-selected .MuiListItemText-primary': {
      color: `${theme.palette.primary.main} !important`,
    },
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.light}0D`,
    },
  },
}))(MenuItemMui);

const MenuItem: React.FC<IProps> = ({ className, children, ...props }) => {
  return (
    <MenuItemStyled className={className} {...props}>
      {children}
    </MenuItemStyled>
  );
};

export default MenuItem;
