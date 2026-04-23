/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        kawaii: {
          bg:       '#fff0f8',
          bg2:      '#f5eeff',
          card:     '#ffffff',
          pink:     '#f472b6',
          pink2:    '#ec4899',
          lavender: '#c084fc',
          mint:     '#6ee7b7',
          peach:    '#fda4af',
          yellow:   '#fde68a',
          border:   '#fbcfe8',
          text:     '#4a1942',
          muted:    '#9d6fa0',
        },
      },
      boxShadow: {
        kawaii: '0 4px 20px rgba(244, 114, 182, 0.2)',
        'kawaii-lg': '0 8px 30px rgba(244, 114, 182, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};
