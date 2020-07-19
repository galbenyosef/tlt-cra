const {createProxyMiddleware} = require("http-proxy-middleware");
const morgan = require("morgan");

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

  app.use(
    "/api",
    createProxyMiddleware({
      target: 'http://localhost:16656',
      changeOrigin: true,
    })
  );

/*   app.use(morgan('combined'));
 */};