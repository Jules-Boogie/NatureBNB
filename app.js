const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const npp = require('hpp')

const AppError = require('./Utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

// set security http requests
app.use(helmet());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// limit request from same client
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'exceeded the max number of requests. retry in an hour.',
});

// parses the body and reads data from req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization from malicious html code and xss
app.use(xss());

// prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'difficulty',
    'price',
    'ratingsAverage'
  ]
}))

//test
app.use((req, res, next) => {
  req.requestedTime = new Date().toLocaleString();
  next();
});

// serves static files
app.use(express.static(`${__dirname}/public`));

const userRouter = require('./routes/userRoutes');
const expRouter = require('./routes/expRoutes');

app.use('/api/v1/exps', expRouter);
app.use('/api/v1/users', userRouter);

// handle route error for all http requests
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//global errorhandler for the express
app.use(errorController);
module.exports = app;
