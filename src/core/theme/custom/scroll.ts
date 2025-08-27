const base = {
  '::-webkit-scrollbar': {
    width: 7,
    height: 7,
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '@media screen and (max-width: 480px)': {
    '::-webkit-scrollbar': {
      width: 5,
      height: 5,
    },
  },
};

export const dark = {
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(152, 152, 152, 0)',
    borderRadius: 10,
    boxShadow: 'rgba(49, 49, 49, 0.3) 0 0 0 1px',
  },
  ':hover::-webkit-scrollbar-thumb': {
    background: 'rgba(152, 152, 152, 0.45)',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(152, 152, 152, 0.55)',
  },
};

export const light = {
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(0,0,0,0.0)',
    borderRadius: 10,
    boxShadow: 'rgba(256, 256, 256, 0.3) 0 0 0 1px',
  },
  ':hover::-webkit-scrollbar-thumb': {
    background: 'rgba(0,0,0,0.45)',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0,0,0,0.55)',
  },
};

export default base;
