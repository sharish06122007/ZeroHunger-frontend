/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#102A13', // Dark background
          primary: '#1B5E20', // Deep Forest Green
          secondary: '#2E7D32', // Primary Green
          fresh: '#43A047', // Fresh Green
          light: '#A5D6A7', // Light Green
          veryLight: '#E8F5E9', // Very Light Green
          bg: '#F7FAF7', // Background
          accent: '#FF9800', // Bright Orange
          accentWarm: '#F57C00', // Warm Orange
          accentSoft: '#FFF3E0', // Soft Orange
          text: '#172018', // Text
          muted: '#8A958C', // Muted text
          secondaryText: '#5F6B61', // Secondary text
          border: '#E2E8E3', // Border
          card: '#FFFFFF', // Card
          white: '#FFFFFF', // White
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 94, 32, 0.05)',
        'premium': '0 10px 40px -10px rgba(27, 94, 32, 0.08)',
        'float': '0 20px 40px -5px rgba(27, 94, 32, 0.1)',
      }
    },
  },
  plugins: [],
};
