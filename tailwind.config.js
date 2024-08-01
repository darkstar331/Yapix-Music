/** @type {import('tailwindcss').Config} */
import animated from 'tailwindcss-animated'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#A69F93',
        color1: '#222222',
        color2: '#083B2F',
        border: '#434D4F',
        colordarkg: '#988F80'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to top, #000000 0%, #083B2F 18%)',
        'custom-gradientb': 'linear-gradient(to top, #000000 0%, #083B2F 19%)',
      },
    },
  },
  plugins: [
    animated
  ],
}