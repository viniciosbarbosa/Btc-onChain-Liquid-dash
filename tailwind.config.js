/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btc: {
          orange: '#F7931A',
          gold: '#FFD700',
          dark: '#0D1117',
          card: '#161B22',
          border: '#30363D',
          muted: '#8B949E',
          accent: '#238636'
        },
        liquid: {
          cyan: '#00F2FE',
          blue: '#4FACFE',
          dark: '#051329',
          card: '#0B2240',
          border: '#1E3A5F',
          accent: '#00C8FF'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glow-btc': '0 0 20px rgba(247, 147, 26, 0.25)',
        'glow-liquid': '0 0 20px rgba(0, 242, 254, 0.25)'
      }
    },
  },
  plugins: [],
}
