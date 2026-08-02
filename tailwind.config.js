/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#7743DB',
          hover: '#6332BE',
          secondary: '#C3ACD0',
          bg: '#FFFBF5',
          surface: '#F7EFE5',
          text: '#1A1A1A',
          muted: '#5B5B6A',
          border: '#E8DDD3',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
