/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E8252A",
          dark: "#c41e22",
          soft: "#FCE8EA",
        },
        base: {
          bg: "#f4f5f7",
          card: "#ffffff",
          text: "#1a1a2e",
          muted: "#6b7280",
          border: "#e5e7eb",
          green: "#10b981",
          orange: "#f59e0b",
          blue: "#3b82f6",
        },
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        cardHover: "0 6px 20px rgba(0,0,0,0.1)",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
    },
  },
  plugins: [],
};
