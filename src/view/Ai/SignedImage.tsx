import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchApiAI } from 'hooks/FracttalAI/useRequestAI';
import useEnvAI from 'hooks/FracttalAI/useEnvAI';

interface SignedImageProps {
  imageUrl: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: number | string;
}

const SignedImage: React.FC<SignedImageProps> = ({
  imageUrl,
  width = 150,
  height = 150,
  borderRadius = 8,
}) => {
  const { host: HOST } = useEnvAI();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const signImage = async () => {
      setLoading(true);
      try {
        const response = await fetchApiAI({
          method: 'POST',
          url: `${HOST}/chat/conversation/presigned-key/`,
          body: { url: imageUrl },
        });

        const data = await response.json();
        setSignedUrl(data?.presigned_url || null);
      } catch (error) {
        setSignedUrl(null);
      } finally {
        setLoading(false);
      }
    };
    if (imageUrl) {
      signImage();
    }
  }, [HOST, imageUrl]);

  return (
    <>
      {/* Imagen miniatura con preview */}
      <Box
        onClick={() => signedUrl && setOpen(true)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          cursor: signedUrl ? 'pointer' : 'default',
        }}
      >
        {!loading && signedUrl ? (
          <img
            src={signedUrl}
            alt="Signed"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius,
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Modal de preview */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, backgroundColor: 'black' }}>
          <img
            src={signedUrl || ''}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: 'black',
              maxHeight: '80vh',
              margin: '0 auto',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignedImage;
