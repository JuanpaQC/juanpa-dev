/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌑 Modo oscuro
        'dark-background': '#0D1B2A',
        'dark-surface': '#0A1520',
        'dark-accent': '#00F6ED',
        'dark-text': '#E5E5E5',
        'dark-subtle': '#94A3B8',
        'dark-border': '#112B3C',
        'dark-border-mac': '#1e1e1e',

        // 📖 Modo claro tipo libro
        'light-background': '#F5F0E6',
        'light-surface': '#FAF8F4',
        // Era #008275: 4.15:1 sobre el fondo crema, que falla AA en textos de 14 px
        // (píldoras de filtro, enlaces). Mismo verde, un punto más oscuro -> 5.81:1.
        'light-accent': '#00695E',
        'light-accent-hover': '#2FA49B',
        'light-text': '#3A3A2D',
        'light-subtle': '#6B665D',
        'light-border': '#DAD2C5',
        // Borde con contraste suficiente para controles (WCAG 1.4.11 exige 3:1).
        // 'light-border' se queda para separadores decorativos.
        'light-border-strong': '#8C8375',

        black: '#000000',
      },
      fontFamily: {
        press: ['"Press Start 2P"', 'cursive'],
        pixel: ['"VT323"', 'monospace'],
        orbiton: ['"Orbitron"', 'sans-serif'],
        exo : ['"Exo 2"', 'sans-serif'],
        share : ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
