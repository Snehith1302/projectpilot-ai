/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0F17',
        darkCard: '#1E293B',
        darkCardTransparent: 'rgba(30, 41, 59, 0.45)',
        accentIndigo: '#6366f1',
        accentViolet: '#8b5cf6',
        accentCyan: '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
