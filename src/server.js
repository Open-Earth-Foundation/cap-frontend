const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://adapta-brasil-api.replit.app",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
    logLevel: "debug",
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).send("Proxy Error");
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log("Proxy Response:", proxyRes.statusCode);
    },
  }),
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});

// Add a test route
app.get("/test", (req, res) => {
  res.send("Proxy server is working");
});
