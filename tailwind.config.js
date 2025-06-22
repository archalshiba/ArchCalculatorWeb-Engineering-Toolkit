/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'body': ['Inter', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#006d77',
          600: '#005a63',
          700: '#004d56',
          800: '#003d45',
          900: '#002e35',
        },
        secondary: {
          50: '#fefcf6',
          100: '#fdf8ec',
          200: '#f9eed4',
          300: '#f4e0aa',
          500: '#e9d8a6',
          600: '#d4c285',
          700: '#b8a56e',
          800: '#9c8a5a',
          900: '#83734b',
        },
        background: '#f7f5f2',
        accent: {
          50: '#fef6f4',
          100: '#feeae6',
          200: '#fdd8d1',
          300: '#fbbfb3',
          500: '#ee6c4d',
          600: '#e8523a',
          700: '#d43f2a',
          800: '#b03426',
          900: '#912e25',
        },
        surface: {
          light: '#ffffff',
          dark: '#1f2937',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};