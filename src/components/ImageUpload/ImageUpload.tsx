import React, { FC, useState, useEffect } from 'react';
import {
  CircularProgress
} from '@mui/material';


const IMG_DEFAULT =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

const cached: string[] = [];

interface IPropsImg {
  src: any;
  width?: number | string;
  height?: number | string;
}

export function Img({ src = '', width = 'auto', height = 'auto' }: IPropsImg) {
  const [loadSrc, setLoadSrc] = useState(IMG_DEFAULT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (src && src !== '') {
      if (cached.includes('src')) {
        setLoadSrc(src);
      } else {
        const i = new Image();
        i.onload = () => {
          setLoadSrc(src);
          setLoading(false);
          cached.push(src);
        };
        i.onerror = () => {
          setLoadSrc(IMG_DEFAULT);
          setLoading(false);
        };
        i.src = src;
        setLoading(true);
      }
    } else {
      setLoadSrc(IMG_DEFAULT);
    }
  }, [src]);

  if (loading) {
    return <CircularProgress />;
  }
  return <img width={width} height={height} src={loadSrc} />;
}

