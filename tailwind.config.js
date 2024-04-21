/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        txtPrimary: "#000000",
        txtLight: "#38ffef",
        txtDark: "#a16c00",
        bgPrimary: "#285c0",
      },
    },
  },
  plugins: [],
}

