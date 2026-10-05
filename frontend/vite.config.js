import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    // Disable source maps in production
    sourcemap: false,

    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // ✅ Use esbuild (faster & no Netlify error)
    minify: 'esbuild',

    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'i18n-vendor': [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector'
          ],
        },
      },
    },
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'i18next',
      'react-i18next',
    ],
  },
})