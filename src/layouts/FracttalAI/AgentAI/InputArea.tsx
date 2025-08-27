import React, { FC } from 'react';
import { TextField, Typography, useTheme, Paper, Box } from '@mui/material';
import { ButtonIcon } from 'designSystem';
import { agentInfo, AgentsType, ContextTypeAI } from 'constants/FracttalAI';
import { useTranslation } from 'react-i18next';

interface IProps {
  agentType: AgentsType;
  contextType: ContextTypeAI;
  message: string;
  ableToSend: boolean;
  handleSend: (e: React.KeyboardEvent | React.MouseEvent) => void;
  setNewMessage: (message: string) => void;
}

const InputArea: FC<IProps> = ({
  agentType,
  contextType,
  message,
  ableToSend,
  handleSend,
  setNewMessage,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <TextField
          multiline
          className="qa-input-ai"
          fullWidth
          maxRows={4}
          value={message}
          autoComplete="off"
          placeholder={
            agentInfo[agentType].placeholder && contextType === 'list'
              ? t(agentInfo[agentType].placeholder)
              : t('HOW_CAN_I_HELP_YOU')
          }
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && ableToSend) {
              handleSend(e);
            }
          }}
          sx={{
            zIndex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.shape.borderRadius / 2,
              height: '96px',
              transition: 'box-shadow 0.3s ease',
              '& .MuiOutlinedInput-inputMultiline': {
                paddingBottom: '32px',
                // marginBottom: '56px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: '0px 0px 25px 0px rgba(136, 0, 194, 0.30);',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: `1px solid ${theme.palette.primary.main}`,
                borderWidth: 1,
                boxShadow: '0px 0px 25px 0px rgba(136, 0, 194, 0.30);',
              },
              '& textarea': {
                height: '-webkit-fill-available!important',
                paddingBottom: '16px!important',
                marginBottom: '30px',
                overflow: 'scroll!important',
              },
              fontFamily: (theme) => (theme.typography as any).manrope,
            },
          }}
        />

        {/* Íconos alineados abajo */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none', // permite escribir sobre el input
          }}
        >
          {/* Izquierda */}
          <Box sx={{ display: 'flex', gap: 1, pointerEvents: 'auto' }}>
            <ButtonIcon
              icon="clip"
              onClick={() => {}}
              title="Adjuntar"
              sx={{
                zIndex: 2,
              }}
              iconColor={theme.palette.ai.primary}
            />
            <ButtonIcon
              icon="camera"
              onClick={() => {}}
              title="Foto"
              sx={{
                zIndex: 2,
              }}
              iconColor={theme.palette.ai.primary}
            />
          </Box>

          {/* Derecha */}
          <Box sx={{ display: 'flex', gap: 1, pointerEvents: 'auto' }}>
            <ButtonIcon
              variant="secondary_ai"
              iconColor={theme.palette.ai.primary}
              icon="wave"
              onClick={() => {}}
              sx={{ zIndex: 2 }}
            />
            <ButtonIcon
              variant="main_ai"
              onClick={handleSend}
              disabled={!ableToSend}
              sx={{
                zIndex: 2,
              }}
              icon="send_ai"
            />
          </Box>
        </Box>
      </Box>
      <Typography
        variant="caption"
        color={theme.palette.text.disabled}
        display="block"
        sx={{ textAlign: 'center', width: '100%', margin: '4px auto 0px' }}
      >
        {t('FRACTTAL_AI_DISCLAIMER')}
      </Typography>
    </Paper>
  );
};

export default InputArea;
