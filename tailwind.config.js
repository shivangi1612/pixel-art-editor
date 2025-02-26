export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          dark: '#1a1a1a',
          light: '#2a2a2a',
          accent: '#3a3a3a',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui']
      }
    },
  },
  plugins: [],
}