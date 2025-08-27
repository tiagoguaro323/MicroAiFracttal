import { useState } from 'react';
import useSocket from './useSocketAI';

export interface IMessage {
  sender: 'bot' | 'human';
  type: 'text' | 'chart';
  value: string;
  metadata?: any;
  image?: string;
  artifact?: any;
}
interface useAgentAIProps {
  workflowID: string;
  conversationID?: string;
  selectedAgent?: string;
}

const useAgentAI = ({
  workflowID,
  conversationID,
  selectedAgent,
}: useAgentAIProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const { isConnected, sendData, sendAudio, transcript } = useSocket({
    query: {
      workflow_id: workflowID,
      conversation_id: conversationID,
      selectedAgent,
    },
    onEvent: (name, data) => {
      if (name === 'nodes') {
        const router = (data || []).find((item: any) => item.source === '1');
        if (router) {
          setAgents(data.filter((item: any) => item.source === router.id));
        } else {
          setAgents([]);
        }
      } else if (name === 'start') {
        setIsTyping(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            type: 'text',
            value: '',
            metadata: { events: [] },
          },
        ]);
      } else if (name === 'metadata') {
        updateLastMessage((prev: any) => ({
          ...prev,
          metadata: {
            events: [...(prev.metadata?.events ?? []), data],
          },
        }));
      } else if (name === 'stream') {
        setIsTyping(true);
        updateLastMessage((prev: any) => ({
          ...prev,
          value: `${prev.value}${data}`,
        }));
      } else if (name === 'end') {
        setIsTyping(false);
      } else if (name === 'artifact') {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            type: 'text',
            value: data?.content,
            artifact: data?.artifact,
          },
        ]);
      }
    },
  });

  const updateLastMessage = (callback: (data: any) => any) => {
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].sender === 'bot') {
        const lastIndex = prev.length - 1;
        const newMessages = [...prev];
        newMessages[lastIndex] = callback(prev[lastIndex]);
        return newMessages;
      }
      return [
        ...prev,
        {
          sender: 'bot',
          type: 'text',
          value: '',
        },
      ];
    });
  };

  return {
    isConnected,
    isTyping,
    messages,
    agents,
    sendData,
    sendAudio,
    setMessages,
    transcript,
  };
};

export default useAgentAI;
