/* eslint-disable react/no-unstable-nested-components */
import React, { FC, useState } from 'react';
import {
  // Theme,
  Toolbar,
  Typography,
  Avatar,
  useTheme,
  Paper,
  Box,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { ButtonIcon, Icon } from 'designSystem';
import { useTranslation } from 'react-i18next';
import AnimationAI from 'components/AnimationAI';
import { agentInfo, AgentsType } from 'constants/FracttalAI';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSectionKeyFromPath } from './MessagesAi';

interface IProps {
  onClose: () => void;
  agentType: AgentsType;
  handleNewConversation: () => void;
  messages?: any[];
  setagentTypeLocal?: (value: string) => void;
}

const Header: FC<IProps> = ({
  agentType,
  onClose,
  handleNewConversation,
  messages,
  setagentTypeLocal,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectOpen, setSelectOpen] = useState(false);

  const agentTypeLocalDefault =
    getSectionKeyFromPath(location.pathname) || 'GENERAL';

  const toBigAi = () => {
    onClose();
    navigate('/ai');
  };

  const CustomDropdownIcon = () => (
    <span
      style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center' }}
    >
      <Icon
        variantName={selectOpen ? 'arrow_up' : 'arrow_down'}
        size="medium"
        style={{ marginLeft: -25 }}
      />
    </span>
  );

  return (
    <Paper
      className="boxShadow"
      sx={{
        boxShadow: theme.palette.shadowDown.sm,
        zIndex: 1,
      }}
      square
    >
      <Toolbar
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 56,
          px: 1,
          background: theme.palette.background.paper,
        }}
      >
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              background: theme.palette.ai.primary,
            }}
          >
            <AnimationAI
              color="fracttal"
              variant={agentType === 'GENERAL' ? 'ai' : 'wand'}
            />
          </Avatar>

          <Box pt={1}>
            <Typography
              variant="subtitle1"
              sx={{
                flexGrow: 1,
                fontWeight: 400,
                lineHeight: '22px',
                color: theme.palette.text.secondary,
              }}
            >
              Fracttal AI
            </Typography>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={agentTypeLocalDefault}
                variant="standard"
                label="Age"
                IconComponent={CustomDropdownIcon}
                onOpen={() => setSelectOpen(true)}
                onClose={() => setSelectOpen(false)}
                onChange={(e) => {
                  setagentTypeLocal && setagentTypeLocal(e.target.value);
                }}
                sx={{
                  '&::before': { borderBottom: 'none' },
                  '&::after': { borderBottom: 'none' },
                  '&:hover::before': { borderBottom: 'none' },
                  '&:hover::after': { borderBottom: 'none' },
                  '&.MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before':
                    {
                      borderBottom: 'none !important',
                    },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: 'transparent !important',
                    borderRadius: 'inherit !important',
                  },
                  background:
                    'linear-gradient(263deg, #044EC6 0%, #00C7FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {Object.entries(agentInfo).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {t(value.subheader || '')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {messages && messages.length > 0 && (
          <ButtonIcon
            onClick={handleNewConversation}
            icon="content_edit"
            variant="text"
            iconColor={theme.palette.ai.primary}
          />
        )}

        <ButtonIcon
          variant="text"
          className="qa-btn-close-ai"
          title={t('BIG_AI')}
          iconColor={theme.palette.ai.primary}
          onClick={() => toBigAi()}
          icon="full_ai"
        />
        <ButtonIcon
          variant="text"
          className="qa-btn-close-ai"
          title={t('CLOSE')}
          iconColor={theme.palette.ai.primary}
          onClick={() => onClose()}
          icon="close"
        />
      </Toolbar>
    </Paper>
  );
};

export default Header;
