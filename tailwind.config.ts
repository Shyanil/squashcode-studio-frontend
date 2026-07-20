import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d8efff',
          500: '#1784d1',
          600: '#0c68ad',
          700: '#0b528c',
          950: '#082943',
        },
        ink: '#101828',
      },
      boxShadow: {
        soft: '0 14px 45px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

