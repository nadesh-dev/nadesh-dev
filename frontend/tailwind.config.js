/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        dark: {
          50: '#282828',
          100: '#181818',
          200: '#121212',
          300: '#000000',
        }
      }
    },
  },
  plugins: [],
}
