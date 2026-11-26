import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/lac-hong-so-nghiquyet57-cum1/',
  optimizeDeps: {
    entries: ['index.html']
  },
  server: {
    port: 5174,
    host: '127.0.0.1',
    watch: {
      ignored: ['**/dist/**', '**/test-results/**', '**/playwright-report/**']
    }
  },
  preview: {
    port: 4174,
    host: '127.0.0.1'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 900
  }
});
