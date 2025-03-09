const defaultTheme = require("tailwindcss/defaultTheme");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        texto: "#253240",
        azulOscuroTitulos: "#05668D",
        azul: "#0A7487",
        logo1: "#05918F",
        logo2: "#05AC9C",
        logo3: "#6BC9BE",
        navBar1: "#65C2C9",
        navBar2: "#41B8D5",
        azulTitulos: "#1E5ACD",
        blanco: "#FFFFFF",
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
