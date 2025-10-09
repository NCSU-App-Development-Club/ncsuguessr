/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ncsured: '#CC0000',
        ncsured2: '#990000',
        primary: '#CC0000',
        primarylight: '#F20000',
        primarydark: '#A60000',
        secondarydark: '#4A4A4A',
        alternate: '#0066CC',
        ncsuorange: '#D14905',
        ncsuyellow: '#FAC800',
        ncsugreen: '#6F7D1C',
        ncsublue: '#427E93',
        ncsuaqua: '#008473',
        ncsuindigo: '#4156A1',
        ncsuwhite: '#FFFFFF',
        ncsublack: '#000000',
        gray: '#333333',
      },
      boxShadow: {
        button: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
