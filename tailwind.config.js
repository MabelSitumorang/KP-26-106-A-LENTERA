/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // ─── Material Design 3 Color System ──────────────────────────────────
      colors: {
        'on-secondary':                '#ffffff',
        'tertiary':                    '#1e3749',
        'secondary-fixed':             '#d1e4ff',
        'secondary-fixed-dim':         '#9ecaff',
        'inverse-on-surface':          '#eff1f3',
        'on-secondary-fixed':          '#001d36',
        'error-container':             '#ffdad6',
        'surface-container-low':       '#f2f4f6',
        'inverse-surface':             '#2d3133',
        'surface-container':           '#eceef0',
        'primary':                     '#00375e',
        'on-primary-fixed-variant':    '#184974',
        'surface-container-high':      '#e6e8ea',
        'on-background':               '#191c1e',
        'on-primary-fixed':            '#001d35',
        'primary-fixed':               '#d1e4ff',
        'on-error':                    '#ffffff',
        'outline-variant':             '#c2c7d0',
        'primary-container':           '#1f4e79',
        'error':                       '#ba1a1a',
        'secondary-container':         '#7cbaff',
        'on-error-container':          '#93000a',
        'tertiary-fixed-dim':          '#b0cae0',
        'inverse-primary':             '#a0cafc',
        'secondary':                   '#0b61a1',
        'on-surface':                  '#191c1e',
        'background':                  '#f7f9fb',
        'surface-container-highest':   '#e0e3e5',
        'on-primary-container':        '#95bff1',
        'outline':                     '#72777f',
        'tertiary-fixed':              '#cce6fd',
        'on-tertiary':                 '#ffffff',
        'surface-container-lowest':    '#ffffff',
        'surface-dim':                 '#d8dadc',
        'on-tertiary-container':       '#a5bfd5',
        'on-tertiary-fixed-variant':   '#31495c',
        'primary-fixed-dim':           '#a0cafc',
        'on-tertiary-fixed':           '#011e2f',
        'surface-bright':              '#f7f9fb',
        'on-secondary-fixed-variant':  '#00497c',
        'tertiary-container':          '#354e61',
        'on-primary':                  '#ffffff',
        'surface-tint':                '#35618d',
        'surface-variant':             '#e0e3e5',
        'on-surface-variant':          '#42474f',
        'surface':                     '#f7f9fb',
        'on-secondary-container':      '#004a7d',
      },

      // ─── Border Radius (Material Design 3 scale) ─────────────────────────
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        full:    '0.75rem',
      },

      // ─── Spacing (Layout tokens) ──────────────────────────────────────────
      spacing: {
        'gutter':             '24px',
        'stack-md':           '16px',
        'container-padding':  '32px',
        'stack-sm':           '8px',
        'sidebar-width':      '280px',
        'header-height':      '64px',
      },

      // ─── Font Family ──────────────────────────────────────────────────────
      fontFamily: {
        'body-md':     ['Inter', 'sans-serif'],
        'data-mono':   ['Inter', 'sans-serif'],
        'display-lg':  ['Inter', 'sans-serif'],
        'label-md':    ['Inter', 'sans-serif'],
        'body-lg':     ['Inter', 'sans-serif'],
        'headline-sm': ['Inter', 'sans-serif'],
        'display-md':  ['Inter', 'sans-serif'],
      },

      // ─── Font Size (Type scale) ───────────────────────────────────────────
      fontSize: {
        'body-md':     ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'data-mono':   ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '500' }],
        'display-lg':  ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'label-md':    ['13px', { lineHeight: '18px', fontWeight: '600' }],
        'body-lg':     ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'display-md':  ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
    },
  },

  plugins: [],
}
