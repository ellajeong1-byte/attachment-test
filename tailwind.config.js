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
        ivory: '#F6EFED',
        sand: '#EAE0DE',
        plum: '#6E4A56',
        sage: '#A8808A',
        blush: '#C08A94',
        charcoal: '#2C2626',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Noto Sans KR"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
