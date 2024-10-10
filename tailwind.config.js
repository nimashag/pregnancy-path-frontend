/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'clinic-guide' : '#FFC892',
        'clinic-assistant' : '#FC93C2'
      },
    },
  },
  plugins: [],
}

