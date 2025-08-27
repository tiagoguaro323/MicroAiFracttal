import { useState, useRef } from 'react';
import { io } from 'socket.io-client';
import JWT from 'core/services/JWT';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useNative } from 'fracttal-core';
import LanguageOptions from 'constants/LanguageOptions';
import { useTranslation } from 'react-i18next';
import useEnvAI from './useEnvAI';

const offset = new Date().getTimezoneOffset();

interface Props {
  query?: any;
  onEvent: (name: string, data: any) => void;
}

export type EventData = {
  event: string;
  data: any;
};

const getLanguageDescription = (currentLanguage: string) => {
  const found = LanguageOptions.find(
    (option) => option.value === currentLanguage,
  );
  return found ? found.description : currentLanguage;
};

export default function useSocket(props?: Props) {
  const [transcript, setTranscript] = useState<string>('');
  const { host: HOST } = useEnvAI();
  const { query = {}, onEvent } = props || {};
  const isNative = useNative();
  const token = JWT.getToken();
  const { i18n } = useTranslation();
  const currentLanguage = getLanguageDescription(i18n.language);

  const socketRef = useRef(
    !isNative
      ? io(`${HOST}`, {
          path: '/chat/ws',
          reconnectionDelayMax: 10000,
          transports: ['websocket'],
          autoConnect: false,
        })
      : io(`wss://${HOST.replace('https://', '')}/`, {
          path: '/chat/ws',
          reconnectionDelayMax: 10000,
          transports: ['websocket'],
          autoConnect: false,
        }),
  );
  const socket = socketRef.current;
  const [isConnected, setIsConnected] = useState(socket?.connected || false);

  useDeepCompareEffect(() => {
    socket.io.opts.query = query;
    socket.auth = {
      token: `Bearer ${token}`,
    };

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect(reason: any) {
      setIsConnected(false);
      console.log('Desconectado:', reason);
    }

    function onError() {
      window.location.href = '/signin';
    }

    function onEventServer({ event, data }: { event: string; data: any }) {
      onEvent && onEvent(event, data);
    }

    function onTrancript({ data }: { data: string }) {
      setTranscript(data);
    }

    socket.on('connect', onConnect);
    socket.on('error', onError);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onEventServer);
    socket.on('transcript', onTrancript);

    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('error', onError);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onEventServer);
      socket.off('transcript', onTrancript);
    };
  }, [token, query]);

  const sendData = (eventName: string, data: any) => {
    socket.emit(eventName, {
      ...data,
      type: 'human',
      offset: -1 * offset,
      language: currentLanguage,
    });
  };
  const sendStop = (conversationID: string) => {
    socket.emit('stop_process', { conversation_id: conversationID });
  };

  const sendAudio = (audio: any) => {
    socket.emit('transcript', { audio });
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return { isConnected, sendData, sendAudio, sendStop, disconnect, transcript };
}
