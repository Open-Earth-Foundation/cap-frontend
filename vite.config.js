import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "https://adapta-brasil-api.replit.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/plan-api": {
        target: "https://cap-plan-creator.openearth.dev",
        changeOrigin: true,
        secure: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        rewrite: (path) => path.replace(/^\/plan-api/, ""),
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      "/api": {
        target: "https://adapta-brasil-api.replit.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/plan-api": {
        target: "https://cap-plan-creator.openearth.dev",
        changeOrigin: true,
        secure: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        rewrite: (path) => path.replace(/^\/plan-api/, ""),
      },
    },
  },
});