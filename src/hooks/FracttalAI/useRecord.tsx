import { useEffect, useRef, useState } from 'react';

const constraintsDefault = {
  video: false,
  audio: true,
};

export default function useRecord({
  silenceThreshold = 10,
  silenceDuration = 1500,
}) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [data, setData] = useState<Blob | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioData, setAudioData] = useState<number[]>(Array(10).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldSaveBlob = useRef<boolean>(true);
  const isRecording = status === 'recording';

  useEffect(() => {
    return () => {
      stopRecording(); // Limpieza al desmontar
    };
  }, []);

  useEffect(() => {
    let animationId: number;

    const analyzeAudio = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const normalizedData = Array.from(dataArrayRef.current)
        .slice(0, 10)
        .map((value) => (value / 255) * 50);
      setAudioData(normalizedData);

      const average =
        normalizedData.reduce((a, b) => a + b, 0) / normalizedData.length;

      if (average < silenceThreshold) {
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            stopRecording();
          }, silenceDuration);
        }
      } else {
        clearTimeout(silenceTimerRef.current!);
        silenceTimerRef.current = null;
      }

      animationId = requestAnimationFrame(analyzeAudio);
    };

    if (isRecording) {
      animationId = requestAnimationFrame(analyzeAudio);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isRecording, silenceThreshold, silenceDuration]);

  const startRecording = async () => {
    try {
      shouldSaveBlob.current = true; // Se debe guardar el audio
      const stream =
        await navigator.mediaDevices.getUserMedia(constraintsDefault);
      mediaStream.current = stream;
      mediaChunks.current = [];

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunks.current.push(event.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        if (shouldSaveBlob.current && mediaChunks.current.length > 0) {
          const blob = new Blob(mediaChunks.current, { type: 'audio/webm' });
          setData(blob);
        } else {
          setData(null);
        }
      };

      mediaRecorder.current.start();
      setStatus('recording');

      // Análisis de audio
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 32;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono.');
    }
  };

  const deleteRecording = () => {
    shouldSaveBlob.current = false;
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
    }

    setData(null);
    setAudioData(Array(10).fill(0));
    setStatus('idle');
    cleanup();
  };

  const stopRecording = () => {
    shouldSaveBlob.current = true;
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
    }
    setData(null);
    setStatus('idle');
    cleanup();
  };

  const pauseRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.pause();
      setStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current?.state === 'paused') {
      mediaRecorder.current.resume();
      setStatus('recording');
    }
  };

  const cleanup = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  return {
    status,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
    data,
    audioData,
  };
}
