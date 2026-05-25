/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg0: 'var(--bg-0)',
        bg1: 'var(--bg-1)',
        bg2: 'var(--bg-2)',
        bgCard: 'var(--bg-card)',
        bgGlass: 'var(--bg-glass)',
        borderBase: 'var(--border)',
        borderActive: 'var(--border-active)',
        brandGreen: 'var(--green)',
        brandRed: 'var(--red)',
        brandAmber: 'var(--amber)',
        brandCyan: 'var(--cyan)',
        text1: 'var(--text-1)',
        text2: 'var(--text-2)',
        text3: 'var(--text-3)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 15px var(--green))' },
        }
      }
    },
  },
  plugins: [],
}
