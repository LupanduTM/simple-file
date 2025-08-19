/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        accent: '#1ABC9C',
        neutral: '#ECF0F1',
        'dark-text': '#2D3436',
        'light-gray-bg': '#F5F6FA',
      },
    },
  },
  plugins: [],
}