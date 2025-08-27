import React, { ReactNode } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Container, Box, useTheme } from '@mui/system';

interface BoxSignInProps {
  colorBg: string;
  children?: ReactNode;
}

const BoxSignIn: React.FC<BoxSignInProps> = ({ colorBg, children }) => {
  const theme = useTheme();
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          backgroundColor: colorBg,
          width: '500px',
          padding: `${theme.spacing(13)} ${theme.spacing(4)} ${theme.spacing(
            4,
          )} ${theme.spacing(4)}`, // '138px 32px 32px 32px'
          borderRadius: '16px',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default BoxSignIn;
