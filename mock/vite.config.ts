import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const mockRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: mockRoot,
  base: '/self-track-v4/mock/',
  plugins: [react()],
  build: {
    outDir: '../dist-pages/mock',
    emptyOutDir: false,
  },
});
