import React, { useState, useEffect } from 'react';
import { Dialog, DialogProps } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

export type DialogGradientProps = DialogProps & {
  colors?: string[];
  type?: 'linear' | 'radial';
  className?: string;
  children?: React.ReactNode;
};

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '0 !important',
    },
  }),
);

const DialogGradient: React.FC<DialogGradientProps> = ({
  colors,
  type,
  children,
  ...props
}) => {
  const classes = useStyles();
  const [gradient, setGradient] = useState<string>('');

  useEffect(() => {
    if (colors && type) {
      setGradient(createGradient(colors[0], colors[1], type));
    }
  }, [colors, type]);

  return (
    <Dialog
      fullScreen
      PaperProps={{ className: classes.paper, elevation: 0 }}
      sx={{
        background: gradient,
        // Puedes añadir otros estilos según sea necesario
        '& .MuiPaper-root': {
          background: gradient,
        },
      }}
      {...props}
    >
      {children}
    </Dialog>
  );
};

const createGradient = (
  color1: string,
  color2: string,
  type: 'linear' | 'radial',
): string => {
  if (type === 'linear') {
    return `linear-gradient(to right, ${color1}, ${color2})`;
  }
  if (type === 'radial') {
    return `radial-gradient(circle, ${color1} 50%, ${color2}) 90%`;
  }
  return '';
};

export default DialogGradient;
