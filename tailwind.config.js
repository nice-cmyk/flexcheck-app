/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08080F',
        surface: '#111118',
        sidebar: '#0D0D18',
        primary: '#7C3AED',
        'primary-light': '#C084FC',
        accent: '#A855F7',
        gold: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        '4.5