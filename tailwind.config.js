/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6D28D9',
          deep: '#4C1D95',
          indigo: '#4F46E5',
          blue: '#2563EB',
          cyan: '#06B6D4',
          emerald: '#059669',
          success: '#10B981',
          amber: '#F59E0B',
          danger: '#EF4444',
          light: '#FAF9FC',
          warm: '#FFFDF8',
          surface: '#FFFFFF',
          soft: '#F7F5FA',
          textMain: '#111827',
          textSecondary: '#64748B',
          textMuted: '#94A3B8',
          border: '#E5E7EB',
          dark: '#0F172A',
          sidebar: '#111827'
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
