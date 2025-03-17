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
    target: "https://cap-plan-creator.openearth.dev",
    changeOrigin: true,
    pathRewrite: {
      "^/plan-api/start_plan_creation": "/start_plan_creation",
      "^/plan-api/check_progress": "/check_progress",
      "^/plan-api/get_plan": "/get_plan",
    },
    logLevel: "debug",
    secure: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
