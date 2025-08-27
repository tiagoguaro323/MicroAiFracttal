import withStyles from '@mui/styles/withStyles';

const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    '.MuiAppBar-positionFixed': {
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    },
    '.MuiDrawer-paper': {
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    },
    '.MuiDrawer-paperAnchorLeft': {
      paddingLeft: 'env(safe-area-inset-left)',
    },
    '.MuiDialog-paperFullScreen': {
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    },
    '.MuiSelect-select': {
      display: 'flex',
      verticalAlign: 'middle',
    },
  },
})(() => null);

export default GlobalCss;
