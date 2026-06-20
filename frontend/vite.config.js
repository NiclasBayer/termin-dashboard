import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Lokaler Dev-Server (Frontend-only Prototyp, ohne Backend).
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    host: true,
  },
});
