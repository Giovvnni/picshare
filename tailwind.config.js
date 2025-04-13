/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      fontFamily: {
        pixelcute: ['"Pixelify Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse 2s infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
