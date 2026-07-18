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
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '13.5': '3.375rem',
        '14.5': '3.625rem',
      },
    },
  },
  plugins: [],
}
