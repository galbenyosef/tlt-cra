const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

const client = path.join(__dirname, 'client', 'build')

app.use(logger('combined'))
app.use(express.static(client));
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
