import React from 'react';
import { Theme, Box, CssBaseline, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      display: 'flex',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(2),
      },
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1),
      },
    },
  }),
);

const Main = React.memo(() => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <Box
        className={`qa-main theme-${theme.palette.mode}`}
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Topbar />
        <div className={classes.toolbar} />
        <main className={classes.content}>
          <Outlet />
        </main>
      </Box>
    </>
  );
});

export default Main;
