/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#2351DC",
        "primary-dark": "#001EA7",
        risk: {
          veryhigh: "#E80A0A",
          high: "#E06835",
          medium: "#F59E0B",
          low: "#3B82F6",
        },
        gray: {
          text: "#575757",
          border: "#E4E4E4",
          inactive: "#E2E2E2",
        }
      },
      spacing: {
        '18': '4.5rem',
      },
      boxShadow: {
        'card': '0px 2px 4px -2px rgba(0, 0, 0, 0.10)',
      }
    },
  },
  plugins: [],
}