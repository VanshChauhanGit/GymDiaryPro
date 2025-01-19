/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        text: "#050315",
        background: "#fbfbfe",
        primary: "#2f27ce",
        accent: "#433bff",
        secondary: "#dedcff",
      },
    },
  },
  plugins: [],
};
