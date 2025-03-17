
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

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

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
