import React, { FC, useCallback, useEffect, useState } from 'react';
import { Theme, Paper, Menu, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useAgentAI from 'hooks/FracttalAI/useAgentAI';
import { AgentsType, ContextTypeAI } from 'constants/FracttalAI';
import useEnvAI from 'hooks/FracttalAI/useEnvAI';
import { useDispatch, useSelector } from 'react-redux';
import setCurrentConversationID from 'store/conversation/action';
import useRequestAI from 'hooks/FracttalAI/useRequestAI';
import { v4 as uuidv4 } from 'uuid';
import InputAi from 'components/Ai/InputAi';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Messages from './Messages';
import { getSectionKeyFromPath } from './MessagesAi';

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    borderRadius: 16,
    '& .MuiMenu-list': {
      padding: '0 !important',
      height: '100%',
      display: 'flex',
    },
    width: `calc(100vw - ${theme.spacing(2)})`,
    maxWidth: 500,
    height: '100%',
    left: 'unset !important',
    right: theme.spacing(1),
    top: `${theme.spacing(9)} !important`,
    maxHeight: `calc(100vh - ${theme.spacing(10)})`,
    [theme.breakpoints.down(450)]: {
      height: '90%',
    },
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IProps {
  agentType: AgentsType;
  contextType: ContextTypeAI;
  conversationID: string;
  selectedAgent?: string;
  // detailInfo?: string;
  onClose: () => void;
}

const AgentAI: FC<IProps> = ({
  agentType,
  contextType,
  conversationID,
  selectedAgent,
  // detailInfo,
  onClose,
}) => {
  const location = useLocation();
  const [agentTypeLocal, setagentTypeLocal] = useState(
    getSectionKeyFromPath(location.pathname) || ('GENERAL' as AgentsType),
  );
  const currentConversationID = useSelector(
    (state: any) => state.currentConversationID.id,
  );

  useEffect(() => {
    if (currentConversationID && agentType === 'GENERAL') {
      getConversation({
        query: { conversation_id: currentConversationID },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationID]);

  const {
    data: conversationInfo,
    exec: getConversation,
    loading,
  } = useRequestAI({
    method: 'GET',
    endpoint: 'conversation/list/',
  });

  const dispatch = useDispatch();
  const context = useSelector((state: any) => state.contextAI.model);

  const { workflowID } = useEnvAI(agentTypeLocal as AgentsType);
  const {
    isConnected,
    isTyping,
    messages,
    sendData,
    setMessages,
    sendAudio,
    transcript,
  } = useAgentAI({
    conversationID,
    workflowID,
    selectedAgent,
  });
  const [message, setNewMessage] = useState('');
  const [ableToSend, setAbleToSend] = useState(false);
  const classes = useStyles();
  const theme = useTheme();

  const transformMessages = useCallback((messages: any[]) => {
    return messages.map((msg) => ({
      sender: msg.type === 'human' ? 'human' : 'bot',
      artifact: msg?.artifact,
      type: 'text',
      image: msg.additional_kwargs?.attachFile || '',
      value: msg.content || '',
      ...(msg.response_metadata?.events
        ? { metadata: { events: msg.response_metadata.events } }
        : {}),
    }));
  }, []);

  useEffect(() => {
    if (
      conversationInfo &&
      Array.isArray(conversationInfo) &&
      conversationInfo.length > 0
    ) {
      const newHistory = transformMessages(conversationInfo);
      setMessages((prev: any) => {
        const isEqual = JSON.stringify(prev) === JSON.stringify(newHistory);
        return isEqual ? prev : newHistory;
      });
    } else {
      setMessages(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationInfo, transformMessages, setMessages]);

  useEffect(() => {
    if (isTyping || !isConnected) {
      setAbleToSend(false);
    } else {
      setAbleToSend(true);
    }
  }, [message, isConnected, isTyping]);

  const handleSend = async (event: any, message: any, image?: any) => {
    event.preventDefault();
    if (!message.trim()) return;

    let content = message;
    if (context) {
      content = `${content} ID: ${context}`;
    }
    sendData('message', {
      content,
      conversation_id: conversationID,
      ...(image && {
        additional_kwargs: {
          attachFile: image,
        },
      }),
    });

    setMessages((prev: any[]) => [
      ...prev,
      {
        sender: 'human',
        type: 'text',
        value: message,
        image,
      },
    ]);
    setNewMessage('');
    if (conversationID !== currentConversationID) {
      dispatch(setCurrentConversationID(conversationID));
    }
  };

  const handleNewConversation = useCallback(() => {
    const newConversationID = uuidv4();
    // setConversationID(newConversationID);
    dispatch(setCurrentConversationID(newConversationID));
    setMessages([]);
    setNewMessage('');
  }, [dispatch, setMessages]);

  return (
    <Menu
      className="qa-insight-ai"
      anchorReference="anchorPosition"
      anchorPosition={{ top: 80, left: window.innerWidth - 520 }}
      open
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      classes={{ paper: classes.menu }}
    >
      <Paper
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          minHeight: 0,
          border: '2px solid transparent',
          borderRadius: 4,
          backgroundImage: `
            linear-gradient(45deg, ${theme.palette.mode === 'dark' ? '#2d2f34' : '#ffffff'}, ${theme.palette.mode === 'dark' ? '#2d2f34' : '#ffffff'}),
            linear-gradient(45deg, #044EC6, #00C7FF)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <Header
          agentType={agentType}
          onClose={onClose}
          handleNewConversation={handleNewConversation}
          messages={messages}
          setagentTypeLocal={setagentTypeLocal}
        />

        <Messages
          messages={messages}
          loading={loading}
          handleSendButton={handleSend}
          contextType={contextType}
          agentType={agentTypeLocal}
        />
        <InputAi
          agentType={agentType}
          contextType={contextType}
          ableToSend={ableToSend}
          handleSend={handleSend}
          conversationID={conversationID}
          sendAudio={sendAudio}
          isConnected={isConnected}
          transcript={transcript}
        />
      </Paper>
    </Menu>
  );
};

export default AgentAI;
