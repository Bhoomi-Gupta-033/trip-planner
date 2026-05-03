// module.exports = {
//   darkMode: "class",
//   content: ["./src/**/*.{js,jsx}", "./app/**/*.{js,jsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind v4 mein darkMode yahan nahi, globals.css mein @variant se hota hai
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
