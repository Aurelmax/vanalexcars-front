/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'premium-black': '#121212',
        'premium-gray-dark': '#1e1e1e',
        'premium-gray': '#666666',
        'premium-gray-light': '#999999',
        'premium-white': '#f5f5f5',
        'premium-gold': '#bfa46f',
      },
    },
  },
  plugins: [],
};
