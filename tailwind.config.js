/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F3EC',
        'ivory-deep': '#EFE8DD',
        navy: '#172A3A',
        'navy-soft': '#22394B',
        terracotta: '#C9684B',
        'terracotta-deep': '#B0563B',
        olive: '#607A61',
        sun: '#E7B84B',
        coral: '#E99A86',
        muted: '#6D6257',
        'muted-soft': '#8C8175'
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        micro: '0.22em',
        wide2: '0.14em'
      },
      borderRadius: {
        card: '28px',
        pill: '999px'
      },
      boxShadow: {
        glass: '0 18px 50px -22px rgba(23,42,58,0.38), inset 0 1px 0 rgba(255,255,255,0.55)',
        lift: '0 30px 70px -34px rgba(23,42,58,0.55)',
        soft: '0 14px 40px -26px rgba(23,42,58,0.45)'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        'scroll-dot': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(18px)', opacity: '0' }
        }
      },
      animation: {
        'slow-zoom': 'slow-zoom 14s cubic-bezier(0.22,1,0.36,1) forwards',
        float: 'float 6s ease-in-out infinite',
        'scroll-dot': 'scroll-dot 1.9s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
