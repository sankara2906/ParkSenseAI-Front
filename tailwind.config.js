/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#050816',
        bgSec: '#0B1120',
        cardBg: 'rgba(255, 255, 255, 0.05)',
        primaryNeon: '#00E5FF',
        accentBlue: '#3B82F6',
        textMain: '#F8FAFC',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 229, 255, 0.5)',
        'neon-blue-lg': '0 0 30px rgba(0, 229, 255, 0.7)',
        'neon-glow': '0 0 25px rgba(59, 130, 246, 0.6)',
      },
    },
  },
  plugins: [],
}
