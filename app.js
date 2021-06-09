const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestedTime = new Date().toLocaleString();
  next();
});

app.use(express.static(`${__dirname}/public`));

const userRouter = require('./routes/userRoutes');
const expRouter = require('./routes/expRoutes');

app.use('/api/v1/exps', expRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
