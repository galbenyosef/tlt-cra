const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const indexRouter = require('./routes/index');

const app = express();

const client = path.join(__dirname, 'client', 'build')

app.use(express.static(client));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(createProxyMiddleware({
  target: 'https://tlt.kala-crm.co.il',
  changeOrigin: true,
  pathRewrite: {
    '^/kala':'/api'
  }
}))
app.use('/', indexRouter);


app.get('*', (req, res) => {

  if (process.env.NODE_ENV === "production") {
    res.sendFile('index.html', { root:client });
  }
  else{
    console.log('received request')
    res.sendStatus(404)
  }
});

module.exports = app;
