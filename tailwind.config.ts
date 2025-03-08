/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode via a class (e.g., 'dark')
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './lib/components/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo-600
        secondary: '#7C3AED', // Purple-600
      },
    },
  },
  plugins: [],
};