/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2E2F33',
        'main-dark-bg': '#222126',
        'light-bg': '#F3F3F3',
      }
    },
  },
  plugins: [],
}
