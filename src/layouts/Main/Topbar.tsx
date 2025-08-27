import React, { memo, useEffect, useState } from 'react';
import { Divider, Theme, Toolbar, Typography, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import { useSelector } from 'react-redux';
import JWT from 'core/services/JWT';
import { useDbNew, useLanguageCode, useMobile } from 'hooks';
import { v4 as uuidv4 } from 'uuid';
import LanguageOptions from 'constants/LanguageOptions';
import FracttalAI from 'layouts/FracttalAI/FracttalAI';
import { useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

const options = LanguageOptions;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: '100%',
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    grow: {
      flexGrow: 1,
    },
    button: {
      '&:hover': {
        backgroundColor: theme.palette.backgroundColor.hover,
      },
      marginLeft: theme.spacing(1),
    },
    chip: {
      '&:hover': {
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.text.primary
            : theme.palette.background.paper,
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : theme.palette.primary.main,
      },
    },
    boxFlex: {
      display: 'flex',
      gap: `${theme.spacing(1)}`,
      justifyContent: 'center',
    },
  }),
);

const Topbar = memo(() => {
  const currentConversationID = useSelector(
    (state: any) => state.currentConversationID.id,
  );
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const lng = useLanguageCode();
  const [urlImage, setUrlImage] = useState('');
  const { account } = useSelector((state: any) => state.auth);
  const [openFracttalAI, setOpenFracttalAI] = useState(false);
  const conversationID = React.useMemo(
    () => currentConversationID || uuidv4(),
    [currentConversationID],
  );
  const isMobile = useMobile();

  const [dataImageUrl, getImageUrl] = useDbNew({
    fnc: 'companies.s3_object_get',
    autoExec: false,
  });

  const [language, setLanguage] = useState<any>(() => {
    const index = options.findIndex((item) => item.value === lng);
    if (index && index > -1) {
      return options[index];
    }
    return options[0];
  });

  useEffect(() => {
    if (JWT.loggedIn()) {
      getImageUrl({
        name: account.image,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.image]);

  useEffect(() => {
    if (dataImageUrl?.data?.[0]?.url) setUrlImage(dataImageUrl.data[0].url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImageUrl?.data?.[0]?.url]);

  return (
    <AppBar
      className={classes.appBar}
      elevation={0}
      color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
    >
      <Toolbar>
        <Typography color={theme.palette.text.primary}>R E M O T E</Typography>

        <div className={classes.grow} />
        <div className={classes.boxFlex}>
          {isMobile && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {location.pathname !== '/ai' && (
                <FracttalAI
                  agentType="GENERAL"
                  open={openFracttalAI}
                  handleOpenAI={setOpenFracttalAI}
                  conversationID={conversationID}
                  contextType="list"
                  hasTitle={false}
                />
              )}
            </>
          )}
        </div>
        <Divider
          sx={{
            marginX: '8px',
            borderRightWidth: '1.5px',
            marginTop: '12px',
            height: '40px',
          }}
          orientation="vertical"
          variant="middle"
          flexItem
          textAlign="center"
        />
        <ProfileMenu
          urlImageLoading={dataImageUrl.loading}
          urlImage={urlImage}
          language={language}
          setLanguage={setLanguage}
          options={options}
        />
      </Toolbar>
    </AppBar>
  );
});

export default Topbar;
