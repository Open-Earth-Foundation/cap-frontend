import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://adapta-brasil-api.replit.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
};