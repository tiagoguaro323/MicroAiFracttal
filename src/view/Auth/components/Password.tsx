/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useCallback, useMemo, useState } from 'react';
import { IconButton, InputAdornment, TextField, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { authUpdate } from 'store/auth/action';
import { Icon } from 'designSystem';

interface IProps {
  hasFingerprint: boolean;
  show?: boolean;
  company?: any;
  onCheckCredentials: () => void;
  disabled: boolean;
  blockedUser: boolean;
  loginSSO: boolean;
}

const Password: FC<IProps> = ({
  hasFingerprint,
  show,
  company,
  onCheckCredentials,
  disabled,
  blockedUser,
  loginSSO,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const auth = useSelector((state: any) => state.auth);
  const dispatch: any = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((show) => !show);
  }, []);

  const isFingerprint = useMemo(
    () =>
      hasFingerprint &&
      company &&
      company.password &&
      company.password.length > 6,
    [company, hasFingerprint],
  );

  const helpTextPassword = useMemo(() => {
    if (auth.password === null || auth.password === '') return '';

    if (auth.errors.password && Object.keys(auth.errors.password).length > 0)
      return auth.errors.password[0];
    return '';
  }, [auth.errors.password, auth.password]);

  const isDisabled = useMemo(
    () => blockedUser || disabled,
    [blockedUser, disabled],
  );

  const onPasswordChange = useCallback(
    (value: string) => {
      dispatch(authUpdate({ ...auth, password: value.trim() }));
    },
    [auth, dispatch],
  );

  const PasswordRender = useMemo(
    () => (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {!isFingerprint && (
          <TextField
            margin="normal"
            fullWidth
            className="qa-txt-password"
            label={t('PASSWORD')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            error={
              !!auth.errors.password && !blockedUser && helpTextPassword !== ''
            }
            value={auth.password}
            variant="outlined"
            onChange={(event) => onPasswordChange(event.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onCheckCredentials()}
            helperText={
              !blockedUser && auth.errors.password ? helpTextPassword : ''
            }
            autoComplete="off" // evitar autoComplete
            InputProps={{
              autoComplete: 'off',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className="qa-btn-show-password"
                    onClick={handleClickShowPassword}
                    disabled={isDisabled}
                  >
                    <Icon
                      variantName={showPassword ? 'eye_no' : 'eye'}
                      color={
                        isDisabled
                          ? theme.palette.text.disabled
                          : theme.palette.text.secondary
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={isDisabled}
            data-cy="pwd-input"
          />
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isFingerprint,
      t,
      showPassword,
      auth.errors.password,
      auth.password,
      blockedUser,
      helpTextPassword,
      disabled,
      hasFingerprint,
      theme,
    ],
  );

  return show ? !loginSSO && PasswordRender : null;
};

export default Password;
