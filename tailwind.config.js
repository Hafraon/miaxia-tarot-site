/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkblue: '#0a1128',
        purple: '#4a1a74',
        gold: '#d4af37',
        accent: '#c92b2b'
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Raleway', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flip': 'flip 1s ease-in-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(180deg)', opacity: '1' },
        }
      },
    },
  },
  plugins: [],
};