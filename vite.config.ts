import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(currentDirectory, './src'),
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
