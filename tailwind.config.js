/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a1a1a', // Or your preferred dark hex code (e.g. #0f172a)
          gold: '#fbbf24', // This matches standard Tailwind yellow-400
        }
      }
    },
  },
  plugins: [],
}