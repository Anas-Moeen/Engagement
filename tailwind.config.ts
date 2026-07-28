import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B241C',
          deep: '#071812',
          moss: '#123A2C',
          mist: '#2C5445',
        },
        gold: {
          DEFAULT: '#C8A96A',
          soft: '#DFC894',
          deep: '#9C7F45',
        },
        cream: '#F7F1E5',
        paper: '#FDFBF7',
      },
      fontFamily: {
        // Amiri — a Naskh with real calligraphic contrast, for headings only.
        display: ['var(--font-display)', 'Amiri', 'Times New Roman', 'serif'],
        // IBM Plex Sans Arabic — a Kufi-leaning UI face that stays legible small.
        sans: ['var(--font-body)', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid scale. Arabic leading is deliberately looser than the Latin
        // original: tight line-heights clip the descenders on ج ح خ and the
        // dots below ب ي, which is the fastest way to make Arabic look cheap.
        // Letter-spacing is never applied to Arabic — it breaks the joins.
        eyebrow: ['0.75rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'display-sm': ['clamp(1.9rem, 7.5vw, 3rem)', { lineHeight: '1.55' }],
        'display-md': ['clamp(2.5rem, 10vw, 4.5rem)', { lineHeight: '1.45' }],
        'display-lg': ['clamp(3rem, 13vw, 6.5rem)', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '1.75rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,24,18,.04), 0 18px 48px -24px rgba(7,24,18,.28)',
        lift: '0 2px 4px rgba(7,24,18,.05), 0 32px 64px -28px rgba(7,24,18,.4)',
      },
      backgroundImage: {
        'gold-leaf':
          'linear-gradient(104deg, #9C7F45 0%, #C8A96A 26%, #F2E2BC 48%, #C8A96A 72%, #9C7F45 100%)',
      },
      keyframes: {
        draw: { to: { strokeDashoffset: '0' } },
        drift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.06)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        draw: 'draw 2.4s cubic-bezier(.16,1,.3,1) forwards',
        shimmer: 'shimmer 7s linear infinite',
        float: 'float 5s ease-in-out infinite',
        drift: 'drift 22s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
