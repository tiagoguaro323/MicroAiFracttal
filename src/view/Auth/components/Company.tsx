/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  ListItemText,
  Select,
  Switch,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { push, replace } from 'redux-first-history';
import { ButtonIcon, MenuItem } from 'designSystem';
import Util from 'core/helpers/Util';

interface IProps {
  companies: any;
  company: any;
  companyHelpText: string;
  indexCompanies: any;
  show: boolean;
  loginSSO: boolean;
  blockedUser: boolean;
  hasFingerprint: boolean;
  oauthRedirect?: string | undefined | null;
  onBack?: () => void;
  onSelectChange?: (index: any) => void;
  onSendLogin: (value: any, onSuccess?: (data: any) => void) => void;
  remember: boolean;
  setRemember: (value: any) => void;
  onRememberUser: (value: any) => void;
}

const Company: FC<IProps> = ({
  companies,
  company,
  companyHelpText,
  indexCompanies,
  show,
  loginSSO,
  blockedUser,
  hasFingerprint,
  oauthRedirect,
  onBack,
  onSelectChange,
  onSendLogin,
  remember,
  setRemember,
  onRememberUser,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const auth = useSelector((state: any) => state.auth);
  const dispatch: any = useDispatch();

  const isFingerprint = useMemo(
    () => hasFingerprint && (company?.password ?? '').length > 6,
    [company, hasFingerprint],
  );

  const onSignIn = useCallback(() => {
    if (loginSSO) {
      onSendLogin({ loginSSO });
    } else if (auth.email !== '' && auth.password !== '') {
      const elem: any = document?.activeElement;
      if (elem) elem.blur();
      let pwd = '';
      if (isFingerprint) {
        pwd = company.password;
      } else {
        pwd = Util.encryptPassword({
          email: auth.email,
          password: auth.password,
        });
      }

      const objPsw = {
        email: auth.email,
        password: pwd,
        id_company: company.id_company,
        id_server: company.id_server,
      };
      onSendLogin(objPsw, (data: any) => {
        if (oauthRedirect) {
          dispatch(replace(`/accessgrant?oauthredirect=${oauthRedirect}`));
        } else {
          dispatch(push(`/${data.account.home_route.replace('.', '/') || ''}`));
        }
        if (remember) {
          onRememberUser(objPsw);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    auth.email,
    auth.password,
    company.id_company,
    company.id_server,
    company.password,
    dispatch,
    isFingerprint,
    loginSSO,
    oauthRedirect,
    remember,
  ]);

  const CompanyRender = useMemo(
    () => (
      <Select
        sx={{ mb: theme.spacing(3) }}
        fullWidth
        className="qa-txt-company"
        label={t('COMPANY')}
        value={indexCompanies}
        onChange={({ target }) =>
          onSelectChange && onSelectChange(target.value)
        }
        disabled={companies.length <= 1}
        error={company.blocked_by_failure_intents}
        data-cy="company-selector"
      >
        {companies.map((option: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem className="qa-menu-company" key={index} value={index}>
            <ListItemText
              primary={`${
                i18n.exists(option.id_server) ? t(option.id_server) : ''
              } ${option.description}`}
              // secondary={option.email}
            />
          </MenuItem>
        ))}
      </Select>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      companies,
      company.blocked_by_failure_intents,
      company.description,
      company.id_server,
      companyHelpText,
      i18n,
      indexCompanies,
      t,
    ],
  );

  return show ? (
    <>
      {CompanyRender}
      {!isFingerprint && hasFingerprint && (
        <FormControlLabel
          style={{
            width: '100%',
            justifyContent: 'end',
            marginBottom: theme.spacing(1),
          }}
          control={
            <Switch
              color="primary"
              edge="end"
              checked={remember}
              onChange={() => {
                setRemember((prev: boolean) => !prev);
              }}
            />
          }
          label={t('REMEMBER_ME')}
        />
      )}
      {companies.length > 1 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr',
            gap: `${(theme.spacing(0), theme.spacing(0.5))}`,
            justifyContent: 'center',
            mb: `${theme.spacing(3)}`,
          }}
        >
          <div>
            <ButtonIcon
              className="qa-btn-back"
              onClick={onBack}
              variant="text"
              icon="arrow_left"
              size="large"
              disabled={loginSSO}
            />
          </div>
          <Button
            fullWidth
            className="qa-btn-signin"
            color="primary"
            disabled={
              !loginSSO && (Object.keys(auth.errors).length > 0 || blockedUser)
            }
            onClick={onSignIn}
            size="large"
            variant="contained"
            data-cy="login-button"
          >
            {t('LOGIN')}
          </Button>
        </Box>
      )}
    </>
  ) : null;
};

export default Company;
