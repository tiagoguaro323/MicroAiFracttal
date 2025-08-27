import React from 'react';
import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

export type IProps = {
  className?: string;
  variant?: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dot: {
      height: '8px',
      width: '8px',
      backgroundColor: theme.palette.action.disabled,
      borderRadius: '50%',
      display: 'inline-block',
    },
    dotSuccess: {
      backgroundColor: theme.palette.success.dark,
    },
    dotError: {
      backgroundColor: theme.palette.error.dark,
    },
  }),
);

const Circle: React.FC<IProps> = ({ className, variant }) => {
  const classes = useStyles();

  return (
    <span
      className={`${classes.dot} ${variant === 'success' ? classes.dotSuccess : classes.dotError} ${className}`}
    />
  );
};

export default Circle;
