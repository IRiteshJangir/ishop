/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00a78e",
          hover: "#00907a",
          dark: "#007a67",
          light: "#e6f7f4",
          surface: "#f0fbf9",
        },
        admin: {
          primary: "#5046e5",
          hover: "#4338ca",
          light: "#eef2ff",
          dark: "#312e81",
        },
        accent: {
          yellow: "#f59e0b",
          red: "#ef4444",
          green: "#10b981",
          blue: "#3b82f6",
        },
        slate: {
          850: "#151e2e",
          950: "#0b0f19",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
