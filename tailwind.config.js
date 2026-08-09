/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#7743DB', // Primary Purple
          secondary: '#C3ACD0', // Secondary Lavender
          surface: '#F7EFE5', // Surface
          bg: '#FFFBF5', // Warm Background
          accent: '#06B6D4', // Cyan
          blue: '#2563EB', // Blue
          success: '#22C55E', // Success
          warning: '#F59E0B', // Warning
          danger: '#EF4444', // Danger
          text: '#1A1A1A', // Primary Text
          muted: '#5B5B6A', // Secondary Text
          border: '#E8DDD3', // Border
          white: '#FFFFFF', // White
          dark: '#111827', // Dark
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(119, 67, 219, 0.08)',
        'card': '0 12px 32px -8px rgba(119, 67, 219, 0.12)',
      }
    },
  },
  plugins: [],
};
