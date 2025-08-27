import React, { FC, useEffect, useRef, useState } from 'react';
import { Typography, useTheme, Box, Card, CardContent } from '@mui/material';
import { Button, Icon } from 'designSystem';
import { AnimationAI } from 'components';
import Markdown from 'react-markdown';
import { IMessage } from 'hooks/FracttalAI/useAgentAI';
import { useTranslation } from 'react-i18next';
import { Player } from '@lottiefiles/react-lottie-player';
import { useMobile } from 'hooks';
import Plot from 'react-plotly.js';
import iconIaLight from './icon-IA-light.json';
import iconIaDark from './icon-IA-dark.json';
import SignedImage from './SignedImage';

interface IProps {
  messages: IMessage[];
  loading?: boolean;
}

const MemoPlayer = React.memo(() => {
  const muiTheme = useTheme();
  return (
    <Player
      autoplay
      loop
      src={muiTheme.palette.mode === 'dark' ? iconIaDark : iconIaLight}
      style={{
        height: muiTheme.spacing(16),
        width: muiTheme.spacing(16),
      }}
    />
  );
});

const Messages: FC<IProps> = ({ messages, loading }) => {
  const theme = useTheme();
  const isMobile = useMobile();
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isFirstRender ? 'auto' : 'smooth',
      block: 'end',
    });
    if (isFirstRender) setIsFirstRender(false);
  }, [messages, isFirstRender]);

  return !loading ? (
    <Box
      display="flex"
      flexDirection="column"
      mt="auto"
      gap={1}
      sx={{
        width: '100%',
        overflowY: 'auto',
      }}
    >
      {messages.map(({ value, sender, metadata, image, artifact }, index) => {
        const hasArtifact = artifact;
        const hasValue = typeof value === 'string' && value.trim() !== '';

        return hasValue ? (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={value + index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: sender === 'human' ? 'flex-end' : 'flex-start',
              justifyContent: sender === 'human' ? 'flex-end' : 'flex-start',
              width: '100%',
              height: 'fit-content',
              gap: 1,
            }}
          >
            {sender === 'human' && image && (
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
                maxWidth: sender === 'human' ? '80%' : '600px',
                width: 'fit-content',
                alignSelf: sender === 'human' ? 'flex-end' : 'flex-start',
                borderRadius: theme.shape.borderRadius,
                background:
                  sender === 'human'
                    ? theme.palette.ai.backgroundSecondary
                    : theme.palette.background.paper,
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
                  gap: 1,
                }}
              >
                {sender === 'bot' && (
                  <Icon
                    variantName="ai"
                    color={theme.palette.ai.primary}
                    style={{ marginTop: '12px', minWidth: '24px' }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '14px',
                    fontFamily: (theme) => (theme.typography as any).manrope,
                    wordBreak: sender === 'human' ? 'break-word' : '',
                    overflowWrap: sender === 'human' ? 'break-word' : '',
                    whiteSpace: sender === 'human' ? 'pre-wrap' : '',
                    userSelect: 'text !important',
                    '*': {
                      userSelect: 'text !important',
                    },
                  }}
                >
                  {sender === 'bot' ? <Markdown>{value}</Markdown> : value}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '14px',
                    fontFamily: (theme) => (theme.typography as any).manrope,
                  }}
                >
                  {hasArtifact?.chart?.layout?.title?.text}
                </Typography>
                {/* 📊 Renderizar Chart con react-plotly.js */}
                {sender === 'bot' &&
                  hasArtifact?.chart?.data &&
                  hasArtifact?.chart?.layout && (
                    <Box mt={2}>
                      <Plot
                        data={hasArtifact?.chart.data}
                        layout={{
                          ...hasArtifact?.chart.layout,
                          autosize: false,
                          width: '100%',
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
                        config={{ responsive: true }}
                        style={{ width: '100%', height: '100%' }}
                      />
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
                    ml: 1,
                  }}
                >
                  <Button
                    size="small"
                    iconSize="small"
                    variant="secondary_ai"
                    icon={copiedIndex === index ? 'check' : 'copy'}
                    iconColor={
                      copiedIndex === index
                        ? theme.palette.success.main
                        : theme.palette.ai.primary
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
              sx={{ fontWeight: 400, lineHeight: '20px', fontSize: '14px' }}
            >
              {metadata?.events && metadata.events.length > 0
                ? `${t(metadata.events[metadata.events.length - 1].t)}...`
                : null}
            </Typography>
          </Box>
        );
      })}

      <div ref={bottomRef} style={{ height: 1 }} />
    </Box>
  ) : (
    <Box height="-webkit-fill-available" alignContent="center">
      <MemoPlayer />
    </Box>
  );
};

export default Messages;
