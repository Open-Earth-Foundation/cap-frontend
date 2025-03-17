
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Proxy for cap-plan-creator
app.use(
  "/plan-api",
  createProxyMiddleware({
    target: "https://cap-plan-creator.openearth.dev",
    changeOrigin: true,
    pathRewrite: { "^/plan-api": "" },
    secure: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

// Proxy for adapta-brasil-api
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://adapta-brasil-api.replit.app",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    logLevel: "debug"
  })
);

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log('Static files being served from:', path.join(__dirname, '../dist'));
});
