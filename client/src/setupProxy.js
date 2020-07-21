const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    createProxyMiddleware({
        target: 'http://localhost:16656',
    })
  );

/*  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${process.env.PORT || '16656'}`,
      changeOrigin: true,
    })
  );*/

 };