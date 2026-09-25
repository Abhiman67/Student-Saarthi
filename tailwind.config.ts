import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Claude Terracotta / Clay Primary (replaces default indigo across UI)
        indigo: {
          50: "#FAF6F3",
          100: "#F5ECE6",
          200: "#EBD8CD",
          300: "#DCBEB0",
          400: "#D39780",
          500: "#D97757", // Claude Iconic Coral/Terracotta
          600: "#C96442", // Primary interactive CTA button
          700: "#AF5133",
          800: "#8D3E24",
          900: "#3A1F16",
          950: "#24130D",
        },
        // Warm Ochre / Amber-Wood (replaces purple across UI)
        purple: {
          50: "#FBF7F2",
          100: "#F6EDE2",
          200: "#ECDEC9",
          300: "#DFC7AA",
          400: "#D0AC87",
          500: "#BA8B60",
          600: "#A2744B",
          700: "#855A37",
          800: "#6B4527",
          900: "#382313",
        },
        violet: {
          50: "#FAF5F1",
          100: "#F4EAE2",
          200: "#E9D5C5",
          300: "#D8BBA4",
          400: "#C69B7E",
          500: "#D97757",
          600: "#B85D3E",
          700: "#99472B",
          800: "#79331D",
          900: "#351910",
        },
        // Claude Warm Sand / Parchment Neutrals (replaces cool slate)
        slate: {
          50: "#FAF8F5", // Claude warm paper background
          100: "#F4EFEA", // Claude card & input background
          200: "#E8E2D9", // Claude warm border
          300: "#D7CFC4", // Border focus
          400: "#9E978C", // Secondary muted label
          500: "#746E65", // Muted text
          600: "#524E47", // Readable body text
          700: "#3A3631", // Strong body
          800: "#272420", // Subheading
          900: "#181614", // Claude deep charcoal
          950: "#0D0C0B",
        },
        claude: {
          bg: "#FAF8F5",
          card: "#FFFFFF",
          border: "#E8E2D9",
          text: "#181614",
          muted: "#746E65",
          clay: "#D97757",
          clayDark: "#C96442",
          clayLight: "#F5ECE6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
