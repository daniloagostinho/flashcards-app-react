/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#FF7F50', // Coral
        secondary: '#6A5ACD', // Slate Blue
      },
      gradientColorStops: {
        'game-start': '#FF7F50',
        'game-end': '#6A5ACD',
      },
      boxShadow: {
        glow: '0px 4px 15px rgba(106, 90, 205, 0.7)',
      },
    },
  },
  plugins: [],
}

