/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#173B2B',
          50: '#EAF2EE',
          100: '#D2E4DC',
          200: '#A6C9B9',
          300: '#73A98F',
          400: '#4A8A6B',
          500: '#2E6E4F',
          600: '#1F5740',
          700: '#173B2B',
          800: '#102920',
          900: '#0A1A14',
        },
        accent: {
          DEFAULT: '#FF9F1C',
          50: '#FFF6E9',
          100: '#FFE9C7',
          200: '#FFD38A',
          300: '#FFBA4D',
          400: '#FFA82A',
          500: '#FF9F1C',
          600: '#E0840E',
          700: '#B5680A',
          800: '#7E480A',
          900: '#4D2C06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,41,32,0.08), 0 8px 24px rgba(16,41,32,0.06)',
        glow: '0 8px 30px rgba(255,159,28,0.25)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        popIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out both',
        popIn: 'popIn 0.25s ease-out both',
        slideUp: 'slideUp 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
