/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Collapse,
  Drawer,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { useMobile } from 'hooks';
import { ButtonIcon } from 'designSystem';
import useRequestAI from 'hooks/FracttalAI/useRequestAI';
import useAgentAI from 'hooks/FracttalAI/useAgentAI';
import useEnvAI from 'hooks/FracttalAI/useEnvAI';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import setCurrentConversationID from 'store/conversation/action';
import { useDepsEffect } from 'hooks';
import { useDebounce } from 'use-debounce';
import clsx from 'clsx';
import InputAi from 'components/Ai/InputAi';
import ChatHistory from './ChatHistory';
import Messages from './Messages';
import Empty from './Empty';

const useStyles = makeStyles((theme) =>
  createStyles({
    sidebar: {
      height: '100%',
      borderRadius: 8,
      position: 'relative',
      boxShadow: 'none',
      backgroundColor: theme.palette.background.paper,
      backgroundImage: 'none',
    },
    mainContent: {
      padding: 16,
      height: '100%',
      width: '100%',
      borderRadius: 8,
      boxShadow: 'none',
      backgroundColor: theme.palette.background.paper,
      backgroundImage: 'none',
    },
    optionButton: {
      padding: 12,
      textAlign: 'center',
      borderRadius: 12,
      width: '100%',
    },
    drawerPaper: {
      marginTop: 68,
      borderRadius: 8,
      width: '-webkit-fill-available',
      display: 'flex',
      flexDirection: 'column',
      margin: 8,
      overflowY: 'hidden',
    },
  }),
);

const Ai: FC = () => {
  const currentConversationID = useSelector(
    (state: any) => state.currentConversationID.id,
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const isMobile = useMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [conversationID, setConversationID] = useState(
    currentConversationID || uuidv4(),
  );
  const [isMultiSelectMode, setisMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [message, setNewMessage] = useState('');
  const [ableToSend, setAbleToSend] = useState(false);
  const [messagesSnapshot, setMessagesSnapshot] = useState('');
  const [debouncedSnapshot] = useDebounce(messagesSnapshot, 500);
  const theme = useTheme();

  const { workflowID } = useEnvAI('GENERAL');
  const {
    isConnected,
    isTyping,
    messages,
    sendData,
    sendAudio,
    setMessages,
    transcript,
  } = useAgentAI({
    conversationID,
    workflowID,
  });

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  // Obtener vista previa de conversaciones
  const { data: previewConversations, exec: runPreview } = useRequestAI({
    endpoint: 'conversation/preview/',
    method: 'GET',
  });

  useEffect(() => {
    runPreview({ query: { workflow_id: workflowID } });
  }, []);

  const { exec: deleteConversation, loading: isDeleting } = useRequestAI({
    endpoint: 'conversation/',
    method: 'DELETE',
  });

  // Obtener una conversación específica
  const {
    data: conversationInfo,
    exec: getConversation,
    loading,
  } = useRequestAI({
    method: 'GET',
    endpoint: 'conversation/list/',
  });

  const updateHistoryChat = useCallback(
    (conversationID: string) => {
      dispatch(setCurrentConversationID(conversationID));
      setConversationID(conversationID);
      getConversation({
        query: { conversation_id: conversationID },
      });
    },
    [dispatch, getConversation],
  );

  useEffect(() => {
    if (currentConversationID !== undefined) {
      getConversation({
        query: { conversation_id: conversationID },
      });
    }
  }, []);

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
    setAbleToSend(isConnected && !isTyping);
  }, [isConnected, isTyping]);

  const handleSend = async (event: any, message: any, image?: any) => {
    event.preventDefault();
    if (!message.trim()) return;

    let content = message;
    if (messages.length === 0) {
      content = `${content}`;
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
        image: image || '',
      },
    ]);
    setNewMessage('');
    if (conversationID !== currentConversationID) {
      dispatch(setCurrentConversationID(conversationID));
    }
  };

  const handleSendButton = useCallback(
    (msg: string) => {
      sendData('message', {
        content: msg,
        conversation_id: conversationID,
      });
      setMessages((prev: any[]) => [
        ...prev,
        { sender: 'human', type: 'text', value: msg },
      ]);
    },
    [conversationID, sendData],
  );

  useEffect(() => {
    const minimalSnapshot = JSON.stringify(
      messages.map((msg) => ({
        value: msg.value,
        sender: msg.sender,
      })),
    );

    setMessagesSnapshot(minimalSnapshot);
  }, [messages]);

  useEffect(() => {
    if (debouncedSnapshot) {
      runPreview({ query: { workflow_id: workflowID } });
    }
  }, [debouncedSnapshot]);

  useDepsEffect(() => {
    dispatch(setCurrentConversationID(conversationID));
  }, [message]);

  const handleNewConversation = useCallback(() => {
    if (isMobile) {
      setShowSidebar(false);
    }
    const newConversationID = uuidv4();
    setConversationID(newConversationID);
    dispatch(setCurrentConversationID(newConversationID));
    setMessages([]);
    setNewMessage('');
  }, [dispatch, setMessages]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(
        selectedItems.map((id) =>
          deleteConversation({ query: { conversation_id: id } }),
        ),
      );
      setisMultiSelectMode(false);
      setSelectedItems([]);
      runPreview({ query: { workflow_id: workflowID } });
    } catch (error) {
      console.error('Error deleting conversations:', error);
    }
  }, [selectedItems]);

  const SidebarContent = useMemo(
    () => (
      <Paper elevation={2} className={classes.sidebar}>
        <Box
          height={56}
          boxShadow="0px 3px 8px 0px rgba(0, 0, 0, 0.10);"
          sx={{
            paddingBottom: 1,
            paddingTop: 1,
            paddingLeft: 2,
            paddingRight: 1,
            gap: '4px',
          }}
        >
          <Grid container sx={{ placeContent: 'space-between' }}>
            <Grid item sx={{ alignContent: 'center' }}>
              <Typography
                variant="body2"
                align="left"
                fontFamily={(theme) => (theme.typography as any).manrope}
              >
                Últimas busquedas
              </Typography>
            </Grid>
            <Grid item sx={{ display: 'flex' }}>
              {isMultiSelectMode && selectedItems.length > 0 && !isDeleting && (
                <ButtonIcon
                  onClick={() => handleDeleteSelected()}
                  icon="delete"
                  variant="text"
                  iconColor={theme.palette.error.main}
                />
              )}
              {isDeleting && (
                <Box
                  height={40}
                  width={40}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}

              <ButtonIcon
                onClick={() => setisMultiSelectMode((prev) => !prev)}
                icon="multi_select"
                variant="text"
                iconColor={theme.palette.ai.primary}
              />
              <ButtonIcon
                onClick={() => setShowSidebar(false)}
                icon="sidebar"
                variant="text"
                iconColor={theme.palette.ai.primary}
              />
              {messages.length > 0 && showSidebar && !isMobile && (
                <ButtonIcon
                  onClick={handleNewConversation}
                  icon="content_edit"
                  variant="text"
                  iconColor={theme.palette.ai.primary}
                />
              )}
            </Grid>
          </Grid>
        </Box>
        <Box padding={1}>
          <ChatHistory
            setShowSidebar={setShowSidebar}
            previewConversations={previewConversations || []}
            updateHistoryChat={updateHistoryChat}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            isMultiSelectMode={isMultiSelectMode}
          />
        </Box>
      </Paper>
    ),
    [
      classes.sidebar,
      isMultiSelectMode,
      selectedItems,
      theme.palette.error.main,
      theme.palette.ai.primary,
      messages.length,
      showSidebar,
      isMobile,
      handleNewConversation,
      previewConversations,
      updateHistoryChat,
    ],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        width: '-webkit-fill-available',
        margin: isMobile ? 0 : -1,
        marginTop: isMobile ? 0.5 : -1,

        fontFamily: (theme) => (theme.typography as any).manrope,
      }}
    >
      {/* Sidebar colapsable */}
      {!isMobile ? (
        <Collapse
          orientation="horizontal"
          in={showSidebar}
          collapsedSize={0}
          sx={{ whiteSpace: 'nowrap' }}
        >
          <Box
            sx={{
              height: '100%',
              width: 350,
            }}
          >
            {SidebarContent}
          </Box>
        </Collapse>
      ) : (
        <Drawer
          anchor="left"
          open={showSidebar}
          onClose={setShowSidebar}
          hideBackdrop
          PaperProps={{
            className: clsx('qa-filters-drawer', classes.drawerPaper),
            elevation: 0,
          }}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Main content (se expande automáticamente) */}
      <Box
        sx={{
          flex: 1,
          marginLeft: showSidebar ? 1 : 0,
        }}
      >
        <Paper
          elevation={2}
          className={classes.sidebar}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            height={56}
            sx={{
              padding: 1,
              gap: '4px',
              width: '-webkit-fill-available',
            }}
          >
            {!showSidebar && (
              <ButtonIcon
                onClick={() => setShowSidebar((prev) => !prev)}
                icon="sidebar"
                variant="text"
              />
            )}
            {messages.length > 0 && !showSidebar && !isMobile && (
              <ButtonIcon
                onClick={handleNewConversation}
                icon="content_edit"
                variant="text"
                iconColor={theme.palette.ai.primary}
              />
            )}
            {messages.length > 0 && !showSidebar && isMobile && (
              <ButtonIcon
                onClick={handleNewConversation}
                icon="content_edit"
                variant="text"
                iconColor={theme.palette.ai.primary}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 1,
              paddingRight: 1,
              width: '100%',
              alignItems: 'stretch',
              maxWidth: 900,
              flex: 1,
              justifyContent: 'space-between',
              overflowY: 'auto',
              flexGrow: 1,
            }}
          >
            {messages.length === 0 ? (
              <Empty messages={messages} handleSendButton={handleSendButton} />
            ) : (
              <Messages messages={messages} loading={loading} />
            )}
            <InputAi
              ableToSend={ableToSend}
              handleSend={handleSend}
              conversationID={conversationID}
              sendAudio={sendAudio}
              isConnected={isConnected}
              transcript={transcript}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Ai;
