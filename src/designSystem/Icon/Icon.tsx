/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTheme } from '@mui/material';
import VARIANTS, { temp } from './variants';

export const ICON_VARIANTS: typeof VARIANTS = VARIANTS;
export type LIcon = (typeof temp)[number];

const SIZES: any = {
  small: '16',
  medium: '24',
  large: '32',
  xlarge: '48',
  xxlarge: '64',
};

export const ICON_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
  xxlarge: 'xxlarge',
};

type IconProps = {
  className?: string;
  variantName?: LIcon | undefined;
  size?: keyof typeof SIZES;
  color?: string;
  disabled?: boolean;
  variant?:
    | 'outlined'
    | 'contained'
    | 'text'
    | 'tonal'
    | 'main_ai'
    | 'secondary_ai'
    | 'agent_ai';
  style?: React.CSSProperties;
};

const Icon: React.FC<IconProps> = ({
  className,
  variantName = 'unlink',
  variant = 'text',
  size = 'medium',
  color,
  disabled = false,
  style,
}) => {
  const theme = useTheme();
  const IconVariant = ICON_VARIANTS[variantName];
  const realColor = color ?? theme.palette.primary.main;
  const disableColor = theme.palette.text.disabled;
  const isGradient = typeof color === 'string' && color.startsWith('url(');

  // Mapear las variantes a sx
  const variantSx: Record<string, any> = {
    outlined: {
      '& > path': {
        fill: theme.palette.primary.main,
      },
      '&.disabled > path': {
        fill: theme.palette.text.disabled,
      },
    },
    contained: {
      '& > path': {
        fill: theme.palette.background.paper,
      },
      '&.disabled > path': {
        fill: theme.palette.text.disabled,
      },
    },
    tonal: {
      '& > path': {
        fill: theme.palette.primary.main,
      },
      '&.disabled > path': {
        fill: theme.palette.text.disabled,
      },
    },
    text: {
      '& > path': {
        fill: theme.palette.primary.main,
      },
      '&.hoverFocus > path': {
        fill: theme.palette.content.main,
      },
      '&.disabled > path': {
        fill: theme.palette.text.disabled,
      },
    },
    ai: {
      '&&&&& > path': {
        fill: `${theme.palette.ai.primary} !important`,
      },
      '&&&&&:hover > path': {
        fill: `${theme.palette.ai.primary} !important`,
      },
      '.MuiButton-root:hover &&&&& > path': {
        fill: `${theme.palette.ai.primary} !important`,
      },
    },
  };

  return (
    <svg
      className={`${!IconVariant?.notChangeColor ? 'ico' : ''} ${
        className ?? ''
      } ${disabled ? 'disabled' : ''}`}
      width={SIZES[size]}
      height={SIZES[size]}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      data-info={variantName}
      style={{
        ...style,
        ...(variant ? variantSx[variant] : variantSx.text),
        ...(isGradient ? variantSx.ai : {}),
      }}
    >
      {IconVariant?.path ? (
        IconVariant.path.map((data: any) => {
          if (!IconVariant?.notChangeColor) {
            data.fill = disabled ? disableColor : realColor;
          }
          return <path key={data.d} {...data} />;
        })
      ) : (
        <path {...IconVariant} fill={disabled ? disableColor : realColor} />
      )}
      <defs>
        <linearGradient
          id="gradient1"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="25%" stopColor="#044EC6" />
          <stop offset="90%" stopColor="#00C7FF" />
        </linearGradient>
        <linearGradient
          id="gradient2"
          x1="-0.257143"
          y1="17.7272"
          x2="19.2111"
          y2="1.41098"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.25" stopColor="#007AFF" />
          <stop offset="0.9" stopColor="#00E4FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Icon;
