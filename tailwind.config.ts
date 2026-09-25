import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        verdalia: {
          olive: "#355B24",
          light: "#9BAF78",
          gold: "#C9A227",
          beige: "#F3EBDD",
          offwhite: "#FCFAF5",
          dark: "#203A1A",
          gray: "#6E7168",
          cream: "#FAF7F0",
          card: "#FFFFFF",
          border: "#E7E2D7",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        arabic: ["var(--font-cairo)", "Cairo", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(32, 58, 26, 0.08)",
        card: "0 4px 20px -2px rgba(32, 58, 26, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
