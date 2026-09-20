import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f3',
          100: '#dfeae1',
          200: '#bfd5c3',
          300: '#8fb795',
          400: '#5a8f63',
          500: '#2f6b3d',
          600: '#1B4332',
          700: '#143325',
          800: '#0f251a',
          900: '#0B120B',
        },
        gold: {
          300: '#e7c56b',
          400: '#d9b94a',
          500: '#D4AF37',
          600: '#a8871f',
        },
        pearl: '#F8F9FA',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        luxe: '0 20px 60px -20px rgba(11,18,11,0.55)',
        glow: '0 0 30px rgba(212,175,55,0.25)',
      },
      backgroundImage: {
        'obsidian-gradient':
          'radial-gradient(1200px 800px at 20% -10%, #143325 0%, #0B120B 55%, #050807 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
