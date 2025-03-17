const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS with specific options
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Parse JSON bodies
app.use(express.json());

// Proxy for adapta-brasil-api
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

// Proxy for cap-plan-creator
app.use(
  "/plan-api",
  createProxyMiddleware({
    target: process.env.PLAN_API_URL || "https://cap-plan-creator.openearth.dev",
    changeOrigin: true,
    pathRewrite: {
      "^/plan-api": "",
    },
    logLevel: "debug",
    secure: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('\n=== Proxy Request ===');
      console.log('Method:', req.method);
      console.log('Path:', req.path);
      console.log('Original URL:', req.originalUrl);
      console.log('Target URL:', proxyReq.path);
      console.log('Headers:', proxyReq.getHeaders());
      if (req.body) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('\n=== Proxy Response ===');
      console.log('Status:', proxyRes.statusCode);
      console.log('Headers:', proxyRes.headers);
      
      let body = '';
      proxyRes.on('data', function(chunk) {
        body += chunk;
      });
      proxyRes.on('end', function() {
        console.log('Response Body:', body);
        try {
          JSON.parse(body);
          console.log('Response is valid JSON');
        } catch (e) {
          console.log('Response is not valid JSON:', e.message);
        }
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['content-type'] = 'application/json';
    },
    onError: (err, req, res) => {
      console.error("Plan Creator Proxy Error:", err);
      res
        .status(500)
        .json({ error: "Plan Creator Proxy Error", details: err.message });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the full response details
      console.log("Plan Creator Proxy Response:", {
        statusCode: proxyRes.statusCode,
        headers: proxyRes.headers,
        url: req.url,
      });

      let responseBody = "";
      proxyRes.on("data", (chunk) => {
        responseBody += chunk;
      });

      proxyRes.on("end", () => {
        console.log("Plan Creator Response Body:", responseBody);
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log the outgoing request
      console.log("Plan Creator Proxy Request:", {
        method: req.method,
        path: proxyReq.path,
        headers: proxyReq.getHeaders(),
      });

      // If there's a body, properly stream it
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
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
