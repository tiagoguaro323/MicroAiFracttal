/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Typography,
  useTheme,
  Box,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { Button, Icon } from 'designSystem';
import { AnimationAI } from 'components';
import Markdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from 'hooks/FracttalAI/useAgentAI';
import { useTranslation } from 'react-i18next';
import { Player } from '@lottiefiles/react-lottie-player';
import { useSelector } from 'react-redux';
import { useMobile } from 'hooks';
import { agentInfo } from 'constants/FracttalAI';
import SignedImage from 'view/Ai/SignedImage';
import Plot from 'react-plotly.js';
import iconIaLight from '../../../view/Ai/icon-IA-light.json';
import iconIaDark from '../../../view/Ai/icon-IA-dark.json';

interface IProps {
  messages: IMessage[];
  loading?: boolean;
  handleSendButton: (
    e: React.KeyboardEvent | React.MouseEvent,
    info,
    image?: any,
  ) => void;
  contextType?: any;
  agentType?: any;
}

const Messages: FC<IProps> = ({
  messages,
  loading,
  handleSendButton = () => {}, // Default function to avoid errors if not provided
  contextType,
  agentType,
}) => {
  const isMobile = useMobile();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { account } = useSelector((state: any) => state.auth);
  const theme = useTheme();
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isFirstRender ? 'auto' : 'smooth',
      block: 'end',
    });
    if (isFirstRender) setIsFirstRender(false);
  }, [messages, isFirstRender]);

  const showTitle =
    ['WORK_ORDERS', 'METERS', 'ASSETS', 'GENERAL', 'REQUESTS'].includes(
      agentType,
    ) && contextType === 'list';
  let prompts: any = [];

  if (contextType === 'detail') {
    prompts = [
      { prompt: t('QUICK_ACTIONS_AI_1'), icon: 'clipboard_clock' },
      { prompt: t('QUICK_ACTIONS_AI_2'), icon: 'clipboard_text' },
    ];
  } else if (contextType === 'list') {
    prompts = agentInfo[agentType]?.cards || [];
  }

  const visiblePrompts = isMobile ? prompts.slice(0, 2) : prompts;

  return (
    <Box
      flexDirection="column"
      p={1}
      gap={1}
      sx={{
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto',
        '& .MuiCard-root': {
          flexShrink: 0,
        },
        justifyContent: messages.length === 0 ? 'center' : 'flex-start',
      }}
      display="flex"
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
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
        </Box>
      ) : messages.length === 0 ? (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          gap={4}
          width="100%"
          paddingBottom={1}
        >
          <Box>
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
                fontSize: '28px!important',
              }}
            >
              {t('HELLO_THERE', { name: account?.name?.split(' ')[0] })}{' '}
              {agentType !== 'GENERAL' && (
                <>
                  {t('I_AM')}
                  <Typography
                    align="center"
                    variant="h1"
                    gutterBottom
                    sx={{
                      fontFamily: (theme) => (theme.typography as any).manrope,
                      fontWeight: 600,
                      fontSize: '28px!important',
                      background:
                        'linear-gradient(263deg, #044EC6 0%, #00C7FF 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {t(agentInfo[agentType].subheader || '')}
                  </Typography>
                </>
              )}
            </Typography>
            {showTitle && (
              <Typography
                align="center"
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontFamily: (theme) => (theme.typography as any).manrope,
                }}
              >
                {t(agentInfo[agentType].instructions)}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px',
              width: '-webkit-fill-available',
            }}
          >
            {visiblePrompts.map((prompt) => (
              <Box
                key={uuidv4()}
                component="button"
                onClick={(e) => handleSendButton(e, t(prompt.prompt), null)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
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
                  gap: 1,
                  // justifyContent: 'center',
                }}
              >
                <Icon
                  variantName={prompt.icon || 'map'}
                  color={theme.palette.ai.primary}
                  variant="contained"
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}
                />
                {t(prompt.prompt)}
              </Box>
            ))}
          </Box>
        </Stack>
      ) : null}

      {!loading && (
        <Box
          display="flex"
          flexDirection="column"
          mt="auto"
          gap={1}
          sx={{
            width: '100%',
            height: isMobile ? 'calc(100vh - 320px)' : 'calc(100vh - 300px)',
            overflowY: 'auto',
            display: messages.length === 0 ? 'none' : 'block',
          }}
        >
          {messages.map(
            ({ value, sender, metadata, image, artifact }, index) => {
              const hasArtifact = artifact;
              return value && value.trim() !== '' ? (
                <Box
                  key={uuidv4()}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: sender === 'human' ? 'flex-end' : 'flex-start',
                    justifyContent:
                      sender === 'human' ? 'flex-end' : 'flex-start',
                    width: '100%',
                    height: 'fit-content',
                    gap: 1,
                  }}
                >
                  {sender === 'human' && image && image !== '' && (
                    <SignedImage
                      imageUrl={image}
                      width={isMobile ? 100 : 150}
                      height={isMobile ? 100 : 150}
                    />
                  )}
                  <Card
                    variant="outlined"
                    sx={{
                      border: 0,
                      maxWidth: '80%',
                      borderRadius: theme.shape.borderRadius,
                      background:
                        sender === 'human'
                          ? theme.palette.ai.backgroundSecondary
                          : null,
                      color: theme.palette.text.primary,
                      textAlign: sender === 'human' ? 'right' : 'left',
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 1,
                        pb: '8px !important',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {sender === 'bot' && (
                        <Icon
                          variantName="ai"
                          color="url(#gradient1)"
                          style={{ marginTop: '12px', minWidth: '24px' }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          lineHeight: '24px',
                          fontSize: '14px',
                          fontFamily: (theme) =>
                            (theme.typography as any).manrope,
                          wordBreak: sender === 'human' ? 'break-word' : '',
                          overflowWrap: sender === 'human' ? 'break-word' : '',
                          whiteSpace: sender === 'human' ? 'pre-wrap' : '',
                        }}
                      >
                        {sender === 'bot' ? (
                          <Markdown>{value}</Markdown>
                        ) : (
                          value
                        )}
                      </Typography>
                      {/* 📊 Renderizar Chart con react-plotly.js */}
                      {sender === 'bot' &&
                        hasArtifact?.chart?.data &&
                        hasArtifact?.chart?.layout && (
                          <Box
                            mt={2}
                            sx={{
                              width: '100%',
                              height: '100%',
                              overflow: 'hidden',
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 500,
                                lineHeight: '24px',
                                fontSize: '14px',
                                fontFamily: (theme) =>
                                  (theme.typography as any).manrope,
                              }}
                            >
                              {hasArtifact?.chart?.layout?.title?.text}
                            </Typography>
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                              }}
                            >
                              <Plot
                                data={hasArtifact?.chart.data}
                                layout={{
                                  ...hasArtifact?.chart.layout,
                                  autosize: false,
                                  width: 400,
                                  height: '100%',
                                  margin: { l: 40, b: 40 },
                                  title: {},
                                  legend: {
                                    orientation: 'h',
                                    xanchor: 'center',
                                    x: 0,
                                    y: -0.2,
                                  },
                                }}
                                config={{ responsive: false }}
                              />
                            </div>
                          </Box>
                        )}

                      {/* 🖼️ Renderizar imagen base64 */}
                      {sender === 'bot' &&
                        hasArtifact?.type === 'image' &&
                        hasArtifact.image && (
                          <Box mt={2}>
                            <img
                              src={`data:image/png;base64,${hasArtifact.image}`}
                              alt="Generated"
                              style={{ maxWidth: '100%', borderRadius: 8 }}
                            />
                          </Box>
                        )}
                    </CardContent>
                    {sender === 'bot' && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          mt: 0.5,
                        }}
                      >
                        <Button
                          size="small"
                          iconSize="small"
                          variant="text"
                          icon={copiedIndex === index ? 'check' : 'copy'}
                          iconColor={
                            copiedIndex === index
                              ? theme.palette.success.main
                              : theme.palette.action.default
                          }
                          hastitle={false}
                          onClick={() => {
                            navigator.clipboard.writeText(value);
                            setCopiedIndex(index);
                            setTimeout(() => {
                              setCopiedIndex(null);
                            }, 3000);
                          }}
                          sx={{
                            padding: 0,
                            minWidth: '24px',
                            height: '24px',
                            fontSize: '12px',
                          }}
                        />
                      </Box>
                    )}
                  </Card>
                </Box>
              ) : (
                <Box
                  key={metadata || index}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <AnimationAI color="fracttal" />
                  <Typography
                    color={theme.palette.text.secondary}
                    sx={{
                      fontWeight: 400,
                      lineHeight: '20px',
                      fontSize: '14px',
                    }}
                  >
                    {metadata?.events && metadata.events.length > 0
                      ? `${t(metadata.events[metadata.events.length - 1].t)}...`
                      : null}
                  </Typography>
                </Box>
              );
            },
          )}
          <div ref={bottomRef} style={{ height: 1 }} />
        </Box>
      )}
    </Box>
  );
};

export default Messages;
