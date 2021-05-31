const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/subgraphs",
    createProxyMiddleware({
      target: "https://api.thegraph.com",
      changeOrigin: true,
    })
  );

  app.use(
    "/storage",
    createProxyMiddleware({
      target: "https://charts.berezka.io",
      changeOrigin: true,
    })
  );

  app.use(
    "/carry",
    createProxyMiddleware({
      target: "https://data.berezka.io",
      changeOrigin: true,
    })
  );

  app.use(
    "/price",
    createProxyMiddleware({
      target: "https://data.berezka.io",
      changeOrigin: true,
    })
  );

  app.use(
    "/rawprice",
    createProxyMiddleware({
      target: "https://data.berezka.io",
      changeOrigin: true,
    })
  );
};
