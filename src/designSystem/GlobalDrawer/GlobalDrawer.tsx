import React, { useCallback, useState } from 'react';
import {
  Theme,
  Drawer,
  Box,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { DialogConfirm } from 'ui/Dialog';
import useNative from 'hooks/useNative';
import { ButtonIcon } from 'ui/designSystem';

const styles = makeStyles((theme: Theme) => ({
  drawerPaper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      minWidth: 500,
      width: 500,
    },
  },
  content: {
    '& > *': {
      display: 'block',
    },
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.appBar,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingLeft: `16px !important`,
    paddingRight: `16px !important`,
  },
  actions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.appBar,
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));

interface IProps {
  className?: any;
  openDrawer: boolean;
  setOpenDrawer: any;
  title?: string;
  fontSize?: number | string;
  tools?: any;
  content: any;
  actions?: any;
  keepMounted?: boolean;
  disabledPadding?: boolean;
  confirmOnClose?: boolean;
  msgConfirm?: string;
  styleDrawer?: any;
  classNameTour?: string;
}

const GlobalDrawer = React.memo<IProps>(
  ({
    className,
    openDrawer,
    setOpenDrawer,
    title,
    fontSize = 'subtitle1',
    tools,
    content,
    actions,
    keepMounted = false,
    disabledPadding = false,
    confirmOnClose = false,
    msgConfirm = '',
    styleDrawer,
    classNameTour,
  }) => {
    const classes = styles();
    const [openDialog, setOpenDialog] = useState(false);
    const isNative = useNative();

    const onClose = useCallback(() => {
      if (confirmOnClose) {
        setOpenDialog(true);
      } else {
        setOpenDrawer(false);
      }
    }, [confirmOnClose, setOpenDrawer]);

    const handleYes = useCallback(() => {
      setOpenDrawer(false);
    }, [setOpenDrawer]);

    return (
      <Drawer
        disableEnforceFocus
        anchor="right"
        open={openDrawer}
        onClose={onClose}
        transitionDuration={isNative ? 0 : 100}
        PaperProps={{
          className: clsx('qa-drawer', styleDrawer || classes.drawerPaper),
          elevation: 0,
        }}
        keepMounted={keepMounted}
      >
        <DialogConfirm
          openDialogConfirm={openDialog}
          handleClose={() => setOpenDialog(false)}
          handleYes={handleYes}
          msg={msgConfirm}
        />
        <Toolbar className={classes.header}>
          <ButtonIcon
            className={clsx(classNameTour, 'qa-btn-back-drawer')}
            onClick={onClose}
            icon="full_arrow_left"
            color="secondary"
          />
          <Box component="div" pl={0.5} maxWidth="70%">
            <Typography
              ml={1}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              variant="subtitle1"
              component="h2"
            >
              {title || ''}
            </Typography>
          </Box>
          <div style={{ flexGrow: 1 }} />
          {tools}
        </Toolbar>
        <Box
          className={clsx(classes.content, className)}
          display="flex"
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
          flexBasis="auto"
          overflow="auto"
          padding={disabledPadding ? 0 : 2}
        >
          {content}
        </Box>
        {actions && <Box className={classes.actions}>{actions}</Box>}
      </Drawer>
    );
  },
);

export default GlobalDrawer;
