export default {
  server: {
    proxy: {
      "/api/lp": {
        target: "http://localhost:5173",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            if (req.url === "/api/lp") {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "LP Created Successfully!" }));
            }
          });
        },
      },
    },
  },
};
