/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    backgroundColor: {
      'ncsured': "#CC0000",
      'ncsured2': "#990000",
      'ncsuorange': "#D14905",
      'ncsuyellow': "#FAC800",
      'ncsugreen': "#6F7D1C",
      'ncsublue': "#427E93",
      'ncsuaqua': "#008473",
      'ncsuindigo': "#4156A1"
    },
    extend: {},
  },
  plugins: [],
}