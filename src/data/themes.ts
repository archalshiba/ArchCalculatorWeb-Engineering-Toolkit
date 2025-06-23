import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#006d77',
      secondary: '#e9d8a6',
      accent: '#ee6c4d',
      background: '#f7f5f2'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      primary: '#0077be',
      secondary: '#00a8cc',
      accent: '#0096c7',
      background: '#f0f8ff'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      primary: '#2d5016',
      secondary: '#4a7c59',
      accent: '#6a994e',
      background: '#f7fdf4'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      primary: '#d62828',
      secondary: '#f77f00',
      accent: '#fcbf49',
      background: '#fff8f0'
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      primary: '#5a189a',
      secondary: '#7b2cbf',
      accent: '#9d4edd',
      background: '#faf7ff'
    }
  }
];