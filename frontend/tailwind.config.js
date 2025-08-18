export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          border: '#333333',
          text: '#f5f5f5',
          muted: '#a0a0a0'
        }
      }
    },
  },
  plugins: [],
}