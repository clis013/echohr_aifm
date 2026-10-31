/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coursie: {
          primary: '#5455EE',
          primaryHover: '#4546DF',
          primaryLight: '#EEF0FF',
          primaryDark: '#3A3BAF',
          canvas: '#F4F5FA',
          card: '#FFFFFF',
          border: '#EBECEF',
          darkWidget: '#12132A',
        },
        sidebar: {
          bg: '#FFFFFF',
          border: '#EBECEF',
          text: '#0F172A',
          muted: '#64748B',
          active: '#5455EE',
        },
        main: {
          bg: '#F4F5FA',
          card: '#FFFFFF',
          border: '#EBECEF',
          subtle: '#F1F3F9',
        },
        brand: {
          dark: '#0F172A',
          primary: '#5455EE',
          blue: '#5455EE',
          teal: '#0D9488',
          orange: '#F97316',
          terracotta: '#E05A36',
        },
        pastel: {
          blueBg: '#EFF6FF',
          blueBorder: '#DBEAFE',
          blueText: '#1D4ED8',
          roseBg: '#FFF1F2',
          roseBorder: '#FFE4E6',
          roseText: '#BE123C',
          amberBg: '#FFFBEB',
          amberBorder: '#FEF3C7',
          amberText: '#B45309',
          emeraldBg: '#F0FDF4',
          emeraldBorder: '#DCFCE7',
          emeraldText: '#047857',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '28px',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        hover: '0 12px 28px -4px rgba(84, 85, 238, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        primaryGlow: '0 8px 24px -4px rgba(84, 85, 238, 0.35)',
        modal: '0 25px 60px -15px rgba(15, 23, 42, 0.25)',
      }
    },
  },
  plugins: [],
}
