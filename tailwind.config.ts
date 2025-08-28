import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css', // Include your styles folder for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        // Brand-aligned color palette
        sage: {
          50: '#f6f8f5',
          100: '#e8f0e5',
          200: '#d1e1cc',
          300: '#aecaa5',
          400: '#84ad78',
          500: '#6b9460', // Primary sage green
          600: '#527648',
          700: '#425f3a',
          800: '#374e32',
          900: '#2f422b',
        },
        cream: {
          50: '#fefdf9',
          100: '#fef9f0',
          200: '#fdf1db',
          300: '#fbe5b8',
          400: '#f7d085',
          500: '#f2c464', // Golden honey accent
          600: '#e5a838',
          700: '#d18b1e',
          800: '#a86d1a',
          900: '#8a571a',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fbeae3',
          200: '#f6d4c7',
          300: '#efb59e',
          400: '#e58d6f',
          500: '#d97654', // Soft terracotta primary
          600: '#c4583c',
          700: '#a04831',
          800: '#84402e',
          900: '#6d382b',
        },
        navy: {
          50: '#f4f6f7',
          100: '#e3e8eb',
          200: '#cad4d9',
          300: '#a5b7c0',
          400: '#7994a0',
          500: '#5e7785', // Muted navy
          600: '#516471',
          700: '#46545e',
          800: '#3e4951',
          900: '#373e45',
        },
        copper: {
          50: '#fdf6f0',
          100: '#faebe0',
          200: '#f4d4be',
          300: '#eab692',
          400: '#de9364',
          500: '#d47343', // Copper metallic accent
          600: '#c25d32',
          700: '#a04a2b',
          800: '#823d28',
          900: '#6a3324',
        },
        // Warm, nurturing base colors
        warmCream: '#fcf9f4', // Background warm cream
        softWhite: '#fefefe',
        warmGray: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        'display': ['ui-serif', 'Georgia', 'serif'], // For headings - warm, approachable
        'body': ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'], // Clean, readable
      },
      boxShadow: {
        'warm': '0 4px 14px 0 rgba(215, 118, 67, 0.15)', // Terracotta shadow
        'sage': '0 4px 14px 0 rgba(107, 148, 96, 0.15)', // Sage shadow
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;