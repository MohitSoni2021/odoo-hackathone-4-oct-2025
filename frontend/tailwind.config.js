/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E293B', // Dark Blue / Slate
          light: '#334155',
          dark: '#0F172A',
        },
        secondary: {
          DEFAULT: '#F8FAFC', // Light Background
          dark: '#E2E8F0',
        },
        accent: {
          DEFAULT: '#FF6B3D', // Orange
          dark: '#E05A2E',
        },
        background: '#F1F5F9',
        surface: '#FFFFFF', // Card Background
        border: '#E2E8F0',
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '32px': '32px',
        '40px': '40px',
      },
      fontSize: {
        'h-xl': ['28px', { lineHeight: '36px' }],
        'h-l': ['22px', { lineHeight: '28px' }],
        'h-m': ['18px', { lineHeight: '24px' }],
        'body': ['14px', { lineHeight: '20px' }],
        'small': ['12px', { lineHeight: '16px' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}