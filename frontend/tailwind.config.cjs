module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#07090f",
        surfaceSoft: "#11151f",
        surfaceCold: "#151b27",
        brand: "#d8a24c",
        accent: "#7f6ced",
        glow: "#7a6de3",
        text: "#f7f6f1"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0,0,0,0.2)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(12,15,32,0.4)"
      }
    }
  },
  plugins: []
};
