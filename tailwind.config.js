/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: { 50:'#fdfbf0', 100:'#faf3d0', 200:'#f4e48a', 300:'#f0d060', 400:'#e8bc30', 500:'#c9a84c', 600:'#a8862e', 700:'#7a6020', 800:'#4e3c10', 900:'#2a1e06' },
        navy: { 50:'#eef4ff', 100:'#dce9ff', 200:'#b5d0ff', 300:'#7aacff', 400:'#3a81f5', 500:'#1a5fd8', 600:'#1248b0', 700:'#0e3585', 800:'#0a255e', 900:'#080e16' },
        dark: { 100:'#1a2332', 200:'#141c2b', 300:'#0f1620', 400:'#0b1018', 500:'#080e16' }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'counter': 'counter 2s ease forwards',
      },
      keyframes: {
        fadeIn: { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp: { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
