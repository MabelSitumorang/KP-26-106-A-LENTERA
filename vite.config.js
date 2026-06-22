import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Vue 3 plugin - enables .vue single-file component support
    vue(),
  ],

  resolve: {
    alias: {
      // '@' maps to the 'src/' directory for cleaner imports
      // Usage: import MyComponent from '@/components/MyComponent.vue'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Development server configuration
  server: {
    port: 5173,        // Default Vite dev port
    open: true,        // Auto-open browser on dev start
    host: true,        // Expose to local network (optional)
  },

  // Build output configuration
  build: {
    outDir: 'dist',    // Output directory for production build
    sourcemap: true,   // Generate sourcemaps for debugging
  },
})
