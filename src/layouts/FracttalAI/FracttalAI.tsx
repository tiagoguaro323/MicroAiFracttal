/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo } from 'react';
import { Button, Icon } from 'designSystem';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import AgentAI from 'layouts/FracttalAI/AgentAI';
import AnimationAI from 'components/AnimationAI';
import {
  AI_COMPANY_IDS,
  AgentsType,
  ContextTypeAI,
} from 'constants/FracttalAI';
import store from 'store';
import { useTheme } from '@mui/material';
import { useMobile } from 'fracttal-core';
// import { useLocation } from 'react-router-dom';
import setCurrentContextAi from 'store/contextAi/action';
import i18n from 'i18next';
import TalkingAi from './AgentAI/TalkingAi';

interface IFracttalAI {
  open: boolean;
  handleOpenAI: (any) => void;
  agentType: AgentsType;
  contextType: ContextTypeAI;
  conversationID?: string;
  selectedAgent?: string;
  // detailInfo?: string;
  customButton?: React.ReactNode;
  hasTitle?: boolean;
  theme?: any;
}

const FracttalAI: FC<IFracttalAI> = (props) => {
  const {
    open,
    agentType,
    conversationID,
    contextType,
    customButton,
    selectedAgent,
    // detailInfo,
    handleOpenAI,
    hasTitle = true,
    theme: propTheme,
  } = props;
  const dispatch = useDispatch();
  const { pathname } = window.location;
  const isMobile = useMobile();
  const themeInner = useTheme();
  const theme = propTheme || themeInner;
  const isDark = theme.palette.mode === 'dark';
  const color = isDark ? '#D36DFF' : '#7030D2';
  const defaultID = uuidv4();
  const { company } = store.getState().auth;
  const auth = useSelector((state: any) => state.auth);
  const { addons } = auth;

  useEffect(() => {
    if (propTheme?.i18n) {
      i18n.changeLanguage(propTheme?.i18n.language);
    }
  }, [propTheme]);

  const showAddon = useMemo(
    () =>
      AI_COMPANY_IDS.includes(company.id) &&
      addons.filter(
        (addon: any) =>
          addon.description === 'BOT_ARTIFICIAL_INTELLIGENCE' && addon.added,
      ).length > 0,
    [addons, company.id],
  );

  const title = useMemo(() => {
    if (hasTitle) {
      if (agentType === 'GENERAL') {
        return 'AI Remote';
      }
      return 'AI Agent Remote';
    }
    return '';
  }, [agentType, hasTitle]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ButtonAI = useMemo(() => {
    if (customButton) {
      return customButton;
    }
    return (
      <Button
        className="qa-fracttal-ai"
        variant="main_ai"
        onClick={() => handleOpenAI((prev) => !prev)}
        title={hasTitle && !isMobile ? title : undefined}
        sx={{
          '& span': {
            margin: hasTitle && !isMobile ? undefined : 0,
          },
          minWidth: isMobile ? 40 : undefined,
          width: isMobile ? 40 : undefined,
          height: 40,
          color: theme.palette.content.main,
          marginRight: 1,
        }}
        startIcon={
          agentType === 'GENERAL' ? (
            <AnimationAI />
          ) : (
            <Icon
              variantName="wand_ai"
              color={theme.palette.ai.primary}
              size="medium"
            />
          )
        }
      />
    );
  }, [
    agentType,
    color,
    customButton,
    handleOpenAI,
    hasTitle,
    isMobile,
    theme.palette.ai.primary,
    title,
  ]);

  useEffect(() => {
    dispatch(setCurrentContextAi(null));
  }, [pathname]);

  if (!showAddon) return null;

  return (
    <>
      {ButtonAI}
      {open && (
        <AgentAI
          agentType={agentType}
          contextType={contextType}
          conversationID={conversationID || defaultID}
          selectedAgent={selectedAgent}
          // detailInfo={detailInfo}
          onClose={() => handleOpenAI((prev) => !prev)}
        />
      )}
      <TalkingAi />
    </>
  );
};

export default FracttalAI;
