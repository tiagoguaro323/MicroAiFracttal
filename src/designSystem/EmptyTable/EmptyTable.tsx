import { Box, Typography, useTheme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import React from 'react';
import clsx from 'clsx';

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

const EmptyTable = React.memo<{ title?: string; height?: number | string }>(
  ({ title = 'NO_DATA', height = 'auto' }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation();
    const urlImage = `/images/icon-table/emptytable-${theme.palette.mode}.svg`;

    return (
      <Box
        className={clsx(classes.paper, 'qa-empty-table')}
        sx={{
          height,
        }}
      >
        <img src={window.location.origin + urlImage} />
        <Typography
          variant="subtitle1"
          style={{ color: theme.palette.text.disabled }}
          align="center"
          sx={{ paddingTop: theme.spacing(1) }}
        >
          {t(title)}
        </Typography>
      </Box>
    );
  },
);

export default EmptyTable;
