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
        sage: {
          50: '#f7f9f7',
          100: '#e9efe9',
          200: '#d2dfd2',
          300: '#b0c5b0',
          400: '#87a987',
          500: '#87a96b',
          600: '#5c7b5c',
          700: '#4a634a',
          800: '#3d503d',
          900: '#344234',
        },
        warmBrown: '#8b4513',
        cream: '#fff8dc',
        charcoal: '#36454f',
        softWhite: '#fafaf8',
        clay: '#c4a57b',
        olive: '#708238',
        rust: '#b7410e',
      },
    },
  },
  plugins: [],
};

export default config;