import React, { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLogoImage } from 'hooks';

interface IProps {
  title: string;
  heading?: string;
  children: any;
}

const FormContainer: FC<IProps> = ({ title, heading, children }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const imgApp = useLogoImage();

  return (
    <div
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box textAlign="center" pt={0} pb={3}>
        <img alt="Fracttal" src={imgApp} height="51" />
      </Box>
      {heading && (
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: theme.spacing(2),
          }}
        >
          {heading}
        </Typography>
      )}
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          mb: theme.spacing(1),
          color:
            title === t('BLOCKED_ACCOUNT')
              ? theme.palette.error.main
              : 'default',
        }}
      >
        {title}
      </Typography>
      <form
        noValidate
        autoComplete="on"
        style={{ paddingBottom: theme.spacing(1) }}
      >
        {children}
      </form>
    </div>
  );
};

export default FormContainer;
