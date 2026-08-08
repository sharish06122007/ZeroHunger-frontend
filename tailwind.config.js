/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#14532D', // Deep Forest Green
          secondary: '#198754', // Emerald Green
          light: '#DFF3E4', // Light Green
          bg: '#F7FAF7', // Very Light Background
          accent: '#F59E0B', // Saffron
          cream: '#FFF8E7', // Warm Cream
          text: '#172018', // Dark Text
          muted: '#5F6B61', // Secondary Text
          border: '#E2E8E3', // Border
          white: '#FFFFFF', // White
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
