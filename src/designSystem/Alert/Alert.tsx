import React, { useMemo } from 'react';
import { Theme, Alert as AlertMui, AlertProps, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Icon from 'designSystem/Icon';

export type IProps = {
  children: any;
  severity: AlertProps['severity'];
  variant?: AlertProps['variant'];
  sx?: AlertProps['sx'];
  style?: React.CSSProperties;
  className?: string;
  elevation?: number;
  onClick?: AlertProps['onClick'];
  onClose?: AlertProps['onClose'];
  icon?: React.ReactNode;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    info: {
      borderRadius: theme.spacing(2),
      background: theme.palette.other.infoBackground,
      color: theme.palette.text.primary,
    },
    error: {
      borderRadius: theme.spacing(2),
      background: theme.palette.other.errorBackground,
      color: theme.palette.text.primary,
    },
    warning: {
      borderRadius: theme.spacing(2),
      background: theme.palette.other.warningBackground,
      color: theme.palette.text.primary,
    },
    success: {
      borderRadius: theme.spacing(2),
      background: theme.palette.other.successBackground,
      color: theme.palette.text.primary,
    },
  }),
);

const Alert: React.FC<IProps> = ({
  children,
  severity,
  className,
  icon,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const alertClasses = useMemo(() => {
    switch (severity) {
      case 'info':
        return classes.info;
      case 'error':
        return classes.error;
      case 'warning':
        return classes.warning;
      case 'success':
        return classes.success;
      default:
        return '';
    }
  }, [classes.info, classes.error, classes.warning, classes.success, severity]);

  const defaultIcon = useMemo(() => {
    switch (severity) {
      case 'info':
        return (
          <Icon variantName="circle_info" color={theme.palette.info.main} />
        );
      case 'error':
        return (
          <Icon
            variantName="circle_exclamation"
            color={theme.palette.error.main}
          />
        );
      case 'warning':
        return (
          <Icon
            variantName="circle_exclamation"
            color={theme.palette.warning.main}
          />
        );
      case 'success':
        return (
          <Icon variantName="check_circle" color={theme.palette.success.main} />
        );
      default:
        return null;
    }
  }, [
    severity,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.success.main,
  ]);

  return (
    <AlertMui
      className={`${className} ${alertClasses}`}
      severity={severity}
      icon={icon || defaultIcon}
      {...rest}
    >
      {children}
    </AlertMui>
  );
};

export default Alert;
