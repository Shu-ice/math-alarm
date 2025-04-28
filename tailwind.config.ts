import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-gradient-to-br",
    "from-purple-200",
    "via-pink-100",
    "to-orange-100",
    "from-yellow-100",
    "to-yellow-200",
    "from-red-100",
    "to-red-200"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
