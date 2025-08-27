import { Box, Typography, useTheme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  }),
);

const EmptyChart = React.memo<{ title?: string; height?: number | string }>(
  ({ title = 'NO_DATA', height = 'auto' }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation();
    const urlImage = `/images/icon-chart/emptychart-${theme.palette.mode}.svg`;

    return (
      <Box
        className={classes.paper}
        sx={{
          height,
        }}
      >
        <img src={window.location.origin + urlImage} />
        <Typography
          variant="subtitle1"
          style={{ color: theme.palette.text.disabled }}
          align="center"
        >
          {t(title)}
        </Typography>
      </Box>
    );
  },
);

export default EmptyChart;
