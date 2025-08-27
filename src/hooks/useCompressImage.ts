import { useCallback } from 'react';
import Compressor from 'compressorjs';
import { Capacitor } from '@capacitor/core';
import imageCompression from 'browser-image-compression';

export default function useCompressImage() {
  const isIos = Capacitor.getPlatform() === 'ios';

  const isFileImage = useCallback((file: any) => {
    return file && file.type.split('/')[0] === 'image';
  }, []);

  const compress = useCallback(
    (file: any) => {
      if (isFileImage(file)) {
        if (isIos) {
          return comprimirFile(file);
        }
        return new Promise<Blob>((resolve, reject) => {
          // eslint-disable-next-line no-new
          new Compressor(file, {
            quality: 0.5,
            success: resolve,
            error: reject,
          });
        });
      }
      return file;
    },
    [isFileImage, isIos],
  );

  const comprimirFile = async (file) => {
    try {
      const options = {
        maxSizeMB: 2, // (default: Number.POSITIVE_INFINITY)
        maxWidthOrHeight: 800,
      };
      const image = await imageCompression(file, options);
      return image;
    } catch (err) {
      return file;
    }
  };

  return compress;
}
