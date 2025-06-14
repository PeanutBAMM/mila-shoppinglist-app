/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Mila brand colors
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#45B7D1",
        warning: "#FFA07A",
        success: "#98FB98",
        error: "#FF6B6B",
        // Neutral colors
        background: "#F8F9FA",
        surface: "#FFFFFF",
        text: "#2C3E50",
        textLight: "#7F8C8D",
      },
    },
  },
  plugins: [],
}
