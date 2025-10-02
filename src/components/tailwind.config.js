module.exports = {
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#7E22CE',
          light:   '#9D4EDD',
          dark:    '#5B21B6'
        }
      },
      animation: {
        'fade-out': 'fadeOut 0.5s ease-out forwards'
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.9)' }
        }
      }
    }
  },
  plugins: []
}
