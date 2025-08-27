type ColorKeys =
  | 'red1'
  | 'red2'
  | 'red3'
  | 'purple1'
  | 'purple2'
  | 'purple3'
  | 'blue1'
  | 'blue2'
  | 'blue3'
  | 'sky1'
  | 'sky2'
  | 'sky3'
  | 'aqua1'
  | 'aqua2'
  | 'aqua3'
  | 'green1'
  | 'green2'
  | 'green3'
  | 'yellow1'
  | 'yellow2'
  | 'yellow3'
  | 'brown1'
  | 'brown2'
  | 'brown3'
  | 'gray1'
  | 'gray2'
  | 'gray3'
  | 'purple4'
  | 'aqua4'
  | 'blue4';

type IColor = {
  [key in ColorKeys]?: string;
};

export interface IBiColorMap {
  general: IColor;
  disabled: string;
}

export const bi: Omit<IBiColorMap, 'disabled'> = {
  general: {
    // Red
    red1: '#FF1744',
    red2: '#FF8A80',
    red3: '#FFCDD2',
    // Purple
    purple1: '#4A148C',
    purple2: '#9575CD',
    purple3: '#B39DDB',
    // Blue
    blue1: '#2979FF',
    blue2: '#64B5F6',
    blue3: '#90CAF9',
    // Sky
    sky1: '#00B8D4',
    sky2: '#84FFFF',
    sky3: '#80DEEA',
    // Aqua
    aqua1: '#00BFA5',
    aqua2: '#A7FFEB',
    aqua3: '#80CBC4',
    // Green
    green1: '#00C853',
    green2: '#B9F6CA',
    green3: '#A5D6A7',
    // Yellow
    yellow1: '#FFAB00',
    yellow2: '#FFD180',
    yellow3: '#FFECB3',
    // Brown
    brown1: '#3E2723',
    brown2: '#A1887F',
    brown3: '#D7CCC8',
    // Gray
    gray1: '#616161',
    gray2: '#9E9E9E',
    gray3: '#E0E0E0',
  },
};

// Colores fuera de la paleta de colores de BI (Figma)
export const biLight: IBiColorMap = {
  disabled: '#BDBDBD',
  general: {
    blue4: '#AFCBF9',
    purple4: '#E5D1FF',
    aqua4: '#C0EEEB',
  },
};

export const biDark: IBiColorMap = {
  disabled: '#6B6D71',
  general: {
    blue4: '#3D5276',
    purple4: '#624D85',
    aqua4: '#367473',
  },
};
