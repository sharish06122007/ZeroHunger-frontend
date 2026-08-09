/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5B21B6',
          purple: '#6D28D9',
          indigo: '#4F46E5',
          emerald: '#059669',
          success: '#10B981',
          gold: '#F59E0B',
          coral: '#F97316',
          danger: '#EF4444',
          nav: '#111827',
          darker: '#0B1120',
          text: '#111827',
          textSec: '#64748B',
          muted: '#94A3B8',
          border: '#E7E5E4',
          borderLight: '#F1F5F9',
          bg: '#F8F7F4',
          bgWarm: '#FFFDF8',
          surface: '#FFFFFF',
          surfaceSec: '#F4F1EA',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #5B21B6, #7C3AED)',
        'gradient-indigo': 'linear-gradient(to right, #6366F1, #8B5CF6)',
        'gradient-emerald': 'linear-gradient(to right, #059669, #10B981)',
        'gradient-impact': 'linear-gradient(to right, #F59E0B, #F97316)',
        'gradient-hero': 'linear-gradient(to right, #4F46E5, #7C3AED, #10B981)',
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
