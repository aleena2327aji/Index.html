/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#2E7D32',
          earth: '#795548',
          wheat: '#FBC02D',
        }
      }
    },
  },
  plugins: [],
};
