/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Radio,
  Collapse,
  Divider,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuList,
  Switch,
  Theme,
  useTheme,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import clsx from 'clsx';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { push } from 'redux-first-history';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMobile } from 'hooks';
import { reset } from 'store';
import themeToggle from 'store/theme/action';
import DB from 'core/services/DB';
import { ButtonIcon, Icon, MenuItem as MenuItemP } from 'designSystem';
import { Capacitor } from '@capacitor/core';
import TopbarButtons from './TopbarButtons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      borderRadius: theme.shape.borderRadius * 2,
      border: 0,
      borderStyle: 'solid',
      borderColor:
        theme.palette.mode === 'dark'
          ? theme.palette.action.hover
          : theme.palette.divider,
      '& .MuiMenu-list': {
        paddingTop: '0 !important',
      },
    },
    profile: {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      transition: 'all 500ms ease',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:hover  .MuiAvatar-root': {
        border: `2px solid transparent`,
      },
    },
    topbarButtonsMenu: {
      padding: theme.spacing(1),
      display: 'flex',
      justifyContent: 'space-evenly',
    },
  }),
);

const ProfileMenu: React.FC<{
  urlImageLoading?: boolean;
  urlImage: string;
  language: any;
  setLanguage: (value: any) => void;
  options: any;
}> = ({
  urlImageLoading = false,
  urlImage,
  language,
  setLanguage,
  options,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMobile();
  const { t, i18n } = useTranslation();
  const {
    account,
    custom_sso: customSSO,
    company,
  } = useSelector((state: any) => state.auth);
  const [openLng, setOpenLng] = useState(false);
  const [menuEl, setMenuEl] = useState(null);
  const [isValidImage, setIsValidImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = urlImage;

    img.onload = () => {
      setIsValidImage(true);
    };

    img.onerror = () => {
      setIsValidImage(false);
    };
  }, [urlImage]);

  const onOpen = useCallback((event: any) => {
    setMenuEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setMenuEl(null);
  }, []);

  const toggleDarkTheme = () => {
    dispatch(themeToggle(theme.palette.mode === 'light' ? 'dark' : 'light'));
    setTimeout(() => onClose(), 1000);
  };

  const onExit = useCallback(async () => {
    // Define si debe realizar logut de saml
    let logoutSaml = false;
    const { logout_url: logoutUrl } = company;
    if (customSSO && logoutUrl && logoutUrl.length > 0) logoutSaml = true;
    onClose();
    DB(
      'companies.account_logout',
      {
        platform: Capacitor.getPlatform(),
      },
      () => {
        // setLoading(false);
        dispatch(reset());

        // Realiza logout de saml
        if (!logoutSaml) {
          dispatch(push('/signin'));
        }
      },
    );
  }, [company, customSSO, dispatch, onClose]);

  const changeLanguage = useCallback(
    (event, index: number) => {
      setOpenLng(false);

      i18n.changeLanguage(options[index].value);
      setLanguage(options[index]);
    },
    [i18n, options, setLanguage],
  );

  const stringAvatar = (name: string) => {
    if (name) {
      const fullname = name.split(' ');
      const firstnameInitial = fullname[0][0] || '';
      const lastnameInitial = fullname.length > 1 ? fullname[1][0] || '' : '0';

      return `${firstnameInitial}${lastnameInitial}`;
    }
    return 'NA';
  };

  const moreButton = useMemo(
    () => (
      <ButtonIcon onClick={onOpen} icon="more_horizontal" variant="tonal" />
    ),
    [onOpen],
  );

  return (
    <>
      {isMobile ? (
        moreButton
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={onOpen}
          className="qa-user-options"
        >
          {!urlImageLoading ? (
            <Avatar
              src={urlImage || ''}
              sx={{
                width: 40,
                height: 40,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.main,
                border: isValidImage
                  ? `1.5px solid ${theme.palette.primary.main}`
                  : '',
              }}
            >
              {!isValidImage && stringAvatar(account.name)}
            </Avatar>
          ) : (
            <CircularProgress size={30} style={{ top: '8px' }} />
          )}
          <Icon variantName="arrow_down" color={theme.palette.primary.main} />
        </Box>
      )}
      <Menu
        anchorEl={menuEl}
        keepMounted
        open={Boolean(menuEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{
          minWidth: 500,
          maxWidth: 500,
        }}
        classes={{
          paper: classes.menu,
        }}
      >
        {isMobile && (
          <>
            <MenuItem
              className={clsx(
                classes.topbarButtonsMenu,
                'qa-user-topbar-buttons-option',
              )}
            >
              <TopbarButtons />
            </MenuItem>
            <Divider style={{ marginTop: 0, marginBottom: 0 }} />
          </>
        )}
        <MenuItem className={clsx(classes.profile, 'qa-user-profile-option')}>
          <ListItemAvatar>
            {!urlImageLoading ? (
              <Avatar
                src={urlImage || ''}
                sx={{
                  width: 48,
                  height: 48,
                  border: `2px solid transparent`,
                  backgroundColor: `${theme.palette.primary.main}`,
                }}
              >
                {!isValidImage && stringAvatar(account.name)}
              </Avatar>
            ) : (
              <CircularProgress size={30} style={{ top: '8px' }} />
            )}
          </ListItemAvatar>
          <Box sx={{ marginRight: '10px' }}>
            <ListItemText
              primary={account.name}
              primaryTypographyProps={{
                variant: 'subtitle1',
                style: {
                  color: `${theme.palette.text.primary}`,
                  lineHeight: '1.5',
                  maxWidth: '185px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              }}
            />
            <ListItemText
              primary={account.email}
              primaryTypographyProps={{
                variant: 'subtitle1',
                style: {
                  color: `${theme.palette.text.secondary}`,
                  lineHeight: '1.5',
                  maxWidth: '185px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              }}
              secondary={company.description}
              secondaryTypographyProps={{
                variant: 'subtitle1',
                style: {
                  color: `${theme.palette.text.secondary}`,
                  lineHeight: '1.5',
                  maxWidth: '185px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              }}
            />
          </Box>
        </MenuItem>
        <Divider style={{ marginTop: 0 }} />
        <Box sx={{ padding: `0 ${theme.spacing(1)} ${theme.spacing(1)}` }}>
          <MenuItemP
            className="qa-user-profile-languages"
            onClick={() => setOpenLng(!openLng)}
          >
            <ListItemText
              primaryTypographyProps={{
                variant: 'subtitle1',
                style: {
                  color: `${theme.palette.text.secondary}`,
                },
              }}
              primary={t('LENGUAGE')}
            />
            <Icon
              variantName={openLng ? 'arrow_up' : 'arrow_down'}
              color={theme.palette.text.secondary}
              size="medium"
            />
          </MenuItemP>
          <Collapse in={openLng} timeout="auto" unmountOnExit>
            <MenuList
              style={{
                marginLeft: `${theme.spacing(2)}`,
                paddingLeft: `${theme.spacing(1)}`,
                borderLeft: `2px solid ${theme.palette.divider}`,
              }}
            >
              {options.map((opt: any, index: number) => (
                <MenuItemP
                  className="qa-option-language"
                  key={opt.description}
                  onClick={(e) => changeLanguage(e, index)}
                >
                  <ListItemIcon>
                    <Icon
                      variantName={opt.value.replace(/-/g, '')}
                      color="transparent"
                      size="medium"
                    />
                  </ListItemIcon>
                  <ListItemIcon>
                    <Radio
                      edge="start"
                      checked={language.description === opt.description}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: 'subtitle1',
                      style: {
                        color: `${theme.palette.text.secondary}`,
                      },
                    }}
                    primary={opt.description}
                  />
                </MenuItemP>
              ))}
            </MenuList>
          </Collapse>
          <MenuItemP
            className="qa-user-profile-dark-mode"
            onClick={toggleDarkTheme}
          >
            <ListItemText
              primaryTypographyProps={{
                variant: 'subtitle1',
                style: {
                  color: `${theme.palette.text.secondary}`,
                },
              }}
              primary={t('DARK_MODE')}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={theme.palette.mode !== 'light'}
                onChange={toggleDarkTheme}
              />
            </ListItemSecondaryAction>
          </MenuItemP>
        </Box>
        <Divider />
        <Box
          sx={{
            width: '100%',
            padding: `${theme.spacing(1)} ${theme.spacing(1)} 0`,
          }}
        >
          <MenuItemP className="qa-user-profile-logout" onClick={onExit}>
            <ListItemIcon>
              <Icon variantName="logout" size="medium" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                variant: 'subtitle1',
                style: {
                  color: `${theme.palette.text.secondary}`,
                },
              }}
              primary={t('LOG_OUT')}
            />
          </MenuItemP>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
