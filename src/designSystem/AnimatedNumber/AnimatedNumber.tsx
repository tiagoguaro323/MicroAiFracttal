import { Typography, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import cx from 'clsx';
import { useMobile } from 'fracttal-core';

export type IProps = {
  value: number;
  noIcon?: boolean;
  loading?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    textAnimate: {
      animation: '$parpadeo 1s ease-in-out infinite', // Referencia a la animación
      color: theme.palette.action.disabled,
    },
    '@keyframes parpadeo': {
      // Definición de la animación
      '0%': { opacity: 1.0 },
      '50%': { opacity: 0.3 },
      '100%': { opacity: 1.0 },
    },
  }),
);

const AnimatedNumber: React.FC<IProps> = ({
  value,
  noIcon,
  loading = false,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [animation, setAnimation] = useState(true);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!loading) {
      const timerId = setTimeout(() => {
        setAnimation(false);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [value, loading]);

  const isMobile = useMobile();

  const getNoIconFontSize = useCallback(
    () =>
      `${isMobile ? theme.typography.pxToRem(40) : theme.typography.pxToRem(60)}`,
    [isMobile, theme.typography],
  );

  return (
    <Typography
      className={cx(classes.text, animation ? classes.textAnimate : null)}
      style={{
        marginTop: isMobile ? '15px' : '20px',
        fontSize: `${
          noIcon ? getNoIconFontSize() : `${theme.typography.pxToRem(47)}`
        }`,
      }}
    >
      {value}
    </Typography>
  );
};

export default AnimatedNumber;
