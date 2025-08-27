import React, { FC } from 'react';
import { Stack, Box, useMediaQuery, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '@lottiefiles/react-lottie-player';
import { Icon } from 'designSystem';
import { LIcon } from 'core/helpers/Types';
import iconIaLight from './icon-IA-light.json';
import iconIaDark from './icon-IA-dark.json';

type Props = {
  messages: any[];
  handleSendButton: (value: string) => void;
};

const Empty: FC<Props> = ({ messages, handleSendButton }) => {
  const { account } = useSelector((state: any) => state.auth);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const promptsDesktop = [
    { prompt: t('MSG_P_PROMPT_1'), icon: 'notes' },
    { prompt: t('MSG_P_PROMPT_2'), icon: 'calendar' },
    { prompt: t('MSG_P_PROMPT_3'), icon: 'clipboard_clock' },
    { prompt: t('MSG_P_PROMPT_4'), icon: 'clipboard_text' },
  ];

  const promptsMobile = [
    { prompt: t('MSG_P_PROMPT_3'), icon: 'clipboard_clock' },
    { prompt: t('MSG_P_PROMPT_4'), icon: 'clipboard_text' },
  ];

  const visiblePrompts = isMobile ? promptsMobile : promptsDesktop;

  return (
    <Stack
      display={messages.length === 0 ? 'flex' : 'none'}
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      width="100%"
      padding={1}
      sx={{
        height: 'calc(100vh - 300px)',
      }}
      paddingBottom={1}
    >
      <Player
        autoplay
        loop
        src={theme.palette.mode === 'dark' ? iconIaDark : iconIaLight}
        style={{
          height: theme.spacing(16),
          width: theme.spacing(16),
        }}
      />
      <Typography
        align="center"
        variant="h1"
        gutterBottom
        sx={{
          fontFamily: (theme) => (theme.typography as any).manrope,
          fontWeight: 600,
          fontSize: isMobile ? '28px!important' : '42px!important',
          marginTop: isMobile ? '-10px!important' : '',
        }}
      >
        {t('HELLO_THERE', { name: account?.name?.split(' ')[0] })}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: 900,
        }}
      >
        {visiblePrompts.map((prompt) => (
          <Box
            key={uuidv4()}
            component="button"
            onClick={() => handleSendButton(prompt.prompt)}
            sx={{
              width: '100%',
              background: theme.palette.ai.backgroundSecondary,
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              color: theme.palette.content.status,
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: (theme) => (theme.typography as any).manrope,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s',
              '&:hover': {
                background: theme.palette.action.hover,
              },
            }}
          >
            <Icon
              variantName={prompt.icon as LIcon}
              color="url(#gradient1)"
              variant="contained"
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            {prompt.prompt}
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default Empty;
