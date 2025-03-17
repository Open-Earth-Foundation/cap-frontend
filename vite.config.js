import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Get the current environment
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_AWS_REGION': JSON.stringify(process.env.VITE_AWS_REGION),
    'process.env.VITE_AWS_ACCESS_KEY_ID': JSON.stringify(process.env.VITE_AWS_ACCESS_KEY_ID),
    'process.env.VITE_AWS_SECRET_ACCESS_KEY': JSON.stringify(process.env.VITE_AWS_SECRET_ACCESS_KEY),
    'process.env.VITE_AWS_S3_BUCKET_ID': JSON.stringify(process.env.VITE_AWS_S3_BUCKET_ID),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: isProduction ? "http://cap-api:8080" : (process.env.VITE_API_URL || "http://localhost:8080"),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/plan-api": {
        target: "https://cap-plan-creator.openearth.dev",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/plan-api/, ""),
      },
    },
  },
  esbuild: {
    loader: "jsx",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      "/api": {
        target: isProduction ? "http://cap-api:8080" : (process.env.VITE_API_URL || "http://localhost:8080"),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/plan-api": {
        target: "https://cap-plan-creator.openearth.dev",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/plan-api/, ""),
      },
    },
  },
});
