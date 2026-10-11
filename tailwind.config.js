/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        ivory: '#F5F0EB',
        sand: '#E8E3DD',
        forest: '#3D4B3D',
        sage: '#6B8F71',
        gold: '#B8956A',
        charcoal: '#2C2C2C',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Noto Sans KR"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
