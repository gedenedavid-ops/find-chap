import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: "#4B4FC1",
          green: "#0E8A63",
        },
      },
      fontFamily: {
        sans: ["Sora", "sans-serif"],
        title: ["Arturo-Heavy", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("tailwindcss-animate")],
};
