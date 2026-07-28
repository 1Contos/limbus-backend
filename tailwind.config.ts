import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11110f",
        sand: {
          50: "#f7f3eb",
          100: "#eee6d8",
          400: "#a88f68",
          500: "#8c7451",
          600: "#715d41"
        }
      },
      boxShadow: {
        card: "0 24px 60px -38px rgba(17, 17, 15, 0.32)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: { rise: "rise 500ms ease-out both" }
    }
  },
  plugins: []
};

export default config;
