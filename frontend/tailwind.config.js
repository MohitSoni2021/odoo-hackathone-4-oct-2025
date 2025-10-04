/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#333333',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#2E8B57', // Sea Green
          light: '#3CB371',
          dark: '#006400',
        },
        neutral: {
          light: '#F5F5F5',
          DEFAULT: '#E0E0E0',
          dark: '#A0A0A0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}