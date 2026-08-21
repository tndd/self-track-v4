import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: appRoot,
  base: '/self-track-v4/app/',
  plugins: [react()],
  build: {
    outDir: '../dist-pages/app',
    emptyOutDir: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
