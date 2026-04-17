module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#C8102E',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
