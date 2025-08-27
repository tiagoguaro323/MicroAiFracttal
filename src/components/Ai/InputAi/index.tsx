/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { agentInfo, AgentsType, ContextTypeAI } from 'constants/FracttalAI';
import { useTranslation } from 'react-i18next';
import { ButtonIcon } from 'designSystem';
import ImageUploadAI from 'view/Ai/ImageUploadAI';
import { Img } from 'components/ImageUpload/ImageUpload';
import useRecord from 'hooks/FracttalAI/useRecord';

interface IProps {
  agentType?: AgentsType;
  contextType?: ContextTypeAI;
  ableToSend: boolean;
  conversationID: string;
  handleSend: (
    e: React.KeyboardEvent | React.MouseEvent,
    info,
    image?: any,
  ) => void;
  sendAudio: (audio: any) => void;
  isConnected?: boolean;
  transcript: string;
}

const InputAi: FC<IProps> = ({
  agentType = 'GENERAL',
  contextType = 'list',
  conversationID,
  ableToSend,
  handleSend,
  sendAudio,
  isConnected = false,
  transcript = '',
}) => {
  //   const { i18n } = useTranslation();
  const [working, setWorking] = useState(false);
  const [showDisconnectedIndicator, setShowDisconnectedIndicator] =
    useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const [message, setNewMessage] = useState('');
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    setWorking(false);
  }, [sendAudio]);

  const {
    status,
    startRecording,
    pauseRecording,
    deleteRecording,
    resumeRecording,
    stopRecording,
    data,
  } = useRecord({});
  const [file, setFile] = useState<any>();
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    setNewMessage(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!isConnected) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(() => {
        setShowDisconnectedIndicator(false);
      }, 5000);
    } else {
      clearTimeout(timeout);
      setShowDisconnectedIndicator(false);
    }

    return () => clearTimeout(timeout);
  }, [isConnected]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    let localInterval: NodeJS.Timeout;

    if (status === 'recording') {
      setRecordingSeconds((prev) => (prev === 0 ? 0 : prev));
      localInterval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }

    if (status === 'idle') {
      setRecordingSeconds(0);
    }

    return () => clearInterval(localInterval);
  }, [status]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const readyToSend = () => {
    if (status === 'recording' || status === 'paused') {
      return false;
    }
    if (!ableToSend || message === '') {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (status === 'idle' && data) {
      sendAudio(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, data]);

  return (
    <Box padding={1}>
      <Box sx={{ position: 'relative' }}>
        {file && file.publicUrl === null && (
          <Box
            position="relative"
            width={100}
            height={100}
            borderRadius={2}
            overflow="hidden"
            border={`1px solid ${theme.palette.divider}`}
            boxShadow={3}
            alignItems="center"
            justifyContent="center"
            display="flex"
            sx={{
              mb: 1,
            }}
          >
            <CircularProgress
              size={24}
              sx={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}
        {file && file.publicUrl !== null && (
          <Box
            position="relative"
            width={100}
            height={100}
            borderRadius={2}
            overflow="hidden"
            border={`1px solid ${theme.palette.divider}`}
            boxShadow={3}
            sx={{
              mb: 1,
            }}
          >
            <Img src={file.preview} width="100%" height="100%" />
            <ButtonIcon
              icon="close"
              onClick={() => setFile(undefined)}
              title={t('REMOVE_IMAGE')}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                zIndex: 2,
              }}
              variant="main_ai"
              iconColor="#fff"
              size="small"
            />
          </Box>
        )}
        {showDisconnectedIndicator && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              zIndex: 10,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: theme.palette.error.main,
              }}
            />
            <Typography
              variant="caption"
              color={theme.palette.error.main}
              sx={{
                fontWeight: 500,
                fontFamily: (theme) => (theme.typography as any).manrope,
              }}
            >
              {t('DESCONECTADO')}{' '}
            </Typography>
          </Box>
        )}

        <TextField
          multiline
          className="qa-input-ai"
          fullWidth
          maxRows={2}
          value={message}
          autoComplete="off"
          placeholder={
            status === 'recording' || status === 'paused'
              ? t('Escuchando...')
              : agentInfo[agentType].placeholder && contextType === 'list'
                ? t(agentInfo[agentType].placeholder)
                : t('HOW_CAN_I_HELP_YOU')
          }
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && ableToSend) {
              handleSend(e, message, file?.publicUrl);
              setNewMessage('');
              file && setFile(undefined);
            }
          }}
          sx={{
            background: theme.palette.background.paper,
            zIndex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.shape.borderRadius / 2,
              transition: 'box-shadow 0.3s ease',
              '& .MuiOutlinedInput-inputMultiline': {
                paddingBottom: '32px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: theme.palette.ai.boxShadow,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: `1px solid ${theme.palette.primary.main}`,
                borderWidth: 1,
                boxShadow: theme.palette.ai.boxShadow,
              },
              '& textarea': {
                paddingBottom: '16px!important',
                marginBottom: '30px',
              },
              fontFamily: (theme) => (theme.typography as any).manrope,
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, pointerEvents: 'auto' }}>
            <ImageUploadAI
              conversationID={conversationID}
              file={file}
              setFile={setFile}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              pointerEvents: 'auto',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {(status === 'recording' || status === 'paused') && (
                <>
                  <Typography
                    variant="body1"
                    color={theme.palette.ai.primary}
                    sx={{
                      minWidth: 48,
                      fontFamily: (theme) => (theme.typography as any).manrope,
                      zIndex: 2,
                    }}
                  >
                    {formatTime(recordingSeconds)}
                  </Typography>
                  <ButtonIcon
                    variant="secondary_ai"
                    iconColor={theme.palette.ai.primary}
                    icon={
                      status === 'recording' || status === 'paused'
                        ? 'close'
                        : 'wireless'
                    }
                    onClick={() => {
                      if (status === 'recording' || status === 'paused') {
                        deleteRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    sx={{ zIndex: 2 }}
                  />
                </>
              )}
              <ButtonIcon
                variant="secondary_ai"
                iconColor={theme.palette.ai.primary}
                icon={
                  status === 'recording'
                    ? 'pause_circle'
                    : status === 'paused'
                      ? 'play_circle'
                      : 'wave'
                }
                onClick={() => {
                  if (status === 'recording') {
                    pauseRecording();
                  } else if (status === 'paused') {
                    resumeRecording();
                  } else {
                    startRecording();
                  }
                }}
                sx={{ zIndex: 2 }}
              />
            </Box>

            {!working && (
              <ButtonIcon
                variant="main_ai"
                icon={
                  status === 'recording' || status === 'paused'
                    ? 'check'
                    : 'send_ai'
                }
                disabled={
                  status === 'recording' || status === 'paused'
                    ? false
                    : readyToSend()
                }
                onClick={(e) => {
                  if (status === 'recording' || status === 'paused') {
                    stopRecording();
                    setWorking(true);
                  } else {
                    handleSend(e, message, file?.publicUrl);
                    setNewMessage('');
                    file && setFile(undefined);
                  }
                }}
                sx={{ zIndex: 2 }}
              />
            )}
            {working && (
              <Box
                sx={{
                  zIndex: 2,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={24} color="primary" />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Typography
        variant="caption"
        color={theme.palette.text.disabled}
        display="block"
        sx={{
          textAlign: 'center',
          width: '100%',
          margin: '4px auto 0px',
          fontSize: '10px',
          fontFamily: (theme) => (theme.typography as any).manrope,
        }}
      >
        {t('FRACTTAL_AI_DISCLAIMER')}
      </Typography>
    </Box>
  );
};

export default memo(InputAi);
