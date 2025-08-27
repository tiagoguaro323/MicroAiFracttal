import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Toolbar as ToolbarMui, ToolbarProps, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

export type IProps = ToolbarProps & {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      minHeight: 'inherit',
      padding: theme.spacing(0, 0.8, 0.8, 0.8),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 0, 1, 0),
      },
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(0, 0, 1, 0),
      },
    },
  }),
);
const PaperTable: React.FC<IProps> = ({ className, children, style }) => {
  const classes = useStyles();
  const Toolbar = classes.toolbar;

  return (
    <ToolbarMui
      disableGutters
      className={`${Toolbar} ${className}`}
      style={style}
    >
      {children}
    </ToolbarMui>
  );
};

export default PaperTable;
