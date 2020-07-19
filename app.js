const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('*', (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join("./client", 'index.html'));
  }
  else{
    console.log('received request')
    res.sendStatus(404)
  }
});

module.exports = app;
