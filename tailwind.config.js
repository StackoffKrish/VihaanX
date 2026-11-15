/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts}"],
  theme: {
    extend: {
      colors: {
        forest: "#176B45",
        forestDark: "#0F4D31",
        lime: "#C6E86B",
        limeLight: "#EAF6D1",
        cream: "#F8FAF5",
        charcoal: "#1A1E1B",
        muted: "#6B7280",
        border: "#E7EBE3",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { xl: "16px", lg: "12px" }
    },
  },
  plugins: [],
};
