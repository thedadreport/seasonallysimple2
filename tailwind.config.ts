import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // War Kitchen-inspired color palette
        sage: {
          50: '#f6f7f4',
          100: '#e8eee2',
          200: '#d2dcc6',
          300: '#b3c4a1',
          400: '#87a96b',
          500: '#6b8e5a',
          600: '#537145',
          700: '#425a37',
          800: '#36492f',
          900: '#2e3e29',
        },
        brown: {
          50: '#faf7f0',
          100: '#f3ebda',
          200: '#e6d4b4',
          300: '#d6b885',
          400: '#c49959',
          500: '#b7813a',
          600: '#8b4513',
          700: '#753c1f',
          800: '#613220',
          900: '#522b1f',
        },
        cream: '#fff8dc',
        charcoal: '#36454f',
        clay: '#c4a57b',
        olive: '#708238',
        rust: '#b7410e',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config