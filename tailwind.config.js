/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f172a', // The deep background blue
        'brand-gold': '#fbbf24', // The yellow/gold from your screenshots
        'brand-gold-hover': '#d97706',
      }
    },
  },
  plugins: [],
}