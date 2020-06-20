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

/*   app.use(morgan('combined'));
 */};