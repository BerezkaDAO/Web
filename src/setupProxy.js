const { createProxyMiddleware } = require("http-proxy-middleware");

const api = () => {
  if (process.env["BEREZKA_USE_PROD"]) {
    console.log(`Using !! PRODUCTION !! API URL`);
    return "https://berezka.xyz";
  } else {
    console.log(`Using DEV API URL`);
    return "https://dev.berezka.xyz";
  }
};

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

  app.use(
    "/notification",
    createProxyMiddleware({
      target: "https://data.berezka.io",
      changeOrigin: true,
    })
  );

  app.use(
    "/api",
    createProxyMiddleware({
      target: api(),
      changeOrigin: true,
    })
  );
};
