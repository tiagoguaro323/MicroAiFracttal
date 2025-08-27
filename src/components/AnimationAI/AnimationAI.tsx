import React from 'react';
import { useTheme } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import { AIAnimation, WandAnimation } from 'constants/FracttalAI';

interface IProps {
  color?: 'main' | 'secondary' | 'fracttal' | 'ai';
  variant?: 'ai' | 'wand';
}

const AnimationAI = React.memo<IProps>(({ color = 'main', variant = 'ai' }) => {
  const theme = useTheme();
  const colors = {
    main: 'brightness(0) invert(1)',
    secondary: 'grayscale(1) brightness(0.7)',
    fracttal:
      'invert(38%) sepia(88%) saturate(526%) hue-rotate(194deg) brightness(102%) contrast(96%)',
    ai: 'invert(20%) sepia(96%) saturate(7000%) hue-rotate(210deg) brightness(80%) contrast(90%)',
  };

  return (
    <Player
      autoplay
      loop
      src={variant === 'ai' ? AIAnimation : WandAnimation}
      style={{
        height: theme.spacing(3),
        width: theme.spacing(3),
        filter: colors[color] || colors.main,
      }}
    />
  );
});

export default AnimationAI;
