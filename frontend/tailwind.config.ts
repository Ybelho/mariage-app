import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#fdfdfb",
        dark: "#1e1e1e",
        sage: {
          DEFAULT: "#6e7763",
          600: "#5c6353",
          700: "#4a4f44"
        },
        grayx: {
          100: "#f5f5f5",
          200: "#eaeaea",
          300: "#dcdcdc",
          400: "#c8c8c8",
          500: "#a0a0a0",
          600: "#737373",
          700: "#4f4f4f",
          800: "#2d2d2d",
          900: "#1e1e1e"
        }
      },
      fontFamily: {
        elegant: ['"Playfair Display"', "serif"],
        body: ['"Libre Baskerville"', "serif"],
        ui: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,0.06)" },
      borderRadius: { card: "14px" }
    }
  },
  plugins: []
};

export default config;
