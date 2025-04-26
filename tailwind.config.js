/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury color palette
        gold: {
          DEFAULT: '#CFAB5B',
          50: '#F8F4EA',
          100: '#F1E8D3',
          200: '#E6D5AA',
          300: '#DCBF81',
          400: '#CFAB5B', // Main gold
          500: '#C39A3C',
          600: '#A77E31',
          700: '#866527',
          800: '#644C1D',
          900: '#433214',
          dark: '#A77E31',
        },
        navy: {
          DEFAULT: '#1A2B40',
          50: '#E6EBF0',
          100: '#CDD7E0',
          200: '#9BAEC1',
          300: '#6985A3',
          400: '#415C7F',
          500: '#1A2B40', // Main navy
          600: '#162535',
          700: '#121F2A',
          800: '#0D1A20',
          900: '#091015',
          dark: '#162535',
        },
        burgundy: {
          DEFAULT: '#7E243C',
          50: '#F4E7EB',
          100: '#E9D0D7',
          200: '#D3A1B0',
          300: '#BC7388',
          400: '#A64461',
          500: '#7E243C', // Main burgundy
          600: '#6F1F34',
          700: '#5F1A2D',
          800: '#501625',
          900: '#40111E',
          dark: '#6F1F34',
        },
        cream: {
          DEFAULT: '#F9F5EB',
          50: '#FEFCF9',
          100: '#FCF9F3',
          200: '#F9F5EB', // Main cream
          300: '#EFE3CA',
          400: '#E6D2AA',
          500: '#DCB779',
          600: '#D09D47',
          700: '#AC7D2E',
          800: '#7F5C22',
          900: '#533C16',
        },
        charcoal: {
          DEFAULT: '#333333',
          50: '#F5F5F5',
          100: '#EBEBEB',
          200: '#D1D1D1',
          300: '#B8B8B8',
          400: '#9E9E9E',
          500: '#858585',
          600: '#6B6B6B',
          700: '#525252',
          800: '#333333', // Main charcoal
          900: '#222222',
          dark: '#222222',
        },
        // Keep primary as gold for backward compatibility
        primary: {
          DEFAULT: '#CFAB5B',
          50: '#F8F4EA',
          100: '#F1E8D3',
          200: '#E6D5AA',
          300: '#DCBF81',
          400: '#CFAB5B', // Main gold
          500: '#C39A3C',
          600: '#A77E31',
          700: '#866527',
          800: '#644C1D',
          900: '#433214',
        },
        // Keep secondary as navy for backward compatibility
        secondary: {
          DEFAULT: '#1A2B40',
          50: '#E6EBF0',
          100: '#CDD7E0',
          200: '#9BAEC1',
          300: '#6985A3',
          400: '#415C7F',
          500: '#1A2B40', // Main navy
          600: '#162535',
          700: '#121F2A',
          800: '#0D1A20',
          900: '#091015',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};