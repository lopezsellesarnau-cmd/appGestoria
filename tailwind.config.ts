import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*", "./components/**/*", "./lib/**/*"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Geist", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
