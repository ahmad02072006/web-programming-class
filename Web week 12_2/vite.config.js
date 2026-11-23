import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// base './' => all asset URLs are relative, so the site works from any
// GitHub Pages sub-folder (e.g. /WebPro/week12_2/dist/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        hub: resolve(__dirname, 'index.html'),
        task1: resolve(__dirname, 'task1-weather/index.html'),
        task2: resolve(__dirname, 'task2-github/index.html'),
        task3: resolve(__dirname, 'task3-study-guide/index.html'),
        task4: resolve(__dirname, 'task4-effects-lab/index.html'),
        task5: resolve(__dirname, 'task5-sprint-quiz/index.html'),
      },
    },
  },
});
