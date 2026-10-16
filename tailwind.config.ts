import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202b",
        paper: "#f8f7f3",
        coral: "#f26a4f",
        mint: "#dff4e9",
        sand: "#efe8dc",
        line: "#e7e2da"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23,32,43,.08)",
        card: "0 8px 24px rgba(23,32,43,.06)"
      },
      fontFamily: {
        sans: ["var(--font-arabic)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
