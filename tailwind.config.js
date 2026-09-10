/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:          '#f8f7fc',
          bg2:         '#f0eff6',
          white:       '#ffffff',
          dark:        '#252428',
          text:        '#1c1b20',
          muted:       '#6b6880',
          border:      '#e2dff0',
          teal:        '#15cea9',
          'teal-dark': '#0fa68a',
          pink:        '#ff779c',
          'pink-dark': '#e5617f',
          cyan:        '#2bbece',
          'cyan-dark': '#1a9eab',
          'cyan-light': '#55F6FF',
          purple:      '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['"Archivo Black"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
