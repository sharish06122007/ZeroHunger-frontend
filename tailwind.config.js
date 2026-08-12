/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#123524',
          secondary: '#3E7B27',
          accent: '#85A947',
          warm: '#EFE3C2',
          surface: '#FFFFFF',
          dark: '#123524',
          border: '#E5E7EB',
          textMain: '#111827',
          textSecondary: '#64748B',
          textMuted: '#94A3B8',
          success: '#3E7B27',
          warning: '#F59E0B',
          danger: '#EF4444'
        },
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(15, 23, 42, 0.06)',
        'card': '0 12px 32px -8px rgba(15, 23, 42, 0.10)',
      }
    },
  },
  plugins: [],
};
