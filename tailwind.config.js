/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0B0C0F',
          elevated: '#15171C',
          surface: '#1C1F26',
          border: '#262A33',
        },
        text: {
          primary: '#EDE9DE',
          secondary: '#9097A3',
          muted: '#5A616E',
        },
        accent: {
          DEFAULT: '#6E8BFF',
          hover: '#8AA0FF',
          dim: '#3A4A8A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(110, 139, 255, 0.35)',
        soft: '0 8px 30px rgba(0, 0, 0, 0.35)',
        float: '0 16px 48px rgba(0, 0, 0, 0.55)',
        'float-lg': '0 24px 64px rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'fade-in-fast': 'fadeIn 0.18s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up-sm': 'slideUpSm 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUpSm: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.92)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};