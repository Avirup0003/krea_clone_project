import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        foreground: "#f4f4f5",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#18181b",
          foreground: "#a1a1aa",
        },
        border: "#27272a",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;