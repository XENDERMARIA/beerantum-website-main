
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        brand: {
          purple: "#8B2FC9",
          magenta: "#CC00CC",
          "magenta-light": "#FF00FF",
          "purple-dark": "#5A1E8A",
          black: "#0A0A0F",
          "dark-1": "#0F0F1A",
          "dark-2": "#141420",
          "dark-3": "#1A1A2E",
          gray: "#2A2A3E",
          "gray-light": "#3A3A5C",
          text: "#E0E0F0",
          "text-muted": "#9090B0",
        },
      },
      fontFamily: {
        display: ["'Orbitron'", "sans-serif"],
        body: ["'Exo 2'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      maxWidth: {
        "page": "1600px",
        "page-wide": "1920px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spin 12s linear infinite reverse",
        "scan": "scanLine 6s linear infinite",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-18px)" } },
        pulseGlow: { "0%,100%": { boxShadow: "0 0 10px rgba(139,47,201,0.3)" }, "50%": { boxShadow: "0 0 35px rgba(204,0,204,0.65)" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scanLine: { "0%": { top: "-2px" }, "100%": { top: "100%" } },
      },
    },
  },
  plugins: [],
};
