/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          navy: "#0F3552",
          deep: "#12466B",
          teal: "#0EA5A0",
          tealDark: "#0B8783",
          sky: "#E7F1F6",
          mist: "#F5F9FA",
          coral: "#FF6B5E",
          amber: "#F5A623",
          line: "#DCE7EC",
          ink: "#16323F",
          slate: "#5B7684",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(15, 53, 82, 0.06)",
        pop: "0 10px 30px rgba(15, 53, 82, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(14,165,160,0.45)" },
          "70%": { boxShadow: "0 0 0 12px rgba(14,165,160,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(14,165,160,0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        toastIn: {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2s infinite",
        slideUp: "slideUp 0.4s ease-out",
        toastIn: "toastIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
