/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#ffb3b2",
        "primary-container": "#ff525d",
        "on-primary-container": "#5b000f",
        surface: "#131313",
        "on-surface": "#e5e2e1",
        "surface-variant": "#353534",
        "on-surface-variant": "#e3bebc",
        outline: "#aa8988",
        background: "#0e0e0e",
        "surface-container-lowest": "#0a0a0a",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}