/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState } from 'react';
import {
  LinearProgress,
  Popper,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
// import { useLocation } from 'react-router';
import { t } from 'i18next';
import { useMobile } from 'hooks';
import messagesAndRoutesRaw, { getSectionKeyFromPath } from './MessagesAi';

export default function TalkingAi() {
  const anchorEl = document.querySelector('.qa-fracttal-ai');
  const messagesAndRoutes: any = messagesAndRoutesRaw;
  const { pathname } = window.location;
  const location = pathname;
  const theme = useTheme();
  const isMobile = useMobile();
  const [openTalk, setOpenTalk] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const arrowRef = useRef(null);

  const routeKey = getSectionKeyFromPath(location) || '/default';
  const toSay = messagesAndRoutes.messages[routeKey];

  useEffect(() => {
    const messages = Array.isArray(toSay) ? toSay : [];

    if (messages.length === 0 || Math.random() > 0.9) return;

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setSelectedMessage(randomMessage);
    setOpenTalk(true);

    const duration = 8000;
    const intervalMs = 50;
    const steps = duration / intervalMs;
    const increment = 100 / steps;

    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));
    }, intervalMs);

    const timeout = setTimeout(() => {
      setOpenTalk(false);
      clearInterval(interval);
      setProgress(100);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Cerrar el popper al hacer clic fuera
  useEffect(() => {
    const handleClickAnywhere = () => {
      setOpenTalk(false);
    };

    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, []);

  return (
    <Popper
      id="talking-ai-popper"
      open={openTalk && !!selectedMessage}
      anchorEl={anchorEl}
      placement="bottom-end"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [16, 5],
          },
        },
        {
          name: 'arrow',
          options: {
            element: arrowRef.current,
          },
        },
      ]}
      sx={{ zIndex: 1300, pointerEvents: 'none' }}
    >
      <Box
        onClick={() => setOpenTalk(false)}
        sx={{
          position: 'relative',
          maxWidth: 300,
          p: 2,
          ml: isMobile ? 1 : -1,
          mt: 1.5,
          background: theme.palette.ai.backgroundPrimary,
          borderRadius: 2,
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
          color: theme.palette.content.main,
          pointerEvents: 'auto',
        }}
      >
        <Box
          ref={arrowRef}
          sx={{
            position: 'absolute',
            width: 0,
            height: 0,
            top: 0,
            right: 20,
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: isMobile ? -5 : -10,
              transform: 'translateY(-100%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: `8px solid ${theme.palette.mode === 'dark' ? '#00e4ff' : '#00c7ff'}`,
              zIndex: 1,
            },
          }}
        />
        <Typography>{selectedMessage ? t(selectedMessage) : null}</Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            marginTop: 1,
            '& span': { backgroundColor: theme.palette.content.main },
          }}
        />
      </Box>
    </Popper>
  );
}
