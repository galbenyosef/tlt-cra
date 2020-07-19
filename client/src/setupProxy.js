const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/kala",
    createProxyMiddleware({
        target: 'https://tlt.kala-crm.co.il',
        changeOrigin: true,
        pathRewrite: {
          '^/kala':'/api'
        }
    })
  );

/*  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${process.env.PORT || '16656'}`,
      changeOrigin: true,
    })
  );*/

/*   app.use(morgan('combined'));
 */};