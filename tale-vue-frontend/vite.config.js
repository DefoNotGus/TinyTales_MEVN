// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './', // ✅ Makes assets use relative paths (fixes HTTP/HTTPS issues)
  plugins: [vue()],
  build: {
    outDir: '../frontend', // ✅ Exports build straight into your Express public folder
  },
});
