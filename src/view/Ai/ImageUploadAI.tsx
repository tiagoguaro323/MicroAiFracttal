import React, { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, useTheme } from '@mui/material';
import { ButtonIcon } from 'designSystem';
import useEnvAI from 'hooks/FracttalAI/useEnvAI';
import { fetchApiAI } from 'hooks/FracttalAI/useRequestAI';
import { useMobile } from 'hooks';

interface IProps {
  conversationID: string;
  file: any;
  setFile: (file: any) => void;
}

const ImageUploadAI: FC<IProps> = ({ conversationID, file, setFile }) => {
  const { host: HOST } = useEnvAI();
  const theme = useTheme();
  const isMobile = useMobile();
  const [endpoint, setEndpoint] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selected = acceptedFiles[0];
        const extension = selected.name?.split('.').pop();
        const preview = URL.createObjectURL(selected);

        // Guardamos solo el preview temporalmente
        setFile({
          file: selected,
          preview,
          publicUrl: null,
        });

        setEndpoint(
          `${HOST}/chat/conversation/presigned-url/?conversation_id=${conversationID}&extension=${extension}`,
        );
      }
    },
  });

  useEffect(() => {
    if (file?.file && endpoint) {
      handleFileUpload(file.file);
    }
  }, [file?.file, endpoint]);

  const handleFileUpload = async (fileToUpload: File) => {
    try {
      const response = await fetchApiAI({
        method: 'GET',
        url: endpoint || '',
      });

      const data = await response.json();
      const { url, fields } = data;

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', fileToUpload);

      const uploadRes = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.status === 204) {
        const publicUrl = data.public_url || `${url}/${fields.key}`; // ajusta si es necesario
        setFile((prev) => ({
          ...prev,
          publicUrl,
        }));
      } else {
        const err = await uploadRes.text();
        console.error('Upload error:', err);
      }
    } catch (e) {
      console.error('Upload failed:', e);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Box {...getRootProps()}>
        <input {...getInputProps()} />
        <ButtonIcon
          icon={isMobile ? 'camera' : 'clip'}
          title="Adjuntar"
          sx={{ zIndex: 2 }}
          iconColor={theme.palette.ai.primary}
        />
      </Box>
    </Box>
  );
};

export default ImageUploadAI;
