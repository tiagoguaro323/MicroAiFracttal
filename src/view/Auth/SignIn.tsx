import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LinearProgress, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { useLocation } from 'react-router';
import { mainError } from 'store/main/actions';
import deployInfo from 'deploy-info.json';
import { authUpdate } from 'store/auth/action';
import useSignIn from 'hooks/useSignIn';
import { useQuery } from 'hooks';
import { DialogGradient } from 'designSystem';
import JWT from 'core/services/JWT';
import { push } from 'redux-first-history';
import { CheckEmail, FormContainer } from './components';
import BoxSignIn from './components/BoxSignIn';

if (deployInfo.tag === '___TAG___') {
  deployInfo.tag = '5.dev';
}

const HOST = import.meta.env.VITE_APP_URL_API || '';
const platform = `Fracttal/${deployInfo.tag} ${Capacitor.getPlatform()}`;

const SignIn = () => {
  const theme = useTheme();
  const dispatch: any = useDispatch();
  const query = useQuery();
  const { t } = useTranslation();
  const auth = useSelector((state: any) => state.auth);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [twoStepAuth, setTwoStepAuth] = useState(false);
  const [samlShow, setSamlShow] = useState(false);
  const [blockedUser, setBlockedUser] = useState(false);
  const [listCompaniesSSO, setListCompaniesSSO] = useState<any[] | null>(null);
  const { search, state } = useLocation();

  const oauthRedirect =
    new URLSearchParams(search).get('oauthredirect') || null;

  useEffect(() => {
    if (company) {
      setBlockedUser(company.blocked_by_failure_intents);
    } else {
      setBlockedUser(false);
    }
  }, [company]);

  const setSessionInfo = useSignIn();
  const jwtUrl = query.get('inf');
  // const samlUrlCode = query.get('samlcode');

  const onBack = useCallback(() => {
    setCompany(null);
    // setValidCode(false);
    setTwoStepAuth(false);
    setSamlShow(false);
    dispatch(authUpdate({ ...auth, email: '', password: '' }));
  }, [auth, dispatch]);

  useEffect(() => {
    if (state?.withoutAccess)
      dispatch(mainError({ msg: t('NO_PERMISSIONS_TO_GRANT_OAUTH_ACCESS') }));
  }, [dispatch, state?.withoutAccess, t]);

  const onLoginResponse = useCallback(
    (onSuccess: any = null) =>
      (response: any) => {
        if (response.success) {
          if (response.data.has_two_factor_auth) {
            setTwoStepAuth(response.data.has_two_factor_auth);
            setLoading(false);
          } else {
            setLoading(false);
            response.data.account.isLogin = new Date();
            setSessionInfo(response.data);
            onSuccess && onSuccess(response.data);
          }
        } else {
          if (response.message === 'TWO_FACTOR_INVALID') {
            // setValidCode(false);
          } else {
            dispatch(mainError({ msg: t(response.message) }));
          }
          setLoading(false);
        }
      },
    [dispatch, setSessionInfo, t],
  );

  const onLoginSSO = useCallback(
    (index: number) => {
      // Auntenticar la cuenta retornada al inicio de sesión
      setLoading(true);
      fetch(`${HOST}/rpc/auth/checkcookie`, {
        method: 'POST',
        body: JSON.stringify({
          cookie: jwtUrl,
          platform,
          index,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) {
            throw new Error('TOKEN_EXPIRED');
          } else {
            return res;
          }
        })
        .then((res) => res.json())
        .then(onLoginResponse())
        .catch((error) => {
          if (error.message === 'TOKEN_EXPIRED') {
            dispatch(mainError({ msg: t(error.message) }));
          } else {
            dispatch(mainError({ msg: 'ERROR AUTH' }));
          }
          dispatch(push('/'));
          setLoading(false);
        });
    },
    [dispatch, jwtUrl, onLoginResponse, t],
  );

  useEffect(() => {
    // Valida si es redireccion de single signon
    if (jwtUrl && jwtUrl !== '') {
      // Si viene el dato va a autenticar la aplicacion
      const infoCompanies = JWT.jwtDecode(jwtUrl) as any;

      if (infoCompanies.info) {
        if (infoCompanies.info.length === 1) {
          onLoginSSO(0);
        } else {
          setListCompaniesSSO(infoCompanies.info);
        }
      } else {
        onLoginSSO(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtUrl, onLoginSSO]);

  const onSendLogin = useCallback(
    (objPwd: any, onSuccess?: (data: any) => void, isAutoLogin?: boolean) => {
      if (objPwd.loginSSO) {
        onLoginSSO(listCompaniesSSO?.indexOf(company) || 0);
      } else {
        const userData = { ...objPwd, platform };
        setLoading(true);
        if (onSuccess || isAutoLogin) {
          fetch(`${HOST}/rpc/login_new`, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => res.json())
            .then(onLoginResponse(onSuccess))
            .catch(() => {
              dispatch(mainError({ msg: 'ERROR AUTH' }));
              setLoading(false);
            });
        }
      }
    },
    [dispatch, onLoginResponse, onLoginSSO, listCompaniesSSO, company],
  );

  const renderCheckEmail = useMemo(
    () => !samlShow && !twoStepAuth,
    [samlShow, twoStepAuth],
  );

  const renderSaml = useMemo(
    () => samlShow && !twoStepAuth,
    [samlShow, twoStepAuth],
  );

  const title = useMemo(() => {
    if (blockedUser) return t('BLOCKED_ACCOUNT');
    if (renderCheckEmail) return t('LOGIN_WITH');
    if (renderSaml) return t('SAML_LOGIN_LABELTEXT');
    return t('TWOSTEPAUTHLOGINMESSAGE');
  }, [blockedUser, renderCheckEmail, renderSaml, t]);

  return (
    <DialogGradient
      open
      colors={[`${theme.palette.primary.main}`, `${theme.palette.info.light}`]}
      type="radial"
    >
      <BoxSignIn colorBg={theme.palette.content.main}>
        <FormContainer title={title}>
          {blockedUser && (
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
              {t('MSG_EMAIL_SENT_TO_UNLOCK_ACCOUNT')}
            </Typography>
          )}
          {renderCheckEmail && (
            <>
              <CheckEmail
                hasFingerprint={false}
                host={HOST}
                disabled={Boolean(company) && !samlShow}
                company={company}
                onCompanyChange={setCompany}
                onSendLogin={onSendLogin}
                listCompaniesSSO={listCompaniesSSO}
                blockedUser={blockedUser}
                oauthRedirect={oauthRedirect}
                loginSSO={!!listCompaniesSSO}
                onBack={onBack}
              />
              {loading && <LinearProgress sx={{ my: theme.spacing(1) }} />}
            </>
          )}
        </FormContainer>
      </BoxSignIn>
    </DialogGradient>
  );
};

export default SignIn;
