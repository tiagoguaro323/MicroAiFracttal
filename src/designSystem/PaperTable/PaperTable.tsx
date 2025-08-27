import React from 'react';
import { Paper, useTheme } from '@mui/material';

export type IProps = {
  className?: string;
  children?: React.ReactNode;
  display?: boolean;
};

const PaperTable: React.FC<IProps> = ({ className, children, display }) => {
  const theme = useTheme();
  return (
    <Paper
      className={className}
      style={{
        display: display ? 'flex' : 'none',
        width: '100%',
        borderRadius: theme.spacing(2),
        boxShadow: 'none',
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperTable;
