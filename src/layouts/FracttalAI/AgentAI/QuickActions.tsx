import React, { FC } from 'react';
import { useTheme, Box } from '@mui/material';
import { Button } from 'designSystem';
import { useTranslation } from 'react-i18next';
import { ContextTypeAI } from 'constants/FracttalAI';

interface IProps {
  ableToSend: boolean;
  handleSendButton: (msg: string) => void;
  contextType: ContextTypeAI;
}

const QuickActions: FC<IProps> = ({
  contextType,
  ableToSend,
  handleSendButton,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {contextType === 'detail' && (
        <>
          <Button
            title={t('QUICK_ACTIONS_AI_1')}
            variant="text"
            className="qa-option1-fracttal-ai"
            size="large"
            onClick={() => handleSendButton(t('QUICK_ACTIONS_AI_1'))}
            disabled={!ableToSend}
            sx={{
              borderRadius: theme.shape.borderRadius / 2,
              backgroundColor: theme.palette.action.background,
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: '20px',
              justifyContent: 'flex-start',
              textAlign: 'left',
            }}
          />
          <Button
            title={t('QUICK_ACTIONS_AI_2')}
            variant="text"
            className="qa-option2-fracttal-ai"
            size="large"
            onClick={() => handleSendButton(t('QUICK_ACTIONS_AI_2'))}
            disabled={!ableToSend}
            sx={{
              borderRadius: theme.shape.borderRadius / 2,
              backgroundColor: theme.palette.action.background,
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: '20px',
              justifyContent: 'flex-start',
              textAlign: 'left',
            }}
          />
          <Button
            title={t('QUICK_ACTIONS_AI_3')}
            variant="text"
            className="qa-option3-fracttal-ai"
            size="large"
            onClick={() => handleSendButton(t('QUICK_ACTIONS_AI_3'))}
            disabled={!ableToSend}
            sx={{
              borderRadius: theme.shape.borderRadius / 2,
              backgroundColor: theme.palette.action.background,
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: '20px',
              justifyContent: 'flex-start',
              textAlign: 'left',
            }}
          />
        </>
      )}
    </Box>
  );
};

export default QuickActions;
