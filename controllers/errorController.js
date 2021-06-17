const AppError = require('../Utils/appError');

const handleCastErrorDB = error => {
  return new AppError(`Invalid ${error.path}: ${error.value}`, 404)
}

const handleDuplicateErrorDB = error => {
  const value = error.msg.match(/"(.*?[^\\])"/)[0]
  return new Error(`Duplicate Field: ${value}. Please use another one`, 400)
}

const handleValidationErrorDB = error => {
  const message = Object.values(error.errors).map(err => err.message)
  return new AppError(` Invalid input data: ${message.join('. ')}`, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  })
}

const sendErrorProd = (err, res) => {
  // operation error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    console.error('Error', err)
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong'
    })
  }
}

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err }
    if (error.name == 'CastError') error = handleCastErrorDB(error)
    if (error.code == 11000) error = handleDuplicateErrorDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    sendErrorProd(error, res)
  }
  next()
}

module.exports = errorController
