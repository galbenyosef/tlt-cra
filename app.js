const express = require('express');
const compression = require('compression');
const path = require('path');
const client = path.join(__dirname, 'client', 'build')
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const sslRedirect = require('heroku-ssl-redirect').default

app.use(sslRedirect());
app.use(compression());
app.use(logger('dev'))
app.use(express.static(client));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', indexRouter);

app.get('*', (req, res) => {

  if (process.env.NODE_ENV === "production") {
    return res.sendFile('index.html', { root:client });
  }
  else{
    console.log('received request')
    return res.sendStatus(404)
  }
});

module.exports = app;
