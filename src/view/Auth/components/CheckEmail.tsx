/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button as ButtonMui,
  Chip,
  LinearProgress,
  TextField,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { HttpRequestStatusTypes } from 'core/enums';
import { mainError } from 'store/main/actions';
import { authUpdate } from 'store/auth/action';
import Util from 'core/helpers/Util';
import { useNative } from 'fracttal-core';
import Password from './Password';
import Company from './Company';

interface IProps {
  hasFingerprint: boolean;
  host: string;
  disabled: boolean;
  company: any;
  onCompanyChange: (value: any) => void;
  onSendLogin: (
    value: any,
    onSuccess?: (data: any) => void,
    isAutoLogin?: boolean,
  ) => void;
  // onSSO: () => void;
  onBack?: () => void;
  listCompaniesSSO: any[] | null;
  blockedUser: boolean;
  oauthRedirect?: string | undefined | null;
  loginSSO: boolean;
}

const CheckEmail: FC<IProps> = ({
  hasFingerprint,
  host,
  disabled,
  company,
  onCompanyChange,
  onSendLogin,
  // onSSO,
  onBack,
  listCompaniesSSO,
  blockedUser,
  oauthRedirect,
  loginSSO,
}) => {
  const { t } = useTranslation();
  const auth = useSelector((state: any) => state.auth);
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isFingerprint, setIsFingerprint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch<any>();
  const serverErrorStates = useMemo(
    () =>
      Object.values(HttpRequestStatusTypes).reduce((prev: number[], curr) => {
        if (typeof curr === 'number' && curr >= 500) prev = [...prev, curr];
        return prev;
      }, []),
    [],
  );
  const isNative = useNative();

  useEffect(() => {
    if (company === null) setIsFingerprint(false);
  }, [company]);

  useEffect(() => {
    if (listCompaniesSSO) {
      setCompanies(listCompaniesSSO);
      onCompanyChange(listCompaniesSSO[0]);
    }
  }, [listCompaniesSSO, onCompanyChange]);

  const onEmailChange = useCallback(
    (value: string) => {
      dispatch(
        authUpdate({
          ...auth,
          email: value.trim().toLowerCase(),
          password: '',
        }),
      );
      setErrorMsg('');
    },
    [auth, dispatch],
  );

  const onCheckMail = useCallback(() => {
    if (auth.email !== '' && auth.password !== '') {
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

      setLoading(true);
      fetch(`${host}/rpc/check_user`, {
        method: 'POST',
        body: JSON.stringify({ email: auth.email, password: pwd }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (
            [
              ...serverErrorStates,
              HttpRequestStatusTypes.MAXIMUM_ATTEMPTS,
            ].includes(res.status)
          )
            throw new Error(res.status.toString());
          return res.json();
        })
        .then((response) => {
          if (response.success) {
            dispatch(authUpdate({ ...auth, email: auth.email.toLowerCase() }));

            const processedData = !Array.isArray(response.data)
              ? [{ ...response.data, id_company: response.data.id }]
              : response.data;

            setCompanies(processedData);
            onCompanyChange(processedData[0]);
            const pwd = Util.encryptPassword({
              email: auth.email,
              password: auth.password,
            });
            const objPsw = {
              email: auth.email,
              password: pwd,
              id_company: processedData[0].id_company,
              id_server: processedData[0].id_server,
              description: processedData[0].description,
            };

            // Si solo hay un resultado, iniciar login automático
            if (processedData.length === 1) {
              onSendLogin(objPsw, undefined, true);
            }
            setErrorMsg('');
          } else {
            dispatch(mainError({ msg: t(response.message) }));
            setErrorMsg(t(response.message));
          }
          setLoading(false);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('AUTH:', error);
          try {
            const status = Number(error.message);
            if (status === HttpRequestStatusTypes.MAXIMUM_ATTEMPTS)
              dispatch(mainError({ msg: t(HttpRequestStatusTypes[status]) }));
            else if (serverErrorStates.includes(status))
              dispatch(mainError({ msg: t('DEFAULT_SERVER_ERROR') }));
            else {
              JSON.parse(error);
              dispatch(mainError({ msg: 'ERROR AUTH' }));
            }
          } catch (error) {
            dispatch(
              mainError({
                msg: t('DEFAULT_HTTP_ERROR'),
              }),
            );
          }

          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    auth,
    isFingerprint,
    host,
    company?.password,
    serverErrorStates,
    dispatch,
    remember,
    isNative,
    t,
  ]);

  const onSelectChange = useCallback(
    (index: any) => {
      const select = companies[index];
      if (select !== undefined) {
        onCompanyChange(select);
        isFingerprint &&
          dispatch(
            authUpdate({
              ...auth,
              email: select.email,
              password: select.password,
            }),
          );
      }
    },
    [auth, companies, dispatch, isFingerprint, onCompanyChange],
  );

  const helpText = useMemo(() => {
    if (auth.email === null || auth.email === '') return '';
    if (auth.errors.email && Object.keys(auth.errors.email).length > 0)
      return auth.errors.email[0];
    if (errorMsg.length > 0 && errorMsg === t('BLOCKED_BY_FAILURE_INTENTS'))
      return t('BLOCKED_ACCOUNT');
    return '';
  }, [auth.email, auth.errors, errorMsg, t]);

  const companyHelpText = useMemo(() => {
    if (company && company.blocked_by_failure_intents)
      return t('BLOCKED_ACCOUNT');
    if (companies.length > 1) return t('SELECT_AN_OPTION');
    return '';
  }, [companies.length, company, t]);

  const indexCompanies = useMemo(() => {
    return (
      company &&
      companies.findIndex(
        (item) =>
          item.id_company === company.id_company &&
          item.id_server === company.id_server,
      )
    );
  }, [companies, company]);

  return (
    <>
      {!isFingerprint ? (
        <>
          <TextField
            margin="normal"
            fullWidth
            className="qa-txt-email"
            error={helpText !== ''}
            label={t('EMAIL')}
            name="email"
            type="email"
            value={listCompaniesSSO ? listCompaniesSSO[0].email : auth.email}
            variant="outlined"
            onChange={({ target }) => onEmailChange(target.value)}
            helperText={helpText}
            inputProps={{
              className: 'qa-signin-form-email',
            }}
            sx={{
              mt: theme.spacing(1),
              mb: theme.spacing(2),
            }}
            disabled={loading || disabled}
            autoComplete="username"
            autoFocus
            data-cy="email-input"
          />
          <Password
            show
            hasFingerprint={hasFingerprint}
            onCheckCredentials={onCheckMail}
            disabled={loading || disabled}
            blockedUser={blockedUser}
            loginSSO={loginSSO}
          />
        </>
      ) : (
        <Chip
          color="info"
          icon={<FingerprintIcon />}
          label={`${t('SAVED_USERS')} (${companies.length})`}
        />
      )}
      {Boolean(company) && (
        <Company
          show
          indexCompanies={indexCompanies}
          companies={companies}
          companyHelpText={companyHelpText}
          loginSSO={loginSSO}
          hasFingerprint={hasFingerprint}
          blockedUser={blockedUser}
          company={company}
          onSelectChange={onSelectChange}
          onSendLogin={onSendLogin}
          oauthRedirect={oauthRedirect}
          onBack={onBack}
          remember={remember}
          setRemember={setRemember}
          onRememberUser={() => {}}
        />
      )}
      {company === null && (
        <ButtonMui
          fullWidth
          disabled={
            loading ||
            helpText !== '' ||
            auth.email === '' ||
            (auth.errors.password &&
              Object.keys(auth.errors.password).length > 0)
          }
          className="qa-btn-signin"
          color="primary"
          onClick={onCheckMail}
          variant="contained"
          size="large"
          sx={{ marginBottom: theme.spacing(2) }}
          data-cy="next-button"
        >
          {t('NEXT')}
        </ButtonMui>
      )}
      {loading && <LinearProgress sx={{ my: theme.spacing(1) }} />}
    </>
  );
};

export default CheckEmail;
